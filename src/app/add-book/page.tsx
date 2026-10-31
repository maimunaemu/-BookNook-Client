import type { Metadata } from "next";
import BookForm from "@/components/book-form";
import ProtectedPage from "@/components/protected-page";

export const metadata: Metadata = { title: "Add a Book" };

export default function AddBookPage() {
  return (
    <ProtectedPage>
      <section className="page-width max-w-4xl py-10 sm:py-14">
        <p className="eyebrow">Pass a good story along</p>
        <h1 className="serif mt-3 text-4xl sm:text-5xl">Add a book to the shelf.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#747d73]">
          Tell readers a little about the book, and let them know how many copies are ready to travel.
        </p>
        <div className="mt-8 rounded-2xl border border-[#e8e5dc] bg-[#fffefa] p-5 sm:p-8">
          <BookForm />
        </div>
      </section>
    </ProtectedPage>
  );
}
