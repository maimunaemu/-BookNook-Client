import Link from "next/link";
import { BookOpen, SearchX } from "lucide-react";

export default function EmptyState({
  title,
  description,
  action,
  href,
  search = false,
}: {
  title: string;
  description: string;
  action?: string;
  href?: string;
  search?: boolean;
}) {
  const Icon = search ? SearchX : BookOpen;
  return (
    <div className="rounded-2xl border border-dashed border-[#d7d9d0] bg-white/50 px-6 py-14 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e8eee5] text-[#41614c]">
        <Icon size={21} />
      </span>
      <h2 className="serif mt-4 text-2xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#737b72]">{description}</p>
      {action && href && <Link href={href} className="button-primary mt-6">{action}</Link>}
    </div>
  );
}
