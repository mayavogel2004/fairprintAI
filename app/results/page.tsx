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
} from "lucide-react";
import clsx from "clsx";

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

const DOC_TYPE_LABELS: Record<string, string> = {
  medical_bill: "Medical Bill",
  insurance_denial: "Insurance Denial",
  lease: "Rental Lease",
  other: "Document",
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [docType, setDocType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [letterExpanded, setLetterExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

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

    // Dynamically import jsPDF for client-side PDF generation
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

  const highCount = result?.redFlags.filter((f) => f.severity === "high").length ?? 0;
  const medCount = result?.redFlags.filter((f) => f.severity === "medium").length ?? 0;
  const lowCount = result?.redFlags.filter((f) => f.severity === "low").length ?? 0;

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
        <h1 className="text-4xl font-extrabold text-white mb-3">
          Your Battle Plan
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
          {result.summary}
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
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

      {/* Red Flags */}
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

      {/* Battle Plan action items */}
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

      {/* Dispute Letter */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-400" />
            Your Dispute Letter
          </h2>
          <div className="flex gap-2">
            <button
              onClick={copyLetter}
              className="btn-secondary text-sm py-2 px-4"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy
                </>
              )}
            </button>
            <button
              onClick={downloadLetter}
              className="btn-primary text-sm py-2 px-4"
            >
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
              <>
                Show less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show full letter <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <p className="text-zinc-500 text-xs mt-3 leading-relaxed">
          This letter was generated by AI and is for informational purposes only. Review it carefully and consult a professional before sending. FairPrint is not a law firm and does not provide legal advice.
        </p>
      </section>

      {/* CTA footer */}
      <div className="card border-orange-500/20 bg-orange-500/5 text-center">
        <p className="text-zinc-300 mb-4">
          Have another document to review?
        </p>
        <Link href="/upload" className="btn-primary">
          Analyze Another Document
        </Link>
      </div>
    </div>
  );
}
