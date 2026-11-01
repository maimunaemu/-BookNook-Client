"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, Eye, EyeOff, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

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

export default function RegisterForm() {
  const params = useSearchParams();
  const router = useRouter();
  const destination = safeDestination(params.get("callbackURL"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      toast.error("Use at least 6 characters, with one uppercase and one lowercase letter.");
      return;
    }
    const photoUrl = image.trim();
    if (photoUrl) {
      try {
        new URL(photoUrl);
      } catch {
        toast.error("Enter a valid photo URL.");
        return;
      }
    }

    setBusy(true);
    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        ...(photoUrl ? { image: photoUrl } : {}),
        callbackURL: destination,
      });
      if (result.error) {
        toast.error(result.error.message ?? "We couldn't create your account. Please check your details.");
        return;
      }
      toast.success("Your place in the Nook is ready. Please log in.");
      router.push(`/login?callbackURL=${encodeURIComponent(destination)}`);
    } catch {
      toast.error("We couldn't reach the sign-up service. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page-width grid min-h-[68vh] items-center gap-12 py-12 lg:grid-cols-[0.85fr_1fr] lg:py-16">
      <div className="mx-auto w-full max-w-[440px]">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#748075] hover:text-[#244b3a]">
          <ArrowLeft size={14} /> Back to the Nook
        </Link>
        <span className="mt-8 flex size-12 items-center justify-center rounded-full bg-[#e7eee4] text-[#244b3a]">
          <BookOpen size={22} />
        </span>
        <p className="eyebrow mt-5">A place for your next chapter</p>
        <h1 className="serif mt-2 text-4xl">Make yourself at home.</h1>
        <p className="mt-3 text-sm text-[#778078]">Create an account to share and borrow books.</p>
        <form onSubmit={submit} className="mt-7 space-y-3.5">
          <label className="block text-sm font-medium">
            Your name
            <span className="relative mt-1.5 block">
              <UserRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92998f]" />
              <input className="field pl-10" autoComplete="name" maxLength={80} required value={name} onChange={(event) => setName(event.target.value)} />
            </span>
          </label>
          <label className="block text-sm font-medium">
            Email address
            <input className="field mt-1.5" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            Photo URL
            <input className="field mt-1.5" type="url" placeholder="https://…" value={image} onChange={(event) => setImage(event.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            Password
            <span className="relative mt-1.5 block">
              <input className="field pr-11" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} />
              <button type="button" onClick={() => setShowPassword((show) => !show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858d83]" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
            <span className="mt-1 block text-xs font-normal text-[#8b9189]">At least 6 characters, including uppercase and lowercase letters.</span>
          </label>
          <button type="submit" disabled={busy} className="button-primary mt-2 w-full">
            {busy ? "Saving your place…" : "Create account"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-[#737b72]">
          Already have a spot? <Link href="/login" className="font-semibold text-[#244b3a] hover:text-[#bd7158]">Log in</Link>
        </p>
      </div>
      <div className="relative hidden min-h-[575px] overflow-hidden rounded-[1.6rem] bg-[#203b2e] lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#172b21]/95 via-[#172b21]/30 to-transparent" />
        <div className="absolute bottom-0 p-12 text-white">
          <p className="eyebrow !text-[#e7b59e]">Good stories make their rounds</p>
          <p className="serif mt-4 max-w-md text-4xl leading-tight">A book you love might be the book someone else needs.</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">Bring your shelf into a community of curious readers.</p>
        </div>
      </div>
    </section>
  );
}
