"use client";

import { useState, useRef } from "react";
import {
  BookOpen,
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Info,
  Zap,
} from "lucide-react";
import clsx from "clsx";

interface DecodeResult {
  term: string;
  plainEnglish: string;
  category: string;
  typicalCost: string | null;
  watchOut: string | null;
  isCommon: boolean;
}

const QUICK_EXAMPLES = [
  "99213", "EOB", "Prior Authorization", "74177",
  "Coordination of Benefits", "80053", "UB-04", "Capitation",
  "ERISA", "DRG", "CPT Code", "Coinsurance",
];

const CATEGORY_COLORS: Record<string, string> = {
  "CPT Code":       "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "ICD Code":       "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "Insurance Term": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Billing Term":   "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Legal/Lease Term": "bg-green-500/15 text-green-400 border-green-500/30",
  "Drug":           "bg-pink-500/15 text-pink-400 border-pink-500/30",
  "Other":          "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<DecodeResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function decode(term?: string) {
    const q = (term ?? query).trim();
    if (!q || loading) return;

    setQuery(q);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Try again.");
      } else {
        setResult(data);
        setHistory((prev) => {
          // Avoid duplicates
          const filtered = prev.filter(
            (h) => h.term.toLowerCase() !== data.term.toLowerCase()
          );
          return [data, ...filtered].slice(0, 8);
        });
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") decode();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-orange-600 rounded-lg p-2">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-zinc-400 text-sm">AI-Powered Decoder</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">Glossary Decoder</h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Paste any CPT code, insurance term, billing jargon, or lease clause and get a
          plain-English explanation in seconds.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 focus-within:border-orange-500 transition-colors">
          <Search className="w-5 h-5 text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. 99213, Prior Authorization, EOB, DRG…"
            className="flex-1 bg-transparent text-white placeholder:text-zinc-600 text-sm outline-none"
          />
          <button
            onClick={() => decode()}
            disabled={!query.trim() || loading}
            className={clsx(
              "shrink-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-xl transition-all",
              query.trim() && !loading
                ? "bg-orange-500 hover:bg-orange-400 text-black"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Decode
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick example chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-xs text-zinc-600 self-center mr-1">Try:</span>
        {QUICK_EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => decode(ex)}
            disabled={loading}
            className="text-xs px-3 py-1 rounded-full border border-zinc-700 text-zinc-400 hover:border-orange-500/50 hover:text-orange-400 transition-colors disabled:opacity-40"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <p className="text-orange-300 text-sm">{error}</p>
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className="card border-zinc-700 mb-8 animate-slide-up">
          {/* Term header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white">{result.term}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={clsx(
                    "text-xs font-semibold px-2.5 py-0.5 rounded-full border",
                    CATEGORY_COLORS[result.category] ?? CATEGORY_COLORS["Other"]
                  )}
                >
                  {result.category}
                </span>
                {result.isCommon && (
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                    Commonly seen
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Plain English */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-bold uppercase tracking-wide mb-2">
              <Info className="w-3.5 h-3.5" />
              What it means
            </div>
            <p className="text-zinc-200 text-base leading-relaxed">{result.plainEnglish}</p>
          </div>

          {/* Typical cost */}
          {result.typicalCost && (
            <div className="flex items-start gap-3 bg-zinc-800/50 rounded-xl px-4 py-3 mb-3">
              <DollarSign className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-zinc-500 font-bold uppercase tracking-wide mb-0.5">
                  Typical Cost
                </div>
                <div className="text-amber-300 font-semibold text-sm">{result.typicalCost}</div>
              </div>
            </div>
          )}

          {/* Watch out */}
          {result.watchOut && (
            <div className="flex items-start gap-3 bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-orange-400 font-bold uppercase tracking-wide mb-0.5">
                  Watch Out
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{result.watchOut}</p>
              </div>
            </div>
          )}

          {!result.watchOut && (
            <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
              <CheckCircle2 className="w-4 h-4" />
              No specific red flags for this term
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <section>
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wide mb-3">
            Recent lookups
          </h2>
          <div className="flex flex-wrap gap-2">
            {history.slice(1).map((h) => (
              <button
                key={h.term}
                onClick={() => {
                  setQuery(h.term);
                  setResult(h);
                  setError(null);
                }}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-lg hover:border-zinc-600 hover:text-white transition-colors"
              >
                <span
                  className={clsx(
                    "w-1.5 h-1.5 rounded-full",
                    h.watchOut ? "bg-orange-400" : "bg-green-400"
                  )}
                />
                {h.term}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="text-center py-12 text-zinc-700">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Enter a term above or click one of the examples to get started</p>
        </div>
      )}
    </div>
  );
}
