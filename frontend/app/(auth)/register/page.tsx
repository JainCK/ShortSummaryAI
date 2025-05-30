import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import { Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up - ShortSummaryAI",
  description: "Create your ShortSummaryAI account",
};

export default function RegisterPage() {
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
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
