"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/utils/auth";

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   // Redirect to dashboard if already authenticated
  //   if (isAuthenticated()) {
  //     router.push("/dashboard");
  //   }
  // }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to ShortSummaryAI</h1>
        <p className="text-xl mb-8">
          Transform your lengthy text into concise summaries and bullet points
          with the power of AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Quick Summaries</h3>
            <p>
              Get the essence of any text in seconds, saving you time and
              effort.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Bullet Points</h3>
            <p>
              Transform paragraphs into easy-to-read bullet points for better
              clarity.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Save History</h3>
            <p>
              Access your past summaries and bullet points whenever you need
              them.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
