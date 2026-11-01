"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, CalendarClock, LoaderCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import BookCover from "@/components/book-cover";
import EmptyState from "@/components/empty-state";
import LoadingState from "@/components/loading-state";
import { apiRequest, ApiError } from "@/lib/api";
import type { Borrow } from "@/lib/types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function MyBorrows() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returning, setReturning] = useState<string | null>(null);

  const loadBorrows = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    if (showLoading) setError("");
    try {
      const result = await apiRequest<{ borrows: Borrow[] }>("/borrows");
      setBorrows(result.borrows);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "We couldn't find your borrowed books.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadBorrows(false); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadBorrows]);

  async function returnBook(borrow: Borrow) {
    setReturning(borrow.id);
    try {
      await apiRequest(`/borrows/${encodeURIComponent(borrow.id)}`, { method: "DELETE" });
      setBorrows((current) => current.filter((item) => item.id !== borrow.id));
      toast.success("Thank you for passing the book along.");
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "We couldn't return this book. Please try again.");
    } finally {
      setReturning(null);
    }
  }

  return (
    <>
      <section className="border-b border-[#e8e4da] bg-[#f0eee6]">
        <div className="page-width py-11 sm:py-14">
          <p className="eyebrow">Stories on the way</p>
          <h1 className="serif mt-3 text-5xl">My borrows.</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#70796f]">A little home for the books you’re reading. Loans are due 14 days after you borrow.</p>
        </div>
      </section>
      <section className="page-width py-9 sm:py-12">
        {loading ? (
          <LoadingState label="Finding your borrowed books…" className="min-h-64" />
        ) : error ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <h2 className="serif text-2xl">Your reading list is out of reach.</h2>
            <p className="mt-2 text-sm text-[#747d73]">{error}</p>
            <button type="button" onClick={() => void loadBorrows()} className="button-secondary mt-5">Try again</button>
          </div>
        ) : borrows.length ? (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-[#737b72]">{borrows.length} {borrows.length === 1 ? "book" : "books"} out with you</p>
            </div>
            <div className="hidden overflow-hidden rounded-xl border border-[#e8e5dc] bg-[#fffefa] md:block">
              <table className="w-full border-collapse text-left">
                <thead className="bg-[#efeee7] text-[0.68rem] uppercase tracking-[0.13em] text-[#7a8379]">
                  <tr><th className="px-5 py-4 font-semibold">Book</th><th className="px-4 py-4 font-semibold">Borrowed</th><th className="px-4 py-4 font-semibold">Due date</th><th className="px-5 py-4 text-right font-semibold">Action</th></tr>
                </thead>
                <tbody>
                  {borrows.map((borrow) => (
                    <tr key={borrow.id} className="border-t border-[#efede6]">
                      <td className="px-5 py-4">
                        {borrow.book ? (
                          <Link href={`/books/${borrow.book.id}`} className="flex items-center gap-3 group">
                            <BookCover src={borrow.book.coverImage} title={borrow.book.title} className="aspect-[3/4] w-12 shrink-0 rounded-md" />
                            <span className="min-w-0"><span className="serif block truncate text-lg group-hover:text-[#bd7158]">{borrow.book.title}</span><span className="mt-0.5 block truncate text-xs text-[#7b837a]">by {borrow.book.author}</span></span>
                          </Link>
                        ) : <span className="text-sm text-[#788077]">Book details unavailable</span>}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#606b61]">{formatDate(borrow.borrowedAt)}</td>
                      <td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 text-sm text-[#606b61]"><CalendarClock size={14} /> {formatDate(borrow.dueAt)}</span></td>
                      <td className="px-5 py-4 text-right">
                        <button type="button" disabled={returning === borrow.id} onClick={() => void returnBook(borrow)} className="button-secondary !min-h-9 !px-3 !text-xs">
                          {returning === borrow.id ? <LoaderCircle size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                          {returning === borrow.id ? "Returning…" : "Return book"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 md:hidden">
              {borrows.map((borrow) => (
                <article key={borrow.id} className="flex gap-4 rounded-xl border border-[#e8e5dc] bg-[#fffefa] p-4">
                  {borrow.book && <BookCover src={borrow.book.coverImage} title={borrow.book.title} className="aspect-[3/4] w-[74px] shrink-0 rounded-md" />}
                  <div className="flex min-w-0 flex-1 flex-col">
                    {borrow.book ? <Link href={`/books/${borrow.book.id}`} className="serif line-clamp-2 text-lg">{borrow.book.title}</Link> : <p className="text-sm">Book details unavailable</p>}
                    <p className="mt-1 text-xs text-[#737b72]">Borrowed {formatDate(borrow.borrowedAt)}</p>
                    <p className="mt-1 text-xs text-[#737b72]">Due {formatDate(borrow.dueAt)}</p>
                    <button type="button" disabled={returning === borrow.id} onClick={() => void returnBook(borrow)} className="button-secondary mt-3 w-fit !min-h-9 !px-3 !text-xs">
                      {returning === borrow.id ? <LoaderCircle size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                      {returning === borrow.id ? "Returning…" : "Return book"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <EmptyState title="No books out with you." description="A good next read is waiting somewhere on the shelves." action="Find a book" href="/books" search />
        )}
      </section>
      <div className="page-width -mt-2 pb-2 text-center">
        <Link href="/books" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#244b3a] hover:text-[#bd7158]">Find another read <ArrowUpRight size={15} /></Link>
      </div>
    </>
  );
}
