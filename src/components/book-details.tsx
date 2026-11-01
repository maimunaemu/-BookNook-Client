"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, CalendarDays, Check, LoaderCircle, Mail, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BookCover from "@/components/book-cover";
import LoadingState from "@/components/loading-state";
import { apiRequest, ApiError } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Book } from "@/lib/types";

export default function BookDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [borrowedByUser, setBorrowedByUser] = useState(false);
  const isOwner = session?.user.id === book?.ownerId;

  useEffect(() => {
    let active = true;
    void apiRequest<{ book: Book }>(`/books/${encodeURIComponent(id)}`)
      .then(({ book: result }) => { if (active) setBook(result); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof ApiError ? reason.message : "We couldn't open this book.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (book) document.title = `BookNook | ${book.title}`;
  }, [book]);

  async function borrowBook(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!book) return;
    setBusy(true);
    try {
      await apiRequest("/borrows", { method: "POST", body: JSON.stringify({ bookId: book.id }) });
      toast.success("It's yours to read. Your loan has been added.");
      setBorrowDialogOpen(false);
      setBorrowedByUser(true);
      setBook((current) => current ? { ...current, availableCopies: Math.max(0, current.availableCopies - 1) } : current);
      try {
        const refreshed = await apiRequest<{ book: Book }>(`/books/${encodeURIComponent(book.id)}`);
        setBook(refreshed.book);
      } catch {
        toast.error("Your loan was saved, but availability could not refresh. Reload this page to see the latest count.");
      }
    } catch (reason) {
      toast.error(reason instanceof ApiError ? reason.message : "We couldn't borrow this book. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function openBorrowDialog() {
    if (!session) {
      router.push(`/login?callbackURL=${encodeURIComponent(`/books/${id}`)}`);
      return;
    }
    setBorrowDialogOpen(true);
  }

  if (loading) {
    return <LoadingState label="Opening the book details…" className="min-h-[60vh]" />;
  }

  if (error || !book) {
    return (
      <div className="page-width flex min-h-[55vh] flex-col items-center justify-center text-center">
        <BookOpen size={28} className="text-[#708471]" />
        <h1 className="serif mt-4 text-3xl">{error ? "This page is out of reach." : "We couldn't find that book."}</h1>
        <p className="mt-2 max-w-md text-sm text-[#747d73]">{error}</p>
        <Link href="/books" className="button-secondary mt-6"><ArrowLeft size={15} /> Back to all books</Link>
      </div>
    );
  }

  return (
    <section className="page-width py-8 sm:py-12">
      <Link href="/books" className="inline-flex items-center gap-2 text-sm font-medium text-[#717a71] hover:text-[#244b3a]">
        <ArrowLeft size={15} /> All books
      </Link>
      <div className="mt-8 grid gap-9 md:grid-cols-[minmax(280px,0.8fr)_1.2fr] md:gap-16">
        <div className="mx-auto w-full max-w-[410px]">
          <BookCover src={book.coverImage} title={book.title} className="aspect-[3/4] rounded-2xl shadow-[0_20px_55px_rgba(35,47,37,0.13)]" />
        </div>
        <div className="py-2 md:py-5">
          <p className="eyebrow">{book.category}</p>
          <h1 className="serif mt-3 text-4xl leading-[1.08] sm:text-5xl">{book.title}</h1>
          <p className="mt-3 text-lg text-[#727b72]">by {book.author}</p>
          <div className="mt-7 flex flex-wrap gap-3 text-xs">
            <span className={`rounded-full px-3 py-1.5 font-semibold ${book.availableCopies > 0 ? "bg-[#e6eee2] text-[#426247]" : "bg-[#f3e7e1] text-[#a25340]"}`}>
              {book.availableCopies > 0 ? `${book.availableCopies} ${book.availableCopies === 1 ? "copy" : "copies"} available` : "Currently on loan"}
            </span>
            <span className="rounded-full bg-[#eeece5] px-3 py-1.5 font-semibold text-[#6a746b]">{book.totalCopies} total {book.totalCopies === 1 ? "copy" : "copies"}</span>
          </div>
          <div className="my-8 h-px bg-[#e5e2d9]" />
          <h2 className="serif text-2xl">A little about this book</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#667168]">{book.description}</p>

          <div className="mt-8 grid gap-4 rounded-xl bg-[#efeee7] p-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <UserRound size={17} className="mt-0.5 text-[#65806a]" />
              <div><p className="text-xs text-[#81887f]">Shared by</p><p className="mt-1 text-sm font-medium">{book.ownerName}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays size={17} className="mt-0.5 text-[#65806a]" />
              <div><p className="text-xs text-[#81887f]">Added to the Nook</p><p className="mt-1 text-sm font-medium">{new Date(book.addedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</p></div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {isOwner ? (
              <Link href="/my-books" className="button-secondary"><Check size={16} /> Your book</Link>
            ) : (
              <button type="button" disabled={busy || borrowedByUser || book.availableCopies === 0} onClick={openBorrowDialog} className="button-primary min-w-44">
                {borrowedByUser ? <Check size={16} /> : <BookOpen size={16} />}
                {borrowedByUser ? "Borrowed by you" : book.availableCopies === 0 ? "No copies available" : "Borrow this book"}
              </button>
            )}
            <Link href="/books" className="button-secondary">Keep browsing</Link>
          </div>
          <p className="mt-4 text-xs text-[#858d84]">Loans are for 14 days. Please return your book when you’re done.</p>
        </div>
      </div>
      {borrowDialogOpen && session && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17251e]/60 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) setBorrowDialogOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="borrow-dialog-title"
            className="w-full max-w-lg rounded-2xl bg-[#fffefa] p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">One more good story</p>
                <h2 id="borrow-dialog-title" className="serif mt-2 text-3xl">Confirm your borrow.</h2>
                <p className="mt-2 text-sm text-[#737b72]">This book will be yours to read for 14 days.</p>
              </div>
              <button type="button" disabled={busy} onClick={() => setBorrowDialogOpen(false)} className="rounded-full p-2 text-[#717a71] hover:bg-[#f0eee6] disabled:opacity-50" aria-label="Close borrow confirmation">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={(event) => void borrowBook(event)} className="mt-6 space-y-4">
              <label className="block text-sm font-medium">
                Your name
                <span className="relative mt-1.5 block">
                  <UserRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92998f]" />
                  <input className="field pl-10" value={session.user.name} readOnly aria-readonly="true" />
                </span>
              </label>
              <label className="block text-sm font-medium">
                Your email
                <span className="relative mt-1.5 block">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92998f]" />
                  <input className="field pl-10" type="email" value={session.user.email} readOnly aria-readonly="true" />
                </span>
              </label>
              <button type="submit" disabled={busy || book.availableCopies === 0} className="button-primary mt-2 w-full">
                {busy ? <LoaderCircle size={16} className="animate-spin" /> : <BookOpen size={16} />}
                {busy ? "Saving your loan…" : "Confirm borrow"}
              </button>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
