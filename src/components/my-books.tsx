"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LoaderCircle, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import BookCover from "@/components/book-cover";
import BookForm from "@/components/book-form";
import EmptyState from "@/components/empty-state";
import { apiRequest, ApiError } from "@/lib/api";
import type { Book } from "@/lib/types";

export default function MyBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [busy, setBusy] = useState(false);

  const loadBooks = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    if (showLoading) setError("");
    try {
      const result = await apiRequest<{ books: Book[] }>("/books/mine");
      setBooks(result.books);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "We couldn't load your books.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadBooks(false); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadBooks]);

  async function deleteBook() {
    if (!deleting) return;
    setBusy(true);
    try {
      await apiRequest(`/books/${encodeURIComponent(deleting.id)}`, { method: "DELETE" });
      toast.success("The book has been removed from your shelf.");
      setDeleting(null);
      await loadBooks();
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "We couldn't remove this book.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="border-b border-[#e8e4da] bg-[#f0eee6]">
        <div className="page-width flex flex-col gap-5 py-11 sm:flex-row sm:items-end sm:justify-between sm:py-14">
          <div>
            <p className="eyebrow">A shelf of your own</p>
            <h1 className="serif mt-3 text-5xl">My books.</h1>
            <p className="mt-3 text-sm text-[#70796f]">Keep your shared stories tidy and ready to travel.</p>
          </div>
          <Link href="/add-book" className="button-primary w-fit"><Plus size={16} /> Add a book</Link>
        </div>
      </section>
      <section className="page-width py-9 sm:py-12">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-[#737b72]">{loading ? "Gathering your books…" : `${books.length} ${books.length === 1 ? "book" : "books"} on your shelf`}</p>
          <button type="button" onClick={() => void loadBooks()} className="inline-flex items-center gap-2 text-xs font-semibold text-[#526b56] hover:text-[#bd7158]"><RefreshCw size={14} /> Refresh</button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="aspect-[4/5.5] animate-pulse rounded-xl bg-[#e9e7dd]" />)}</div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p className="serif text-2xl">Your shelf is temporarily out of reach.</p>
            <p className="mt-2 text-sm text-[#747d73]">{error}</p>
            <button type="button" onClick={() => void loadBooks()} className="button-secondary mt-5">Try again</button>
          </div>
        ) : books.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article key={book.id} className="flex gap-4 rounded-xl border border-[#e8e5dc] bg-[#fffefa] p-4 sm:p-5">
                <BookCover src={book.coverImage} title={book.title} className="aspect-[3/4] w-[92px] shrink-0 rounded-lg" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[0.63rem] font-bold uppercase tracking-[0.13em] text-[#bd7158]">{book.category}</p>
                  <h2 className="serif mt-1 line-clamp-2 text-xl leading-tight">{book.title}</h2>
                  <p className="mt-1 truncate text-sm text-[#7a8178]">by {book.author}</p>
                  <p className="mt-2 text-xs text-[#788077]">{book.availableCopies} of {book.totalCopies} available</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <button type="button" onClick={() => setEditing(book)} className="button-secondary !min-h-9 !rounded-lg !px-3 !text-xs"><Pencil size={13} /> Edit</button>
                    <button type="button" onClick={() => setDeleting(book)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#eadbd4] px-3 text-xs font-semibold text-[#a25340] hover:bg-[#fbf2ee]"><Trash2 size={13} /> Remove</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="Your shelf has room for a story." description="Add a book you’d like to share. Readers can find it here and borrow it from you." action="Add your first book" href="/add-book" />
        )}
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#17251e]/55 p-3 sm:p-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="edit-book-title" className="mx-auto my-6 max-w-3xl rounded-2xl bg-[#f7f5ef] p-5 shadow-2xl sm:my-10 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div><p className="eyebrow">Make an update</p><h2 id="edit-book-title" className="serif mt-2 text-3xl">Edit your book.</h2></div>
              <button type="button" onClick={() => setEditing(null)} className="rounded-full p-2 text-[#717a71] hover:bg-white" aria-label="Close edit form">×</button>
            </div>
            <BookForm book={editing} onCancel={() => setEditing(null)} onComplete={() => { setEditing(null); void loadBooks(); }} />
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17251e]/55 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) setDeleting(null); }}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="delete-book-title" aria-describedby="delete-book-description" className="w-full max-w-md rounded-2xl bg-[#fffefa] p-6 shadow-2xl sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-full bg-[#f7eae4] text-[#a25340]"><Trash2 size={19} /></span>
            <h2 id="delete-book-title" className="serif mt-5 text-2xl">Remove this book?</h2>
            <p id="delete-book-description" className="mt-2 text-sm leading-6 text-[#717a71]">
              <span className="font-semibold text-[#29382f]">{deleting.title}</span> will be removed from your shelf. This can’t be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={busy} onClick={() => setDeleting(null)} className="button-secondary">Keep book</button>
              <button type="button" disabled={busy} onClick={() => void deleteBook()} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#a25340] px-5 text-sm font-semibold text-white hover:bg-[#874331] disabled:opacity-60">
                {busy ? <LoaderCircle size={15} className="animate-spin" /> : <Trash2 size={15} />}
                {busy ? "Removing…" : "Remove book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
