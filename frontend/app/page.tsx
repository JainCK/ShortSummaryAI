"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Zap, FileText, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   // Redirect to dashboard if already authenticated
  //   if (isAuthenticated()) {
  //     router.push("/dashboard");
  //   }
  // }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <div className="container px-4 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
            AI-Powered Text Summarization
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to <span className="text-primary">ShortSummaryAI</span>
          </h1>
          <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl">
            Transform your lengthy text into concise summaries and bullet points
            with the power of AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" asChild>
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Quick Summaries</h3>
            <p className="text-muted-foreground">
              Get the essence of any text in seconds, saving you time and
              effort.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Bullet Points</h3>
            <p className="text-muted-foreground">
              Transform paragraphs into easy-to-read bullet points for better
              clarity.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <History className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Save History</h3>
            <p className="text-muted-foreground">
              Access your past summaries and bullet points whenever you need
              them.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials/Social Proof */}
      {/* <div className="w-full bg-secondary/20 py-16 md:py-24">
        <div className="container px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Trusted by Professionals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-background/50 backdrop-blur-sm p-6 rounded-lg border border-border"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                  <div>
                    <p className="font-medium">User Name</p>
                    <p className="text-sm text-muted-foreground">
                      Position, Company
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "ShortSummaryAI has transformed how I process information. I
                  can now quickly understand lengthy documents without spending
                  hours reading them."
                </p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="container px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to save time and boost productivity?
          </h2>
          <p className="max-w-[600px] text-muted-foreground text-lg">
            Join thousands of professionals who use ShortSummaryAI to streamline
            their reading and research.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">
              Start Summarizing Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
