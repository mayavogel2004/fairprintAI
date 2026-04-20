"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import {
  Upload,
  Image as ImageIcon,
  Stethoscope,
  FileX,
  Home,
  FileQuestion,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

const DOC_TYPES = [
  {
    id: "medical_bill",
    icon: Stethoscope,
    label: "Medical Bill",
    description: "Hospital, clinic, or provider bill",
    color: "text-orange-400",
    border: "border-orange-500/40",
    bg: "bg-orange-500/10",
  },
  {
    id: "insurance_denial",
    icon: FileX,
    label: "Insurance Denial",
    description: "Denial letter or Explanation of Benefits (EOB)",
    color: "text-amber-300",
    border: "border-amber-400/40",
    bg: "bg-amber-400/10",
  },
  {
    id: "lease",
    icon: Home,
    label: "Rental Lease",
    description: "Apartment, house, or commercial lease",
    color: "text-purple-400",
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
  },
  {
    id: "other",
    icon: FileQuestion,
    label: "Other Document",
    description: "Contract, bill, notice, or other document",
    color: "text-zinc-400",
    border: "border-zinc-600",
    bg: "bg-zinc-800",
  },
] as const;

type DocTypeId = (typeof DOC_TYPES)[number]["id"];
type AnalysisState = "idle" | "streaming" | "analyzing" | "done" | "error";

export default function UploadPage() {
  const router = useRouter();
  const [docType, setDocType] = useState<DocTypeId>("medical_bill");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<AnalysisState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const [streamDone, setStreamDone] = useState(false);
  const streamingRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDropRejected: (rejections) => {
      const msg = rejections[0]?.errors[0]?.message ?? "File not accepted.";
      setError(msg);
    },
  });

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file || !preview) return;

    setState("streaming");
    setStreamingText("");
    setStreamDone(false);
    setError(null);

    const base64 = preview.split(",")[1];
    const mimeType = preview.split(";")[0].split(":")[1];
    const payload = { image: base64, mimeType, documentType: docType, fileName: file.name };

    // Run streaming narrative + structured analysis in parallel
    const streamPromise = (async () => {
      try {
        const res = await fetch("/api/analyze-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok || !res.body) return;
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setStreamingText((prev) => prev + chunk);
          // Auto-scroll the streaming box
          if (streamingRef.current) {
            streamingRef.current.scrollTop = streamingRef.current.scrollHeight;
          }
        }
      } catch {
        // streaming failed silently — JSON analysis still runs
      } finally {
        setStreamDone(true);
      }
    })();

    const jsonPromise = (async () => {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Server error: ${res.status}`);
      }
      return res.json();
    })();

    try {
      // Wait for both to complete
      const [, result] = await Promise.all([streamPromise, jsonPromise]);

      sessionStorage.setItem("fairprint_result", JSON.stringify(result));
      sessionStorage.setItem("fairprint_doc_type", docType);
      sessionStorage.setItem("fairprint_file_name", file.name);

      setState("done");
      setTimeout(() => router.push("/results"), 1500);
    } catch (err: unknown) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const isLoading = state === "streaming" || state === "analyzing";

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-3">Analyze Your Document</h1>
        <p className="text-zinc-400 text-lg">
          Upload a photo or scan and our AI will audit it for red flags in seconds.
        </p>
      </div>

      {/* Step 1: Document Type */}
      <div className="mb-8">
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="bg-orange-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">1</span>
          What type of document is this?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DOC_TYPES.map(({ id, icon: Icon, label, description, color, border, bg }) => (
            <button
              key={id}
              onClick={() => setDocType(id)}
              disabled={isLoading}
              className={clsx(
                "relative p-4 rounded-xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5",
                docType === id ? `${border} ${bg}` : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
              )}
            >
              {docType === id && (
                <CheckCircle2 className={`absolute top-2 right-2 w-4 h-4 ${color}`} />
              )}
              <Icon className={`w-6 h-6 ${docType === id ? color : "text-zinc-500"} mb-2`} />
              <div className={`font-semibold text-sm ${docType === id ? "text-white" : "text-zinc-300"}`}>{label}</div>
              <div className="text-zinc-500 text-xs mt-0.5 leading-tight">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Upload */}
      <div className="mb-8">
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="bg-orange-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">2</span>
          Upload your document
        </h2>

        {!file ? (
          <div
            {...getRootProps()}
            className={clsx(
              "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200",
              isDragActive
                ? "border-orange-500 bg-orange-500/5"
                : "border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800/50"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
                <Upload className="w-10 h-10 text-orange-400" />
              </div>
            </div>
            <p className="text-white font-semibold text-lg mb-1">
              {isDragActive ? "Drop it here!" : "Drag & drop your document"}
            </p>
            <p className="text-zinc-400 text-sm mb-4">or click to browse your files</p>
            <p className="text-zinc-600 text-xs">Supports JPG, PNG, WEBP, HEIC · Max 10MB</p>
          </div>
        ) : (
          <div className="card border-zinc-700">
            <div className="flex items-start gap-4">
              {preview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                  {preview.startsWith("data:image") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Document preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-zinc-500" />
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-white font-medium truncate">{file.name}</p>
                    <p className="text-zinc-500 text-sm mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze
                    </p>
                  </div>
                  <button onClick={clearFile} disabled={isLoading} className="text-zinc-500 hover:text-white transition-colors p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span className="text-amber-300 text-sm">File ready</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && state !== "error" && (
          <div className="mt-3 flex items-center gap-2 text-orange-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* ── Streaming Analysis Display ── */}
      {(state === "streaming" || state === "done") && (
        <div className="mb-8 animate-fade-in">
          <div className="card border-orange-500/20 bg-zinc-900/80 p-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-orange-500/5">
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                {!streamDone && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-zinc-900 animate-pulse" />
                )}
              </div>
              <div>
                <div className="text-white text-sm font-semibold">FairPrint AI</div>
                <div className="text-xs text-zinc-500">
                  {streamDone ? "Scan complete — building battle plan..." : "Scanning your document live..."}
                </div>
              </div>
              {!streamDone && (
                <div className="ml-auto flex gap-0.5">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
              {streamDone && <Loader2 className="ml-auto w-4 h-4 text-orange-400 animate-spin" />}
            </div>

            {/* Streaming text */}
            <div
              ref={streamingRef}
              className="px-5 py-4 max-h-48 overflow-y-auto"
            >
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                {streamingText}
                {!streamDone && (
                  <span className="inline-block w-0.5 h-4 bg-orange-400 ml-0.5 animate-pulse align-middle" />
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Done state */}
      {state === "done" && (
        <div className="card border-amber-400/30 bg-amber-400/5 mb-8 text-center animate-fade-in">
          <CheckCircle2 className="w-10 h-10 text-amber-300 mx-auto mb-3" />
          <p className="text-amber-300 font-semibold">Analysis complete! Redirecting to your Battle Plan...</p>
        </div>
      )}

      {/* Error state */}
      {state === "error" && error && (
        <div className="card border-red-500/30 bg-red-500/5 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-semibold text-sm">Analysis failed</p>
            <p className="text-zinc-400 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Submit button */}
      {!isLoading && state !== "done" && (
        <button
          onClick={handleSubmit}
          disabled={!file || isLoading}
          className={clsx(
            "w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200",
            file
              ? "bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-950/30 hover:shadow-orange-900/40 hover:-translate-y-0.5"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          )}
        >
          Analyze My Document →
        </button>
      )}

      <p className="text-zinc-600 text-xs text-center mt-4 leading-relaxed">
        Your document is sent securely to OpenAI&apos;s API and is not stored by FairPrint.
        Redact any sensitive personal info (SSN, account numbers) before uploading.
      </p>
    </div>
  );
}
