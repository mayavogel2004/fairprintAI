"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  Copy,
  ArrowLeft,
  Shield,
  Loader2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  BookmarkPlus,
  BookmarkCheck,
  BarChart2,
  TrendingUp,
  Phone,
} from "lucide-react";
import clsx from "clsx";
import HealthScoreGauge from "@/components/HealthScoreGauge";
import DocumentChat from "@/components/DocumentChat";
import LetterSequence from "@/components/LetterSequence";
import { FEATURED_COMPARISONS, NATIONAL_AVERAGES } from "@/lib/nationalAverages";

interface RedFlag {
  type: string;
  severity: "high" | "medium" | "low";
  description: string;
  amount?: string;
}

interface AnalysisResult {
  documentType: string;
  summary: string;
  redFlags: RedFlag[];
  battlePlan: string[];
  disputeLetter: string;
  totalPotentialSavings?: string;
}

interface SavedDispute {
  id: string;
  fileName: string;
  docType: string;
  date: string;
  status: "pending";
  redFlagCount: number;
  highCount: number;
  potentialSavings: string;
  summary: string;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  medical_bill: "Medical Bill",
  insurance_denial: "Insurance Denial",
  lease: "Rental Lease",
  other: "Document",
};

function computeHealthScore(flags: RedFlag[]): number {
  let score = 100;
  for (const flag of flags) {
    if (flag.severity === "high")   score -= 15;
    if (flag.severity === "medium") score -= 8;
    if (flag.severity === "low")    score -= 3;
  }
  return Math.max(0, score);
}

function saveDisputeToTracker(dispute: SavedDispute) {
  try {
    const existing: SavedDispute[] = JSON.parse(
      localStorage.getItem("fairprint_disputes") ?? "[]"
    );
    existing.unshift(dispute);
    localStorage.setItem("fairprint_disputes", JSON.stringify(existing));
  } catch {
    // silently fail
  }
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [docType, setDocType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [letterExpanded, setLetterExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("fairprint_result");
    const storedType = sessionStorage.getItem("fairprint_doc_type") ?? "";
    const storedName = sessionStorage.getItem("fairprint_file_name") ?? "";

    if (!stored) {
      router.push("/upload");
      return;
    }
    try {
      setResult(JSON.parse(stored));
      setDocType(storedType);
      setFileName(storedName);
    } catch {
      router.push("/upload");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const copyLetter = async () => {
    if (!result?.disputeLetter) return;
    await navigator.clipboard.writeText(result.disputeLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadLetter = () => {
    if (!result?.disputeLetter) return;
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const margin = 60;
      const lineHeight = 14;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const lines = doc.splitTextToSize(result.disputeLetter, maxWidth);
      let y = margin;

      lines.forEach((line: string) => {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      doc.save("FairPrint_Dispute_Letter.pdf");
    });
  };

  const handleSaveToTracker = () => {
    if (!result || saved) return;
    const dispute: SavedDispute = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      fileName: fileName || "Untitled Document",
      docType,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "pending",
      redFlagCount: result.redFlags.length,
      highCount: result.redFlags.filter((f) => f.severity === "high").length,
      potentialSavings: result.totalPotentialSavings ?? "—",
      summary: result.summary,
    };
    saveDisputeToTracker(dispute);
    setSaved(true);
  };

  const highCount = result?.redFlags.filter((f) => f.severity === "high").length ?? 0;
  const medCount  = result?.redFlags.filter((f) => f.severity === "medium").length ?? 0;
  const lowCount  = result?.redFlags.filter((f) => f.severity === "low").length ?? 0;
  const healthScore = result ? computeHealthScore(result.redFlags) : 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/upload"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Analyze another document
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="bg-orange-600 rounded-lg p-2">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-zinc-400 text-sm">
            {DOC_TYPE_LABELS[docType] ?? "Document"} · {fileName}
          </span>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-3">Your Battle Plan</h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">{result.summary}</p>
          </div>
          {/* Save to Tracker */}
          <button
            onClick={handleSaveToTracker}
            disabled={saved}
            className={clsx(
              "flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all shrink-0",
              saved
                ? "bg-green-500/10 border-green-500/30 text-green-400 cursor-default"
                : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-orange-500/50 hover:text-orange-400"
            )}
          >
            {saved ? (
              <><BookmarkCheck className="w-4 h-4" /> Saved to Tracker</>
            ) : (
              <><BookmarkPlus className="w-4 h-4" /> Save to Tracker</>
            )}
          </button>
        </div>
      </div>

      {/* ── Health Score + Stats ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
        {/* Health Score Gauge */}
        <div className="md:col-span-2 card flex items-center justify-center py-6">
          <div className="text-center">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">
              Bill Health Score
            </div>
            <HealthScoreGauge score={healthScore} />
          </div>
        </div>

        {/* Flag counts + savings */}
        <div className="md:col-span-3 grid grid-cols-2 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-extrabold text-orange-400">{highCount}</div>
            <div className="text-zinc-400 text-sm mt-1">High Priority</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-extrabold text-orange-400">{medCount}</div>
            <div className="text-zinc-400 text-sm mt-1">Medium Priority</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-extrabold text-yellow-400">{lowCount}</div>
            <div className="text-zinc-400 text-sm mt-1">Low Priority</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-extrabold text-amber-300">
              {result.totalPotentialSavings ?? "—"}
            </div>
            <div className="text-zinc-400 text-sm mt-1 flex items-center justify-center gap-1">
              <DollarSign className="w-3 h-3" /> Potential Savings
            </div>
          </div>
        </div>
      </div>

      {/* ── Red Flags ────────────────────────────────────────────────────── */}
      {result.redFlags.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Red Flags Detected ({result.redFlags.length})
          </h2>
          <div className="space-y-3">
            {result.redFlags.map((flag, i) => (
              <div
                key={i}
                className={clsx(
                  "rounded-xl border p-4 flex gap-4 animate-slide-up",
                  flag.severity === "high"
                    ? "bg-orange-500/5 border-orange-500/25"
                    : flag.severity === "medium"
                    ? "bg-orange-500/5 border-orange-500/25"
                    : "bg-yellow-500/5 border-yellow-500/25"
                )}
              >
                <div className="shrink-0 pt-0.5">
                  <span
                    className={
                      flag.severity === "high"
                        ? "badge-high"
                        : flag.severity === "medium"
                        ? "badge-medium"
                        : "badge-low"
                    }
                  >
                    {flag.severity}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm mb-1">{flag.type}</div>
                  <div className="text-zinc-300 text-sm leading-relaxed">{flag.description}</div>
                  {flag.amount && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-zinc-800 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <DollarSign className="w-3 h-3" />
                      Potential recovery: {flag.amount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── National Average Comparison ──────────────────────────────────── */}
      {docType === "medical_bill" && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-400" />
            Charge vs. National Average
          </h2>
          <p className="text-zinc-500 text-sm mb-5">
            How common procedures are typically priced across the U.S. Compare against your bill.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FEATURED_COMPARISONS.map(({ label, cpt }) => {
              const data = NATIONAL_AVERAGES[cpt];
              if (!data) return null;
              return (
                <div
                  key={cpt}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{label}</div>
                    <div className="text-zinc-600 text-xs mt-0.5">CPT {cpt}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-amber-300 font-bold text-sm">
                      ${data.nationalAvg.toLocaleString()}
                    </div>
                    <div className="text-zinc-600 text-xs">
                      ${data.low.toLocaleString()} – ${data.high.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-zinc-600 text-xs mt-3 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Data sourced from Healthcare Bluebook &amp; FAIR Health national benchmarks. Prices vary by region and provider.
          </p>
        </section>
      )}

      {/* ── Battle Plan ──────────────────────────────────────────────────── */}
      {result.battlePlan.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            Your Action Items
          </h2>
          <div className="card border-zinc-700 space-y-0 divide-y divide-zinc-800">
            {result.battlePlan.map((step, i) => (
              <div key={i} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="shrink-0 w-7 h-7 rounded-full bg-orange-600/20 border border-orange-500/30 text-orange-400 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Dispute Letter ───────────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-400" />
            Your Dispute Letter
          </h2>
          <div className="flex gap-2">
            <button onClick={copyLetter} className="btn-secondary text-sm py-2 px-4">
              {copied ? (
                <><CheckCircle2 className="w-4 h-4 text-amber-300" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy</>
              )}
            </button>
            <button onClick={downloadLetter} className="btn-primary text-sm py-2 px-4">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        <div className="card border-zinc-700 bg-zinc-900/50">
          <div
            className={clsx(
              "overflow-hidden transition-all duration-500",
              letterExpanded ? "max-h-none" : "max-h-64"
            )}
          >
            <pre className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {result.disputeLetter}
            </pre>
          </div>

          <button
            onClick={() => setLetterExpanded(!letterExpanded)}
            className="mt-4 w-full flex items-center justify-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors py-2 border-t border-zinc-800"
          >
            {letterExpanded ? (
              <>Show less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Show full letter <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        </div>

        <p className="text-zinc-500 text-xs mt-3 leading-relaxed">
          This letter was generated by AI and is for informational purposes only. Review it carefully and consult a
          professional before sending. FairPrint is not a law firm and does not provide legal advice.
        </p>
      </section>

      {/* ── Escalating Letter Sequence ───────────────────────────────────── */}
      <LetterSequence
        analysisContext={JSON.stringify(result)}
        documentType={docType}
      />

      {/* ── Negotiation Coach CTA ─────────────────────────────────────────── */}
      <div className="card border-amber-500/20 bg-amber-500/5 flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold mb-1">
            <Phone className="w-4 h-4" />
            Negotiation Coach
          </div>
          <p className="text-zinc-300 text-sm">
            Practice the phone call before you make it. GPT plays the billing rep — you practice your arguments and get real-time coaching.
          </p>
        </div>
        <Link href="/negotiate" className="btn-primary text-sm py-2 px-5 shrink-0">
          <Phone className="w-4 h-4" />
          Practice Call
        </Link>
      </div>

      {/* ── AI Chat ──────────────────────────────────────────────────────── */}
      <DocumentChat
        analysisContext={JSON.stringify(result)}
        documentType={docType}
      />

      {/* ── CTA footer ───────────────────────────────────────────────────── */}
      <div className="card border-orange-500/20 bg-orange-500/5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-zinc-300">Have another document to review?</p>
        <div className="flex gap-3">
          <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">
            View Dashboard
          </Link>
          <Link href="/upload" className="btn-primary text-sm py-2 px-4">
            Analyze Another
          </Link>
        </div>
      </div>
    </div>
  );
}
