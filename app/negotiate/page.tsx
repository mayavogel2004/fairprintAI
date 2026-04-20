"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  Bot,
  User,
  Send,
  Loader2,
  Lightbulb,
  ArrowLeft,
  Shield,
  Target,
  ChevronRight,
  Zap,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import clsx from "clsx";

interface Message {
  role: "user" | "assistant";
  content: string;
  coaching?: string;
  phase?: string;
  concessionMade?: boolean;
  concessionDetail?: string | null;
  powerMoveAvailable?: string;
}

type Scenario = "billing_department" | "supervisor" | "insurance_appeals";

const SCENARIOS: { id: Scenario; label: string; description: string; difficulty: string; color: string }[] = [
  {
    id: "billing_department",
    label: "Hospital Billing Dept.",
    description: "Standard billing rep. Medium resistance.",
    difficulty: "Medium",
    color: "border-orange-500/40 bg-orange-500/5 text-orange-400",
  },
  {
    id: "supervisor",
    label: "Billing Supervisor",
    description: "More authority, tougher to crack.",
    difficulty: "Hard",
    color: "border-red-500/40 bg-red-500/5 text-red-400",
  },
  {
    id: "insurance_appeals",
    label: "Insurance Appeals",
    description: "Insurance appeals specialist. Procedural.",
    difficulty: "Hard",
    color: "border-amber-500/40 bg-amber-500/5 text-amber-400",
  },
];

const POWER_PHRASES = [
  "I have an itemized bill that shows a duplicate charge.",
  "I'd like to invoke my rights under the No Surprises Act.",
  "Can you connect me with your patient financial advocate?",
  "I'd like to request a formal review in writing.",
  "I'm prepared to file a complaint with the state insurance commissioner.",
  "This charge exceeds the national average by over 200%.",
  "I have documentation of this error and would like it corrected.",
  "I'd like to speak with a supervisor about this discrepancy.",
];

const PHASE_LABELS: Record<string, { label: string; color: string; step: number }> = {
  opening:  { label: "Opening",         color: "text-zinc-400",  step: 1 },
  building: { label: "Building Case",   color: "text-amber-400", step: 2 },
  pressing: { label: "Pressing Hard",   color: "text-orange-400",step: 3 },
  closing:  { label: "Closing Deal",    color: "text-green-400", step: 4 },
};

export default function NegotiatePage() {
  const [scenario, setScenario] = useState<Scenario>("billing_department");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState("opening");
  const [concessions, setConcessions] = useState<string[]>([]);
  const [analysisContext, setAnalysisContext] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Try to load analysis context from sessionStorage
    const stored = sessionStorage.getItem("fairprint_result");
    if (stored) setAnalysisContext(stored);
    else setAnalysisContext(JSON.stringify({
      summary: "Patient disputing a hospital bill with potential duplicate charges and above-average pricing.",
      redFlags: [
        { type: "Duplicate Charge", severity: "high", description: "Room & Board charged twice", amount: "$1,840" },
        { type: "Above Average Pricing", severity: "medium", description: "CT scan priced at $4,800 vs national average of $1,500" },
      ],
      totalPotentialSavings: "$4,980",
    }));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function startSession() {
    const openingMessage: Message = {
      role: "assistant",
      content: `Thank you for calling. This is Alex in the billing department. How can I help you today?`,
      coaching: "Start by clearly stating you're calling to dispute specific charges. Be specific — name the charge and date.",
      phase: "opening",
      powerMoveAvailable: "State the specific charge amount and date right away to signal you have documentation.",
    };
    setMessages([openingMessage]);
    setStarted(true);
    setCurrentPhase("opening");
    setConcessions([]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function sendMessage(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    setInput("");
    setError(null);

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Build API-safe message history (only role + content)
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          analysisContext,
          documentType: "medical_bill",
          scenario,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong.");
        setMessages(newMessages);
      } else {
        const assistantMsg: Message = {
          role: "assistant",
          content: data.billingRep,
          coaching: data.coaching,
          phase: data.phase,
          concessionMade: data.concessionMade,
          concessionDetail: data.concessionDetail,
          powerMoveAvailable: data.powerMoveAvailable,
        };
        setMessages([...newMessages, assistantMsg]);
        if (data.phase) setCurrentPhase(data.phase);
        if (data.concessionMade && data.concessionDetail) {
          setConcessions((prev) => [...prev, data.concessionDetail!]);
        }
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function resetSession() {
    setStarted(false);
    setMessages([]);
    setInput("");
    setError(null);
    setCurrentPhase("opening");
    setConcessions([]);
  }

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant");
  const phaseInfo = PHASE_LABELS[currentPhase] ?? PHASE_LABELS["opening"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/results"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to results
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-orange-600 rounded-lg p-2">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <span className="text-zinc-400 text-sm">AI Negotiation Coach</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2">Practice Your Phone Call</h1>
        <p className="text-zinc-400 text-lg">
          Roleplay the negotiation before you make the real call. GPT plays the billing rep — you practice your arguments.
        </p>
      </div>

      {!started ? (
        /* ── Setup screen ── */
        <div className="max-w-2xl">
          <h2 className="text-white font-semibold text-lg mb-4">Choose your scenario</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                className={clsx(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  scenario === s.id
                    ? s.color
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                )}
              >
                <div className={clsx("text-xs font-bold mb-1 uppercase tracking-wide", scenario === s.id ? "" : "text-zinc-500")}>
                  {s.difficulty}
                </div>
                <div className={clsx("font-semibold text-sm mb-1", scenario === s.id ? "text-white" : "text-zinc-300")}>
                  {s.label}
                </div>
                <div className="text-zinc-500 text-xs">{s.description}</div>
              </button>
            ))}
          </div>

          <div className="card border-zinc-700 mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              How this works
            </h3>
            <ol className="space-y-2 text-zinc-400 text-sm">
              <li className="flex gap-3"><span className="text-orange-400 font-bold shrink-0">1.</span> You call the billing rep (GPT) and state your dispute</li>
              <li className="flex gap-3"><span className="text-orange-400 font-bold shrink-0">2.</span> After each response, you get a private coaching tip</li>
              <li className="flex gap-3"><span className="text-orange-400 font-bold shrink-0">3.</span> The rep gets more cooperative as you make better arguments</li>
              <li className="flex gap-3"><span className="text-orange-400 font-bold shrink-0">4.</span> Track concessions you win in real time</li>
            </ol>
          </div>

          <button onClick={startSession} className="btn-primary text-base py-3 px-8">
            <Phone className="w-5 h-5" />
            Start Roleplay Call
          </button>
        </div>
      ) : (
        /* ── Active session ── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat panel */}
          <div className="lg:col-span-2 flex flex-col gap-0 card border-zinc-700 bg-zinc-900/60 p-0 overflow-hidden">
            {/* Call header */}
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-zinc-300" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-zinc-900" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">Alex — {SCENARIOS.find((s) => s.id === scenario)?.label}</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400">Call in progress</span>
                  </div>
                </div>
              </div>
              <button
                onClick={resetSession}
                className="text-xs text-zinc-500 hover:text-white border border-zinc-700 rounded-lg px-3 py-1.5 transition-colors"
              >
                End Call
              </button>
            </div>

            {/* Phase progress */}
            <div className="px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
              {Object.entries(PHASE_LABELS).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1">
                  <div className={clsx(
                    "text-xs font-semibold px-2 py-0.5 rounded-full transition-all",
                    currentPhase === key
                      ? `${val.color} bg-white/10`
                      : val.step < (PHASE_LABELS[currentPhase]?.step ?? 1) ? "text-zinc-500" : "text-zinc-700"
                  )}>
                    {val.label}
                  </div>
                  {val.step < 4 && <ChevronRight className="w-3 h-3 text-zinc-700" />}
                </div>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto max-h-[420px] px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={clsx("flex gap-3 items-start", msg.role === "user" ? "flex-row-reverse" : "")}>
                  <div className={clsx(
                    "shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5",
                    msg.role === "assistant" ? "bg-zinc-700" : "bg-orange-600"
                  )}>
                    {msg.role === "assistant"
                      ? <Bot className="w-4 h-4 text-zinc-300" />
                      : <User className="w-4 h-4 text-white" />
                    }
                  </div>
                  <div className={clsx(
                    "max-w-[80%] space-y-2"
                  )}>
                    <div className={clsx(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "assistant"
                        ? "bg-zinc-800 text-zinc-200 rounded-tl-none"
                        : "bg-orange-600/20 border border-orange-500/20 text-white rounded-tr-none"
                    )}>
                      {msg.content}
                    </div>
                    {/* Concession badge */}
                    {msg.concessionMade && msg.concessionDetail && (
                      <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-2.5 py-1.5">
                        <TrendingUp className="w-3 h-3 shrink-0" />
                        Concession: {msg.concessionDetail}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 items-center">
                  <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-zinc-300" />
                  </div>
                  <div className="bg-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-orange-400 text-xs bg-orange-500/10 rounded-lg px-3 py-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {error}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-zinc-800 px-4 py-3 flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What do you say to the billing rep?..."
                rows={2}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 resize-none outline-none leading-relaxed"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className={clsx(
                  "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  input.trim() && !loading
                    ? "bg-orange-500 hover:bg-orange-400 text-black"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                )}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Coaching tip */}
            {lastAssistantMsg?.coaching && (
              <div className="card border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wide mb-2">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Coaching Tip
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{lastAssistantMsg.coaching}</p>
              </div>
            )}

            {/* Power move */}
            {lastAssistantMsg?.powerMoveAvailable && (
              <div className="card border-orange-500/20 bg-orange-500/5">
                <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wide mb-2">
                  <Zap className="w-3.5 h-3.5" />
                  Power Move Available
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-3">{lastAssistantMsg.powerMoveAvailable}</p>
              </div>
            )}

            {/* Concessions won */}
            {concessions.length > 0 && (
              <div className="card border-green-500/20 bg-green-500/5">
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wide mb-2">
                  <Target className="w-3.5 h-3.5" />
                  Concessions Won ({concessions.length})
                </div>
                <ul className="space-y-1.5">
                  {concessions.map((c, i) => (
                    <li key={i} className="text-zinc-300 text-xs flex gap-2">
                      <span className="text-green-400">✓</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Power phrases */}
            <div className="card border-zinc-700">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wide mb-3">
                <Shield className="w-3.5 h-3.5" />
                Power Phrases — Click to Use
              </div>
              <div className="space-y-1.5">
                {POWER_PHRASES.map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => sendMessage(phrase)}
                    disabled={loading}
                    className="w-full text-left text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg px-3 py-2 transition-colors border border-transparent hover:border-zinc-700 disabled:opacity-40"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
