"use client";

import { LoginForm } from "@/components/auth/login-form";
import { LoginRedirect } from "@/components/auth/login-redirect";

export default function LoginPage() {
  return (
    <>
      <LoginRedirect />
      <LoginForm />
    </>
  );
}
