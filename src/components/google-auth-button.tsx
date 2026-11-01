"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function GoogleAuthButton({ callbackURL }: { callbackURL: string }) {
  const [busy, setBusy] = useState(false);

  async function signInWithGoogle() {
    setBusy(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Google sign-in failed. Check the OAuth setup and try again.");
        setBusy(false);
      }
    } catch {
      toast.error("Google sign-in couldn't start. Configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the client server environment.");
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={() => void signInWithGoogle()} disabled={busy} className="button-secondary mt-7 w-full">
      {busy ? <LoaderCircle size={16} className="animate-spin" /> : <span className="serif text-base font-bold">G</span>}
      {busy ? "Connecting to Google…" : "Continue with Google"}
    </button>
  );
}
