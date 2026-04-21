"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Plus,
  Trash2,
  ChevronRight,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trophy,
  XCircle,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";

export type DisputeStatus = "pending" | "submitted" | "appealed" | "won" | "lost";

export interface Dispute {
  id: string;
  fileName: string;
  docType: string;
  date: string;
  status: DisputeStatus;
  redFlagCount: number;
  highCount: number;
  potentialSavings: string;
  summary: string;
}

const COLUMNS: { id: DisputeStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "pending",   label: "Pending",   icon: <Clock className="w-4 h-4" />,        color: "border-zinc-600 text-zinc-400" },
  { id: "submitted", label: "Submitted", icon: <ArrowRight className="w-4 h-4" />,   color: "border-orange-500/50 text-orange-400" },
  { id: "appealed",  label: "Appealed",  icon: <AlertTriangle className="w-4 h-4" />, color: "border-amber-500/50 text-amber-400" },
  { id: "won",       label: "Won ✓",     icon: <Trophy className="w-4 h-4" />,        color: "border-green-500/50 text-green-400" },
  { id: "lost",      label: "Lost",      icon: <XCircle className="w-4 h-4" />,       color: "border-red-500/30 text-red-400" },
];

const DOC_TYPE_LABELS: Record<string, string> = {
  medical_bill: "Medical Bill",
  insurance_denial: "Insurance Denial",
  lease: "Rental Lease",
  other: "Document",
};

const STATUS_NEXT: Record<DisputeStatus, DisputeStatus | null> = {
  pending: "submitted",
  submitted: "appealed",
  appealed: "won",
  won: null,
  lost: null,
};

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadDisputes(): Dispute[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("fairprint_disputes") ?? "[]");
  } catch {
    return [];
  }
}

function saveDisputes(disputes: Dispute[]) {
  localStorage.setItem("fairprint_disputes", JSON.stringify(disputes));
}

export default function DashboardPage() {
  const { user, isSignedIn } = useUser();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [mounted, setMounted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setDisputes(loadDisputes());
    setMounted(true);
  }, []);

  function moveDispute(id: string, newStatus: DisputeStatus) {
    const updated = disputes.map((d) =>
      d.id === id ? { ...d, status: newStatus } : d
    );
    setDisputes(updated);
    saveDisputes(updated);
  }

  function deleteDispute(id: string) {
    const updated = disputes.filter((d) => d.id !== id);
    setDisputes(updated);
    saveDisputes(updated);
    setDeleteConfirm(null);
  }

  const totalWon = disputes.filter((d) => d.status === "won").length;
  const totalActive = disputes.filter((d) => !["won", "lost"].includes(d.status)).length;
  const totalSavings = disputes
    .filter((d) => d.status === "won")
    .reduce((acc, d) => {
      const num = parseFloat(d.potentialSavings.replace(/[^0-9.]/g, ""));
      return acc + (isNaN(num) ? 0 : num);
    }, 0);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        {/* Welcome banner for signed-in users */}
        {isSignedIn && user && (
          <div className="flex items-center gap-3 mb-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl px-5 py-4">
            {user.imageUrl && (
              <img src={user.imageUrl} alt={user.firstName ?? "User"} className="w-10 h-10 rounded-full ring-2 ring-orange-500/30" />
            )}
            <div>
              <p className="text-white font-semibold text-base">
                Welcome back, {user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "there"} 👋
              </p>
              <p className="text-zinc-400 text-sm">Your disputes and analyses are saved below.</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <div className="bg-orange-600 rounded-lg p-2">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-zinc-400 text-sm">Your Dispute Tracker</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white">Dashboard</h1>
            <p className="text-zinc-400 mt-2">
              Track every dispute from submission to resolution.
            </p>
          </div>
          <Link href="/upload" className="btn-primary">
            <Plus className="w-4 h-4" />
            New Analysis
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="card text-center">
          <div className="text-3xl font-extrabold text-orange-400">{disputes.length}</div>
          <div className="text-zinc-400 text-sm mt-1">Total Disputes</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-extrabold text-amber-300">{totalActive}</div>
          <div className="text-zinc-400 text-sm mt-1">Active Cases</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-extrabold text-green-400">{totalWon}</div>
          <div className="text-zinc-400 text-sm mt-1">Cases Won</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-extrabold text-amber-300 flex items-center justify-center gap-1">
            <DollarSign className="w-5 h-5" />
            {totalSavings > 0 ? totalSavings.toLocaleString() : "—"}
          </div>
          <div className="text-zinc-400 text-sm mt-1">Recovered</div>
        </div>
      </div>

      {/* Kanban Board */}
      {disputes.length === 0 ? (
        <div className="card border-dashed border-zinc-700 text-center py-20">
          <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-400 mb-2">No disputes tracked yet</h2>
          <p className="text-zinc-600 mb-6 max-w-sm mx-auto">
            After you analyze a document and get your Battle Plan, click{" "}
            <strong className="text-zinc-400">"Save to Tracker"</strong> to start tracking
            your dispute here.
          </p>
          <Link href="/upload" className="btn-primary">
            <Plus className="w-4 h-4" />
            Analyze Your First Document
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {COLUMNS.map((col) => {
            const colDisputes = disputes.filter((d) => d.status === col.id);
            return (
              <div key={col.id} className="flex flex-col gap-3">
                {/* Column header */}
                <div
                  className={clsx(
                    "flex items-center justify-between px-3 py-2 rounded-lg border bg-white/3",
                    col.color
                  )}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {col.icon}
                    {col.label}
                  </div>
                  <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full">
                    {colDisputes.length}
                  </span>
                </div>

                {/* Cards */}
                {colDisputes.map((dispute) => (
                  <DisputeCard
                    key={dispute.id}
                    dispute={dispute}
                    onMove={moveDispute}
                    onDelete={(id) => setDeleteConfirm(id)}
                    deleteConfirm={deleteConfirm}
                    onConfirmDelete={deleteDispute}
                    onCancelDelete={() => setDeleteConfirm(null)}
                  />
                ))}

                {colDisputes.length === 0 && (
                  <div className="border border-dashed border-zinc-800 rounded-xl h-20 flex items-center justify-center">
                    <span className="text-zinc-700 text-xs">Empty</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-10 card border-orange-500/20 bg-orange-500/5">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-orange-400" />
          How to use the tracker
        </h3>
        <ul className="text-zinc-400 text-sm space-y-1.5">
          <li>1. Analyze a document on the <Link href="/upload" className="text-orange-400 hover:underline">Upload page</Link></li>
          <li>2. Click <strong className="text-zinc-200">"Save to Tracker"</strong> on your results page</li>
          <li>3. Use the <strong className="text-zinc-200">Move Forward</strong> button as your dispute progresses</li>
          <li>4. Mark disputes as <strong className="text-green-400">Won</strong> or <strong className="text-red-400">Lost</strong> when resolved</li>
        </ul>
      </div>
    </div>
  );
}

// ── Dispute Card ─────────────────────────────────────────────────────────────

function DisputeCard({
  dispute,
  onMove,
  onDelete,
  deleteConfirm,
  onConfirmDelete,
  onCancelDelete,
}: {
  dispute: Dispute;
  onMove: (id: string, status: DisputeStatus) => void;
  onDelete: (id: string) => void;
  deleteConfirm: string | null;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
}) {
  const nextStatus = STATUS_NEXT[dispute.status];
  const isConfirming = deleteConfirm === dispute.id;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2 hover:border-zinc-700 transition-colors">
      {/* File name + type */}
      <div>
        <div className="text-white text-xs font-semibold truncate">{dispute.fileName}</div>
        <div className="text-zinc-500 text-xs mt-0.5">
          {DOC_TYPE_LABELS[dispute.docType] ?? "Document"} · {dispute.date}
        </div>
      </div>

      {/* Flag count */}
      <div className="flex items-center gap-1.5">
        <AlertTriangle className="w-3 h-3 text-orange-400" />
        <span className="text-xs text-zinc-400">
          {dispute.redFlagCount} flag{dispute.redFlagCount !== 1 ? "s" : ""}
          {dispute.highCount > 0 && (
            <span className="text-orange-400 ml-1">({dispute.highCount} high)</span>
          )}
        </span>
      </div>

      {dispute.potentialSavings && dispute.potentialSavings !== "—" && (
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-amber-400" />
          <span className="text-xs text-amber-400 font-medium">{dispute.potentialSavings}</span>
        </div>
      )}

      {/* Actions */}
      {isConfirming ? (
        <div className="flex gap-1.5 mt-1">
          <button
            onClick={() => onConfirmDelete(dispute.id)}
            className="flex-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg py-1 hover:bg-red-500/30 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onCancelDelete}
            className="flex-1 text-xs bg-zinc-800 text-zinc-400 rounded-lg py-1 hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex gap-1.5 mt-1">
          {nextStatus && (
            <button
              onClick={() => onMove(dispute.id, nextStatus)}
              className="flex-1 text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg py-1.5 hover:bg-orange-500/20 transition-colors flex items-center justify-center gap-1"
            >
              <ChevronRight className="w-3 h-3" />
              Move Forward
            </button>
          )}
          {dispute.status === "appealed" && (
            <button
              onClick={() => onMove(dispute.id, "lost")}
              className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg px-2 py-1.5 hover:bg-red-500/20 transition-colors"
            >
              Lost
            </button>
          )}
          <button
            onClick={() => onDelete(dispute.id)}
            className="text-xs bg-zinc-800 text-zinc-500 rounded-lg px-2 py-1.5 hover:bg-zinc-700 hover:text-zinc-300 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
