import Link from "next/link";
import {
  Shield,
  FileSearch,
  AlertTriangle,
  FileText,
  ArrowRight,
  ChevronRight,
  Stethoscope,
  Home,
  FileX,
  CheckCircle2,
  Star,
} from "lucide-react";

const docTypes = [
  {
    icon: Stethoscope,
    title: "Medical Bills",
    description:
      "Spot duplicate charges, upcoding, and billing for services never received.",
    color: "text-green-400",
    bg: "bg-green-600/10",
    border: "border-green-600/20",
  },
  {
    icon: FileX,
    title: "Insurance Denials",
    description:
      "Understand why you were denied and get a compelling, pre-written appeal letter.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Home,
    title: "Rental Leases",
    description:
      "Identify illegal clauses, hidden fees, and terms that sign away your tenant rights.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const steps = [
  {
    step: "01",
    icon: FileSearch,
    title: "Upload Your Document",
    description: "Take a photo or upload a scan of your document. No special equipment needed.",
  },
  {
    step: "02",
    icon: AlertTriangle,
    title: "AI Audits It",
    description:
      "Our GPT-4 powered engine reads every line, looking for specific red flags, hidden fees, and rights violations.",
  },
  {
    step: "03",
    icon: FileText,
    title: "Get Your Battle Plan",
    description:
      "Receive a plain-English summary, a list of issues found, and a ready-to-download dispute letter.",
  },
];

const stats = [
  { value: "83%", label: "of medical bills contain at least one error" },
  { value: "$1,300", label: "average overcharge on a hospital bill" },
  { value: "90%", label: "of insurance denials go unappealed" },
  { value: "1 in 3", label: "leases contain unenforceable or illegal clauses" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-700/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-600/10 border border-green-600/20 text-green-400 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <Shield className="w-4 h-4" />
            AI-Powered Consumer Advocacy
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Stop paying bills{" "}
            <span className="gradient-text">you don&apos;t owe.</span>
          </h1>

          <p className="text-slate-400 text-xl md:text-2xl leading-relaxed mb-10 max-w-3xl mx-auto">
            Medical bills, insurance denials, and leases are written to confuse you.
            FairPrint reads them for you, finds the red flags, and writes your dispute letter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload" className="btn-primary text-base py-4 px-8">
              Analyze My Document Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/how-it-works" className="btn-secondary text-base py-4 px-8">
              See How It Works
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-slate-500 text-sm mt-6">
            No account needed · Documents are never stored · Powered by GPT-4 Vision
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-slate-900 border-y border-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold gradient-text mb-1">
                {value}
              </div>
              <div className="text-slate-400 text-sm leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card border-l-4 border-l-green-600 bg-gradient-to-r from-green-600/5 to-transparent">
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed italic">
              &ldquo;The average American reads at an 8th-grade level, but medical bills, insurance denials, and rental
              leases are written at a postgraduate legal level. This isn&apos;t an accident — it&apos;s a design
              feature meant to make us give up and pay. Vulnerable populations — the elderly, ESL speakers,
              first-time renters — often pay hidden fees or sign away their rights simply because they don&apos;t have
              the tools to fight back.&rdquo;
            </p>
            <p className="text-slate-500 text-sm mt-4">
              — The problem FairPrint was built to solve
            </p>
          </div>
        </div>
      </section>

      {/* Document types */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title">What can FairPrint analyze?</h2>
            <p className="section-subtitle mx-auto">
              Upload a photo of any of these documents and our AI will audit it instantly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {docTypes.map(({ icon: Icon, title, description, color, bg, border }) => (
              <div key={title} className={`card-hover border ${border}`}>
                <div className={`${bg} ${border} border w-12 h-12 rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                <Link
                  href="/upload"
                  className={`mt-5 inline-flex items-center gap-1 text-sm font-medium ${color} hover:underline`}
                >
                  Analyze now <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works preview */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title">Three steps to fight back</h2>
            <p className="section-subtitle mx-auto">
              From a confusing document to a professional dispute letter in under 60 seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-green-600/50 via-amber-500/50 to-purple-500/50" />

            {steps.map(({ step, icon: Icon, title, description }, i) => (
              <div key={step} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-slate-900 border-2 border-green-600/40 rounded-2xl mb-5 mx-auto">
                  <Icon className="w-7 h-7 text-green-400" />
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    {step}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/how-it-works" className="btn-secondary">
              Learn more about the technology
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="card bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-700">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Your complete <span className="gradient-text">Battle Plan</span>
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  FairPrint doesn&apos;t just translate your documents. It acts as your personal consumer advocate —
                  identifying every issue and giving you the exact words to fight back.
                </p>
                <ul className="space-y-3">
                  {[
                    "Plain-English summary of what the document actually says",
                    "Color-coded red flags with severity levels (High / Medium / Low)",
                    "Step-by-step action items specific to your situation",
                    "Professionally written dispute letter ready to download and mail",
                    "Estimated potential savings from identified overcharges",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                {/* Mock battle plan preview */}
                <div className="card border-slate-700 text-sm space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Red Flags Detected
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 flex gap-3">
                    <span className="badge-high shrink-0">High</span>
                    <p className="text-slate-300">Duplicate charge for &ldquo;Room &amp; Board&rdquo; — billed twice on 04/12 and 04/13 ($1,840.00)</p>
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3 flex gap-3">
                    <span className="badge-medium shrink-0">Med</span>
                    <p className="text-slate-300">Upcoding detected: &ldquo;Consultation&rdquo; billed as Level 5 (99215) but notes indicate Level 3 ($340 difference)</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 flex gap-3">
                    <span className="badge-low shrink-0">Low</span>
                    <p className="text-slate-300">Itemized bill missing — hospital must provide one upon request under federal law</p>
                  </div>
                </div>
                <p className="text-center text-slate-500 text-xs">
                  Sample output — your results will be based on your actual document
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-6">⚖️</div>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Knowledge is the equalizer.
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Hospitals, insurers, and landlords have lawyers on their side. Now you have AI.
            Upload your document and turn confusion into confidence.
          </p>
          <Link href="/upload" className="btn-primary text-lg py-4 px-10">
            Start Your Free Analysis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
