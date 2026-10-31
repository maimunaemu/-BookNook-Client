"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, LogOut, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  if (!session) return null;

  async function logout() {
    const result = await authClient.signOut();
    if (result.error) {
      toast.error(result.error.message ?? "We couldn't sign you out. Please try again.");
      return;
    }
    toast.success("You’re signed out.");
    router.replace("/");
  }

  return (
    <section className="page-width max-w-3xl py-12 sm:py-16">
      <p className="eyebrow">Your place in the reading room</p>
      <h1 className="serif mt-3 text-5xl">My profile.</h1>
      <div className="mt-8 rounded-2xl border border-[#e8e5dc] bg-[#fffefa] p-6 sm:p-8">
        <div className="flex items-center gap-4 border-b border-[#ece9e1] pb-6">
          {session.user.image ? (
            // The profile image is an arbitrary URL supplied by the account owner.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="" className="size-16 rounded-full object-cover" />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-full bg-[#e4ece1] text-2xl font-semibold text-[#315640]">{session.user.name.slice(0, 1).toUpperCase()}</span>
          )}
          <div><h2 className="serif text-2xl">{session.user.name}</h2><p className="mt-1 text-sm text-[#7a8178]">Reader at BookNook</p></div>
        </div>
        <div className="grid gap-4 py-6 sm:grid-cols-2">
          <div className="flex gap-3 rounded-xl bg-[#f4f3ed] p-4"><UserRound size={17} className="mt-0.5 text-[#68806b]" /><div><p className="text-xs text-[#838a80]">Name</p><p className="mt-1 text-sm font-medium">{session.user.name}</p></div></div>
          <div className="flex gap-3 rounded-xl bg-[#f4f3ed] p-4"><Mail size={17} className="mt-0.5 text-[#68806b]" /><div><p className="text-xs text-[#838a80]">Email</p><p className="mt-1 break-all text-sm font-medium">{session.user.email}</p></div></div>
        </div>
        <div className="flex flex-wrap gap-3 border-t border-[#ece9e1] pt-5">
          <Link href="/my-books" className="button-secondary">My books <ArrowRight size={15} /></Link>
          <Link href="/my-borrows" className="button-secondary">My borrows <BookOpen size={15} /></Link>
          <button type="button" onClick={logout} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#eadbd4] px-5 text-sm font-semibold text-[#a25340] hover:bg-[#fbf2ee]"><LogOut size={15} /> Log out</button>
        </div>
      </div>
    </section>
  );
}
