"use client";

import Link from "next/link";
import { ArrowRight, BookHeart, Compass, Feather, Leaf, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import HeroSlider from "@/components/hero-slider";
import BookCard from "@/components/book-card";
import EmptyState from "@/components/empty-state";
import { apiRequest, ApiError } from "@/lib/api";
import type { Book } from "@/lib/types";

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBooks() {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<{ books: Book[] }>("/books?limit=6", {}, false);
      setBooks(result.books);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "The latest books are taking a moment to arrive.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadBooks(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <HeroSlider />

      <section className="page-width py-20 sm:py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Fresh on the shelves</p>
            <h2 className="serif mt-3 text-4xl sm:text-[2.8rem]">Recently shared</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#747d73]">
              The newest stories finding their way around the Nook.
            </p>
          </div>
          <Link href="/books" className="button-secondary w-fit">
            See all books <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-9">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/4.7] rounded-xl bg-[#e9e7dd]" />
                  <div className="mt-4 h-3 w-16 rounded bg-[#e9e7dd]" />
                  <div className="mt-2 h-5 rounded bg-[#e9e7dd]" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-[#e9e7dd]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[#e5ddd3] bg-[#fffefa] px-6 py-10 text-center">
              <p className="serif text-2xl">The shelves are taking a breath.</p>
              <p className="mt-2 text-sm text-[#747d73]">{error}</p>
              <button type="button" onClick={() => void loadBooks()} className="button-secondary mt-5">
                <RefreshCw size={15} /> Try again
              </button>
            </div>
          ) : books.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {books.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
          ) : (
            <EmptyState
              title="A fresh shelf, ready for a story."
              description="No books have been added just yet. Have a favorite to share? It can be the first."
              action="Add a book"
              href="/add-book"
            />
          )}
        </div>
      </section>

      <section className="bg-[#eeeae0]">
        <div className="page-width grid gap-12 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="eyebrow">A shelf with a story</p>
            <h2 className="serif mt-4 max-w-md text-4xl leading-[1.08] sm:text-5xl">
              Books are even better when they find a new home.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#6d766d]">
              BookNook brings readers together around the books they already own. Lend a story, discover another, and keep the good pages turning.
            </p>
            <Link href="/register" className="button-primary mt-7">
              Find your place here <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Compass, title: "Find a story", description: "Explore what readers nearby are ready to share." },
              { icon: BookHeart, title: "Borrow with care", description: "Keep track of the books making their rounds." },
              { icon: Feather, title: "Pass it along", description: "Add a well-loved book to somebody else’s next chapter." },
            ].map(({ icon: Icon, title, description }, index) => (
              <article key={title} className={`rounded-2xl bg-[#fffefa] p-5 sm:p-6 ${index === 1 ? "sm:translate-y-7" : ""}`}>
                <span className="flex size-11 items-center justify-center rounded-full bg-[#e9eee5] text-[#315640]">
                  <Icon size={20} strokeWidth={1.7} />
                </span>
                <h3 className="serif mt-5 text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#788077]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-width py-20 sm:py-24">
        <div className="flex flex-col justify-between gap-6 border-b border-[#e4e0d6] pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">A little something for every reader</p>
            <h2 className="serif mt-3 text-4xl">Follow your curiosity.</h2>
          </div>
          <Link href="/books" className="inline-flex items-center gap-2 text-sm font-semibold text-[#244b3a] hover:text-[#bd7158]">
            Browse the collection <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            ["Fiction", "Worlds to wander through", "#e7e9dd"],
            ["Science", "Questions worth following", "#e5e9e8"],
            ["History", "Stories that shaped us", "#eee6dc"],
            ["Kids", "Big adventures, little readers", "#f0e5df"],
            ["Others", "Unexpected discoveries", "#e8e4ed"],
          ].map(([category, note, color]) => (
            <Link
              key={category}
              href={`/books?category=${category}`}
              className="group rounded-xl p-5 transition-transform hover:-translate-y-1 sm:p-6"
              style={{ backgroundColor: color }}
            >
              <Leaf size={17} className="text-[#59735d]" />
              <p className="serif mt-7 text-xl">{category}</p>
              <p className="mt-1 text-xs leading-5 text-[#6e776d]">{note}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
