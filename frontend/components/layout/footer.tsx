"use client";

import Link from "next/link";
import { Zap, Github, Twitter, Linkedin } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Don't show footer on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <footer className="w-full border-t border-border/40 bg-background p-20">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ShortSummaryAI</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            Transform your lengthy text into concise summaries with the power of
            AI.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-3">Product</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                API
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Integrations
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Guides
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Support
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-border/40 pt-6 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ShortSummaryAI. All rights reserved.
        </p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
