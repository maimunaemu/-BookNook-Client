"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/components/theme-toggle";
import BookNookLogo from "@/components/booknook-logo";

const navigation = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/add-book", private: true },
  { label: "My Books", href: "/my-books", private: true },
  { label: "My Borrows", href: "/my-borrows", private: true },
];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const result = await authClient.signOut();
    if (result.error) {
      toast.error(result.error.message ?? "We couldn't sign you out. Please try again.");
      return;
    }
    toast.success("You’re signed out. See you soon.");
    router.push("/");
  }

  const visibleNavigation = navigation.filter((item) => !item.private || Boolean(session));

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[#e9e5db] bg-[#f7f5ef]/95 backdrop-blur-md">
        <div className="page-width flex h-[76px] items-center justify-between gap-5 max-[380px]:gap-2 max-[380px]:px-3">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 max-[380px]:gap-1.5" aria-label="BookNook home">
            <BookNookLogo subtitle />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {visibleNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[0.83rem] transition-colors hover:text-terracotta ${
                  pathname === item.href ? "font-semibold text-forest" : "text-[#606961]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3 max-[380px]:gap-2">
            <ThemeToggle />
            {!isPending && (session ? (
              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full p-1.5 pr-2.5 hover:bg-white">
                  {session.user.image ? (
                    // The profile image is an arbitrary URL supplied by the account owner.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="" className="size-8 rounded-full object-cover" />
                  ) : (
                    <span className="flex size-8 items-center justify-center rounded-full bg-surface-soft text-sm font-semibold text-forest">
                      {session.user.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <span className="hidden max-w-28 truncate text-sm font-medium sm:block">{session.user.name}</span>
                  <ChevronDown size={15} className="text-[#717a71] transition-transform group-open:rotate-180" />
                </summary>
                <div className="absolute right-0 top-[calc(100%+0.65rem)] z-40 w-56 rounded-xl border border-[#e6e2d8] bg-white p-2 shadow-[0_14px_40px_rgba(27,39,31,0.12)]">
                  <div className="border-b border-[#efede6] px-3 py-2">
                    <p className="truncate text-sm font-semibold">{session.user.name}</p>
                    <p className="truncate text-xs text-[#81877f]">{session.user.email}</p>
                  </div>
                  <Link href="/profile" className="mt-1 block rounded-lg px-3 py-2 text-sm hover:bg-[#f5f4ee]">My Profile</Link>
                  <button type="button" onClick={logout} className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#9b503e] hover:bg-[#fbf2ee]">Sign out</button>
                </div>
              </details>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/login" className="px-3 py-2 text-sm font-semibold text-forest hover:text-terracotta">Log in</Link>
                <Link href="/register" className="button-primary !min-h-10 !px-4 !text-xs">Join the Nook</Link>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex size-10 items-center justify-center rounded-full border border-[#deded5] text-forest hover:bg-white lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="border-t border-[#e9e5db] bg-[#f7f5ef] px-6 py-3 lg:hidden" aria-label="Mobile navigation">
            {visibleNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-[#445249] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
              >
                {item.label}
              </Link>
            ))}
            {!isPending && !session && (
              <div className="flex gap-3 border-t border-[#e9e5db] pt-3">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="button-secondary flex-1">Log in</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="button-primary flex-1">Join the Nook</Link>
              </div>
            )}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-24 bg-[#0f172a] text-white">
        <div className="page-width grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
          <div>
            <Link href="/" className="inline-flex" aria-label="BookNook home">
              <BookNookLogo />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">
              A little corner for the books we love and the people we haven’t met yet.
            </p>
          </div>
          <div>
            <p className="eyebrow !text-[#bae6fd]">Find your next read</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-white/75">
              <Link href="/books" className="hover:text-white">Browse the shelves</Link>
              <Link href="/register" className="hover:text-white">Join the reading room</Link>
            </div>
          </div>
          <div>
            <p className="eyebrow !text-[#bae6fd]">The Nook</p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
              Good books travel further when we pass them along.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="page-width flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} BookNook. Made for readers.</span>
            <span>The Reading Atelier</span>
          </div>
        </div>
      </footer>
    </>
  );
}
