import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BookCover from "@/components/book-cover";
import type { Book } from "@/lib/types";

export default function BookCard({ book }: { book: Book }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-[#e8e5dc] bg-[#fffefa] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(33,50,39,0.09)]">
      <Link href={`/books/${book.id}`} className="block">
        <BookCover src={book.coverImage} title={book.title} className="aspect-[4/4.7]" />
      </Link>
      <div className="p-4 sm:p-5">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#bd7158]">{book.category}</span>
        <h3 className="serif mt-1.5 line-clamp-2 min-h-[3.4rem] text-[1.16rem] leading-[1.35] text-[#26352c]">
          {book.title}
        </h3>
        <p className="mt-1 truncate text-sm text-[#7a8178]">by {book.author}</p>
        <div className="mt-4 border-t border-[#efede6] pt-3">
          <Link href={`/books/${book.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#244b3a] hover:text-[#bd7158]">
            View details <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
