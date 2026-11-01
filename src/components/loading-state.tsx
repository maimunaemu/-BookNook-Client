import { LoaderCircle } from "lucide-react";

export default function LoadingState({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex min-h-40 items-center justify-center gap-3 text-sm text-[#717a71] ${className}`} role="status" aria-live="polite">
      <LoaderCircle size={20} className="animate-spin text-[#526b56]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
