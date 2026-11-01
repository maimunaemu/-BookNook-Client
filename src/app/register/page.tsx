import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "@/components/register-form";
import LoadingState from "@/components/loading-state";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingState label="Preparing the registration form…" className="min-h-[65vh]" />}>
      <RegisterForm />
    </Suspense>
  );
}
