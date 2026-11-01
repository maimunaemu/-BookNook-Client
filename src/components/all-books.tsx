"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import BookCard from "@/components/book-card";
import EmptyState from "@/components/empty-state";
import LoadingState from "@/components/loading-state";
import { apiRequest, ApiError } from "@/lib/api";
import { bookCategories, type Book, type BookCategory } from "@/lib/types";

export default function AllBooks({ initialCategory }: { initialCategory: string }) {
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      const query = new URLSearchParams();
      if (search.trim()) query.set("q", search.trim());
      if (category) query.set("category", category);
      try {
        const result = await apiRequest<{ books: Book[] }>(`/books?${query}`, { signal: controller.signal }, false);
        setBooks(result.books);
      } catch (reason) {
        if (!controller.signal.aborted) {
          setError(reason instanceof ApiError ? reason.message : "We couldn't load the shelves.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 180);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [category, search]);

  return (
    <>
      <section className="border-b border-[#e8e4da] bg-[#f0eee6]">
        <div className="page-width py-12 sm:py-16">
          <p className="eyebrow">A collection in motion</p>
          <h1 className="serif mt-3 text-5xl sm:text-6xl">Browse the shelves.</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#70796f]">
            Every book here belongs to a reader. Find something that speaks to you, and let the next chapter begin.
          </p>
        </div>
      </section>
      <section className="page-width py-9 sm:py-12">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#858e83]" />
            <input
              type="search"
              className="field !min-h-12 !rounded-full pl-11"
              placeholder="Search by title or author"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search books by title or author"
            />
          </label>
          <label className="relative sm:w-56">
            <SlidersHorizontal size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#858e83]" />
            <select className="field !min-h-12 !rounded-full appearance-none pl-10 pr-9" value={category} onChange={(event) => setCategory(event.target.value as BookCategory | "")} aria-label="Filter by category">
              <option value="">All categories</option>
              {bookCategories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          {(search || category) && (
            <button type="button" onClick={() => { setSearch(""); setCategory(""); }} className="button-secondary !min-h-12">
              <X size={15} /> Clear
            </button>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-[#717a71]">
            {loading ? "Looking through the shelves…" : `${books.length} ${books.length === 1 ? "book" : "books"} to explore`}
          </p>
        </div>
        <div className="mt-5">
          {loading ? (
            <LoadingState label="Looking through the shelves…" className="min-h-64" />
          ) : error ? (
            <div className="rounded-2xl border border-[#e5ddd3] bg-[#fffefa] px-6 py-12 text-center">
              <h2 className="serif text-2xl">We couldn&apos;t reach the shelves.</h2>
              <p className="mt-2 text-sm text-[#747d73]">{error}</p>
              <button type="button" onClick={() => setSearch((value) => `${value} `)} className="button-secondary mt-5">Try again</button>
            </div>
          ) : books.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3">
              {books.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
          ) : (
            <EmptyState
              title={search || category ? "No books found this time." : "These shelves are waiting."}
              description={search || category ? "Try a different title, author, or category." : "When readers share a book, you’ll find it here."}
              search={Boolean(search || category)}
            />
          )}
        </div>
      </section>
    </>
  );
}
