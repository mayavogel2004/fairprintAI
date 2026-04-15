"use client";

import { useState, useCallback } from "react";
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
} from "lucide-react";
import clsx from "clsx";

const DOC_TYPES = [
  {
    id: "medical_bill",
    icon: Stethoscope,
    label: "Medical Bill",
    description: "Hospital, clinic, or provider bill",
    color: "text-blue-400",
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
  },
  {
    id: "insurance_denial",
    icon: FileX,
    label: "Insurance Denial",
    description: "Denial letter or Explanation of Benefits (EOB)",
    color: "text-teal-400",
    border: "border-teal-500/40",
    bg: "bg-teal-500/10",
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
    color: "text-slate-400",
    border: "border-slate-600",
    bg: "bg-slate-800",
  },
] as const;

type DocTypeId = (typeof DOC_TYPES)[number]["id"];

type AnalysisState = "idle" | "reading" | "analyzing" | "done" | "error";

const ANALYSIS_STEPS = [
  { id: "reading", label: "Reading your document with GPT-4 Vision..." },
  { id: "analyzing", label: "Auditing for red flags and billing errors..." },
  { id: "drafting", label: "Drafting your personalized dispute letter..." },
];

export default function UploadPage() {
  const router = useRouter();
  const [docType, setDocType] = useState<DocTypeId>("medical_bill");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<AnalysisState>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"], "application/pdf": [".pdf"] },
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

    setState("reading");
    setStepIndex(0);
    setError(null);

    // Simulate step progression during API call
    const stepTimer1 = setTimeout(() => setStepIndex(1), 3000);
    const stepTimer2 = setTimeout(() => setStepIndex(2), 7000);

    try {
      // Extract base64 data from data URL
      const base64 = preview.split(",")[1];
      const mimeType = preview.split(";")[0].split(":")[1];

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          mimeType,
          documentType: docType,
          fileName: file.name,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? `Server error: ${response.status}`);
      }

      const result = await response.json();

      // Store result in sessionStorage and navigate to results
      sessionStorage.setItem("fairprint_result", JSON.stringify(result));
      sessionStorage.setItem("fairprint_doc_type", docType);
      sessionStorage.setItem("fairprint_file_name", file.name);

      setState("done");
      setTimeout(() => router.push("/results"), 800);
    } catch (err: unknown) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const isLoading = state === "reading" || state === "analyzing";

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-3">
          Analyze Your Document
        </h1>
        <p className="text-slate-400 text-lg">
          Upload a photo or scan and our AI will audit it for red flags in seconds.
        </p>
      </div>

      {/* Step 1: Document Type */}
      <div className="mb-8">
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            1
          </span>
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
                docType === id
                  ? `${border} ${bg}`
                  : "border-slate-800 bg-slate-900 hover:border-slate-600"
              )}
            >
              {docType === id && (
                <CheckCircle2 className={`absolute top-2 right-2 w-4 h-4 ${color}`} />
              )}
              <Icon className={`w-6 h-6 ${docType === id ? color : "text-slate-500"} mb-2`} />
              <div className={`font-semibold text-sm ${docType === id ? "text-white" : "text-slate-300"}`}>
                {label}
              </div>
              <div className="text-slate-500 text-xs mt-0.5 leading-tight">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Upload */}
      <div className="mb-8">
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            2
          </span>
          Upload your document
        </h2>

        {!file ? (
          <div
            {...getRootProps()}
            className={clsx(
              "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200",
              isDragActive
                ? "border-blue-500 bg-blue-500/5"
                : "border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800/50"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                <Upload className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            <p className="text-white font-semibold text-lg mb-1">
              {isDragActive ? "Drop it here!" : "Drag & drop your document"}
            </p>
            <p className="text-slate-400 text-sm mb-4">or click to browse your files</p>
            <p className="text-slate-600 text-xs">
              Supports JPG, PNG, WEBP, HEIC, PDF · Max 10MB
            </p>
          </div>
        ) : (
          <div className="card border-slate-700">
            <div className="flex items-start gap-4">
              {preview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                  {preview.startsWith("data:image") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Document preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-slate-500" />
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-white font-medium truncate">{file.name}</p>
                    <p className="text-slate-500 text-sm mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze
                    </p>
                  </div>
                  <button
                    onClick={clearFile}
                    disabled={isLoading}
                    className="text-slate-500 hover:text-white transition-colors p-1"
                    aria-label="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span className="text-teal-400 text-sm">File ready</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Loading / Progress */}
      {isLoading && (
        <div className="card border-blue-500/30 bg-blue-500/5 mb-8 animate-fade-in">
          <div className="flex flex-col items-center text-center py-4">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-4" />
            <p className="text-white font-semibold text-lg mb-6">
              Your AI advocate is working...
            </p>
            <div className="w-full max-w-sm space-y-3">
              {ANALYSIS_STEPS.map(({ id, label }, i) => (
                <div
                  key={id}
                  className={clsx(
                    "flex items-center gap-3 text-sm transition-all duration-500",
                    i < stepIndex
                      ? "text-teal-400"
                      : i === stepIndex
                      ? "text-white"
                      : "text-slate-600"
                  )}
                >
                  {i < stepIndex ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : i === stepIndex ? (
                    <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Done state */}
      {state === "done" && (
        <div className="card border-teal-500/30 bg-teal-500/5 mb-8 text-center animate-fade-in">
          <CheckCircle2 className="w-10 h-10 text-teal-400 mx-auto mb-3" />
          <p className="text-teal-400 font-semibold">Analysis complete! Redirecting to your Battle Plan...</p>
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
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 hover:shadow-blue-700/40 hover:-translate-y-0.5"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          )}
        >
          Analyze My Document →
        </button>
      )}

      {/* Privacy note */}
      <p className="text-slate-600 text-xs text-center mt-4 leading-relaxed">
        Your document is sent securely to OpenAI&apos;s API and is not stored by FairPrint.
        Redact any sensitive personal info (SSN, account numbers) before uploading.
      </p>
    </div>
  );
}
