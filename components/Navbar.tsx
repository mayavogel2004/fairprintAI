"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Analyze Document" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl text-white hover:text-green-400 transition-colors"
          >
            <div className="bg-green-700 rounded-lg p-1.5">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Fair<span className="text-green-400">Print</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "text-green-400 bg-green-600/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/upload"
            className="hidden md:inline-flex btn-primary text-sm py-2 px-4"
          >
            Get Your Battle Plan
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={clsx(
                "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "text-green-400 bg-green-600/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/upload"
            onClick={() => setOpen(false)}
            className="block btn-primary text-sm justify-center mt-2"
          >
            Get Your Battle Plan
          </Link>
        </div>
      )}
    </nav>
  );
}
