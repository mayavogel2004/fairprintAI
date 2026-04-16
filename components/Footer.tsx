import Link from "next/link";
import { Shield, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-white mb-3">
              <div className="bg-orange-600 rounded-lg p-1.5">
                <Shield className="w-4 h-4 text-white" />
              </div>
              Fair<span className="text-orange-400">Print</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Turning confusing documents into plain-English explanations and ready-to-send dispute letters since 2025.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Pages</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              {[
                { href: "/", label: "Home" },
                { href: "/upload", label: "Analyze a Document" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/about", label: "About FairPrint" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-white font-semibold mb-3">Disclaimer</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              FairPrint provides AI-generated analysis for informational purposes only. It is not legal or medical advice.
              Always consult a licensed professional for binding decisions.
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} FairPrint. Built with AI for the people.
          </p>
          <p className="text-zinc-600 text-xs">
            Powered by GPT-4 Vision · Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
