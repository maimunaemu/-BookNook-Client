import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="page-width min-h-[65vh] animate-pulse py-24" />}>
      <LoginForm />
    </Suspense>
  );
}
