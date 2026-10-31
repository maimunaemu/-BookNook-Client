import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <section className="page-width flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-[#e7eee4] text-[#315640]"><BookOpen size={23} /></span>
      <p className="eyebrow mt-6">A page between the pages</p>
      <h1 className="serif mt-3 text-6xl">Lost your place?</h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-[#747d73]">We couldn’t find this page. Let’s take you back to a shelf you know.</p>
      <Link href="/" className="button-primary mt-7"><ArrowLeft size={15} /> Back to home</Link>
    </section>
  );
}
