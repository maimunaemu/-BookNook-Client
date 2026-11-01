import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/login-form";
import LoadingState from "@/components/loading-state";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState label="Preparing the sign-in form…" className="min-h-[65vh]" />}>
      <LoginForm />
    </Suspense>
  );
}
