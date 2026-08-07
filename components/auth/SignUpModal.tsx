"use client";

import { LoginModal } from "@/components/auth/login-modal";

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignUpModal({ open, onClose }: SignUpModalProps) {
  return <LoginModal open={open} mode="signup" onClose={onClose} />;
}

export default SignUpModal;
