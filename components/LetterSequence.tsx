"use client";

import { useState } from "react";
import {
  Mail,
  Loader2,
  Copy,
  Download,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Zap,
} from "lucide-react";
import clsx from "clsx";

interface Letter {
  subject: string;
  tone: string;
  body: string;
}

interface LetterSequenceData {
  initial: Letter;
  followUp: Letter;
  finalNotice: Letter;
}

interface Props {
  analysisContext: string;
  documentType: string;
}

const TABS = [
  { id: "initial",     label: "1. Initial Dispute",   tone: "Professional",  icon: <Mail className="w-3.5 h-3.5" />,          days: "Send now",        color: "text-zinc-300" },
  { id: "followUp",    label: "2. 30-Day Follow-Up",  tone: "Assertive",     icon: <AlertTriangle className="w-3.5 h-3.5" />,  days: "Send after 30 days", color: "text-amber-400" },
  { id: "finalNotice", label: "3. Final Notice",      tone: "Legal Tone",    icon: <Zap className="w-3.5 h-3.5" />,            days: "Send after 44 days", color: "text-red-400" },
] as const;

type TabId = "initial" | "followUp" | "finalNotice";

export default function LetterSequence({ analysisContext, documentType }: Props) {
  const [letters, setLetters] = useState<LetterSequenceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("initial");
  const [copiedTab, setCopiedTab] = useState<TabId | null>(null);

  async function generateSequence() {
    if (loading || letters) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisContext, documentType }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Failed to generate letters.");
      } else {
        setLetters(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLetter(tabId: TabId) {
    if (!letters) return;
    const letter = letters[tabId];
    await navigator.clipboard.writeText(`Subject: ${letter.subject}\n\n${letter.body}`);
    setCopiedTab(tabId);
    setTimeout(() => setCopiedTab(null), 2500);
  }

  function downloadLetter(tabId: TabId) {
    if (!letters) return;
    const letter = letters[tabId];
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const margin = 60;
      const lineHeight = 14;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const fullText = `Subject: ${letter.subject}\n\n${letter.body}`;
      const lines = doc.splitTextToSize(fullText, maxWidth);
      let y = margin;

      lines.forEach((line: string) => {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      const tabLabel = tabId === "initial" ? "Initial" : tabId === "followUp" ? "FollowUp" : "FinalNotice";
      doc.save(`FairPrint_${tabLabel}_Letter.pdf`);
    });
  }

  const activeLetter = letters ? letters[activeTab] : null;
  const activeTabInfo = TABS.find((t) => t.id === activeTab)!;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <Mail className="w-5 h-5 text-orange-400" />
        Escalating Letter Sequence
      </h2>
      <p className="text-zinc-500 text-sm mb-5">
        Generate a 3-letter sequence that escalates from polite dispute to legal threat. Send each one if the previous gets no response.
      </p>

      {/* Timeline visual */}
      <div className="flex items-center gap-0 mb-6">
        {TABS.map((tab, i) => (
          <div key={tab.id} className="flex items-center">
            <div className={clsx(
              "flex flex-col items-center gap-1.5 px-3",
              letters ? "cursor-pointer" : "cursor-default"
            )} onClick={() => letters && setActiveTab(tab.id)}>
              <div className={clsx(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                letters && activeTab === tab.id
                  ? "border-orange-500 bg-orange-500/20 text-orange-400"
                  : letters
                  ? "border-zinc-600 bg-zinc-800 text-zinc-400 hover:border-zinc-500"
                  : "border-zinc-700 bg-zinc-900 text-zinc-600"
              )}>
                {tab.icon}
              </div>
              <span className={clsx("text-xs font-medium text-center hidden sm:block", tab.color)}>
                {tab.days}
              </span>
            </div>
            {i < TABS.length - 1 && (
              <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {!letters && !loading && (
        <div className="card border-dashed border-zinc-700 text-center py-10">
          <Mail className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm mb-4 max-w-sm mx-auto">
            Generate a complete 3-letter escalating dispute sequence, personalized to the specific violations in your document.
          </p>
          <button onClick={generateSequence} className="btn-primary">
            <Zap className="w-4 h-4" />
            Generate Full Letter Sequence
          </button>
        </div>
      )}

      {loading && (
        <div className="card border-orange-500/20 bg-orange-500/5 text-center py-10">
          <Loader2 className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-3" />
          <p className="text-zinc-300 text-sm font-medium">Generating your 3-letter sequence...</p>
          <p className="text-zinc-500 text-xs mt-1">Drafting initial, follow-up, and final notice letters</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 mb-4">
          <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
          <p className="text-orange-300 text-sm">{error}</p>
          <button onClick={generateSequence} className="ml-auto text-xs text-orange-400 hover:text-orange-300 font-semibold">
            Retry
          </button>
        </div>
      )}

      {letters && (
        <div className="card border-zinc-700 bg-zinc-900/50 p-0 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-zinc-800 flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-3 text-xs font-semibold transition-all border-b-2",
                  activeTab === tab.id
                    ? "border-orange-500 text-white bg-orange-500/5"
                    : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/3"
                )}
              >
                <span className={tab.color}>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.id === "initial" ? "1" : tab.id === "followUp" ? "2" : "3"}</span>
              </button>
            ))}
          </div>

          {/* Letter content */}
          {activeLetter && (
            <div className="p-5">
              {/* Letter metadata */}
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Subject Line</div>
                  <div className="text-white font-medium text-sm">{activeLetter.subject}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={clsx(
                    "text-xs px-2.5 py-1 rounded-full border font-semibold",
                    activeTabInfo.id === "initial" ? "text-zinc-300 border-zinc-600 bg-zinc-800"
                    : activeTabInfo.id === "followUp" ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                    : "text-red-400 border-red-500/30 bg-red-500/10"
                  )}>
                    {activeLetter.tone}
                  </span>
                </div>
              </div>

              {/* Letter body */}
              <div className="bg-zinc-950 rounded-xl p-4 mb-4 max-h-72 overflow-y-auto">
                <pre className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {activeLetter.body}
                </pre>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => copyLetter(activeTab)}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  {copiedTab === activeTab ? (
                    <><CheckCircle2 className="w-4 h-4 text-amber-300" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy</>
                  )}
                </button>
                <button
                  onClick={() => downloadLetter(activeTab)}
                  className="btn-primary text-sm py-2 px-4"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-zinc-600 text-xs mt-3">
        Letters are AI-generated templates. Review before sending. FairPrint does not provide legal advice.
      </p>
    </section>
  );
}
