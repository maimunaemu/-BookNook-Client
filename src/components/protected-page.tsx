"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?callbackURL=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, pathname, router, session]);

  if (isPending || !session) {
    return (
      <div className="page-width flex min-h-[55vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[#717a71]" role="status">
          <span className="size-5 animate-spin rounded-full border-2 border-[#cad5c9] border-t-[#244b3a]" />
          Checking your reading-room pass…
        </div>
      </div>
    );
  }

  return children;
}
