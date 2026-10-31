import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "@/components/register-form";

export const metadata: Metadata = { title: "Join the Nook" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="page-width min-h-[65vh] animate-pulse py-24" />}>
      <RegisterForm />
    </Suspense>
  );
}
