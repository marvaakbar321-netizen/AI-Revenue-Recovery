"use client";

import { LoginRedirect } from "@/components/auth/login-redirect";
import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <>
      <LoginRedirect />
      <SignUpForm />
    </>
  );
}
