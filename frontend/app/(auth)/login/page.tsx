import type { Metadata } from "next";
import LoginForm from "@/components/auth/loginForm";
import { Zap } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In - ShortSummaryAI",
  description: "Sign in to your ShortSummaryAI account",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] md:w-[450px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="rounded-md bg-primary p-1">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ShortSummaryAI</span>
          </Link>
          <Suspense
            fallback={<div className="h-4 w-4 animate-spin text-primary" />}
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
