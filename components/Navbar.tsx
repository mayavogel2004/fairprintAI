"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import clsx from "clsx";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const links = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Analyze Document" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/insights", label: "Insights" },
  { href: "/rights", label: "Know Your Rights" },
  { href: "/glossary", label: "Glossary" },
  { href: "/negotiate", label: "Negotiate" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl text-white hover:text-orange-400 transition-colors shrink-0"
          >
            <div className="bg-orange-600 rounded-lg p-1.5">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Fair<span className="text-orange-400">Print</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "text-orange-400 bg-orange-500/10"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in" className="text-zinc-300 hover:text-white text-sm font-medium transition-colors">
                Sign in
              </Link>
              <Link href="/upload" className="btn-primary text-sm py-2 px-4">
                Get Started Free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/upload" className="btn-primary text-sm py-2 px-4">
                Analyze Document
              </Link>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            </SignedIn>
          </div>

          {/* Mobile signed-in avatar */}
          <div className="lg:hidden">
            <SignedIn>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            </SignedIn>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-zinc-400 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-3 space-y-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={clsx(
                "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "text-orange-400 bg-orange-500/10"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-800"
              )}
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-zinc-800 space-y-2">
            <SignedOut>
              <Link href="/sign-in" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800">
                Sign in
              </Link>
              <Link href="/upload" onClick={() => setOpen(false)} className="block btn-primary text-sm justify-center">
                Get Started Free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/upload" onClick={() => setOpen(false)} className="block btn-primary text-sm justify-center">
                Analyze Document
              </Link>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}
