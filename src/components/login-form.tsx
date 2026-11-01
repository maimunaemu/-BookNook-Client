"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, Eye, EyeOff, LoaderCircle, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import GoogleAuthButton from "@/components/google-auth-button";

function safeDestination(value: string | null): string {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/";
  try {
    const target = new URL(value, window.location.origin);
    if (target.origin !== window.location.origin) return "/";
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/";
  }
}

export default function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const destination = safeDestination(params.get("callbackURL"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: destination,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Those details didn't match an account. Please try again.");
        return;
      }
      toast.success("Welcome back to the Nook.");
      router.replace(destination);
    } catch {
      toast.error("We couldn't reach the sign-in service. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page-width grid min-h-[68vh] items-center gap-12 py-12 lg:grid-cols-[1fr_0.85fr] lg:py-16">
      <div className="hidden overflow-hidden rounded-[1.6rem] bg-[#203b2e] lg:block">
        <div
          className="flex min-h-[570px] flex-col justify-end bg-cover bg-center p-12 text-white"
          style={{
            backgroundImage:
              "linear-gradient(0deg,rgba(23,43,32,.92),rgba(23,43,32,.08)),url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80)",
          }}
        >
          <p className="eyebrow !text-[#e7b59e]">The next chapter starts here</p>
          <h1 className="serif mt-4 max-w-md text-5xl leading-[1.05]">Good to have you back.</h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">Your next read—and the readers who love it—are just around the corner.</p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[430px]">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#748075] hover:text-[#244b3a]">
          <ArrowLeft size={14} /> Back to the Nook
        </Link>
        <span className="mt-9 flex size-12 items-center justify-center rounded-full bg-[#e7eee4] text-[#244b3a]">
          <BookOpen size={22} />
        </span>
        <p className="eyebrow mt-6">Welcome back</p>
        <h2 className="serif mt-2 text-4xl">Come on in.</h2>
        <p className="mt-3 text-sm text-[#778078]">Log in to find your next borrowed read.</p>

        <GoogleAuthButton callbackURL={destination} />
        <div className="my-6 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.12em] text-[#9a9e97]">
          <span className="h-px flex-1 bg-[#e5e2d9]" /> or use your email <span className="h-px flex-1 bg-[#e5e2d9]" />
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium">
            Email address
            <span className="relative mt-1.5 block">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92998f]" />
              <input className="field pl-10" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </span>
          </label>
          <label className="block text-sm font-medium">
            Password
            <span className="relative mt-1.5 block">
              <input className="field pr-11" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
              <button type="button" onClick={() => setShowPassword((show) => !show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858d83]" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>
          <button type="submit" disabled={busy} className="button-primary mt-2 w-full">
            {busy && <LoaderCircle size={16} className="animate-spin" />}
            {busy ? "Opening your nook…" : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#737b72]">
          New around here? <Link href="/register" className="font-semibold text-[#244b3a] hover:text-[#bd7158]">Make yourself at home</Link>
        </p>
      </div>
    </section>
  );
}
