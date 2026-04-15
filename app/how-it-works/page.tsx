import Link from "next/link";
import {
  Upload,
  Brain,
  Search,
  FileText,
  Download,
  ArrowRight,
  Cpu,
  Eye,
  Zap,
  Lock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "You upload a document",
    description:
      "Take a photo with your phone or upload a scanned image. FairPrint accepts JPG, PNG, WEBP, HEIC, and PDF files up to 10MB. You can upload a medical bill, insurance denial letter, rental lease, or any other consumer document.",
    detail: "Drag and drop or click to browse. No account required.",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  {
    step: "02",
    icon: Eye,
    title: "GPT-4 Vision reads the image",
    description:
      "Using OpenAI's GPT-4 Vision model, FairPrint reads your document exactly as a human would — understanding text, tables, numbers, and context — even from low-quality phone photos.",
    detail: "The AI can read handwriting, messy scans, and complex billing tables.",
    color: "text-teal-400",
    border: "border-teal-500/30",
    bg: "bg-teal-500/10",
  },
  {
    step: "03",
    icon: Search,
    title: "The AI audits for red flags",
    description:
      "This is where FairPrint goes beyond a simple summarizer. Specialized system prompts instruct the AI to act as a medical billing advocate, insurance appeal specialist, or tenant rights advisor — depending on your document type.",
    detail: "The AI checks for duplicate charges, upcoding, denial reasons, illegal clauses, and more.",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
  },
  {
    step: "04",
    icon: FileText,
    title: "Your Battle Plan is generated",
    description:
      "FairPrint produces a plain-English summary of the document, a color-coded list of red flags (high, medium, low severity), and a numbered list of action items tailored to your specific situation.",
    detail: "Every red flag includes an explanation of why it's a problem and what you can do.",
    color: "text-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
  },
  {
    step: "05",
    icon: Download,
    title: "Download your dispute letter",
    description:
      "The AI drafts a professionally worded, legally-sound dispute letter ready to sign, print, and mail. For medical bills it calls out specific billing codes. For insurance denials it cites the relevant plan language. For leases it references applicable tenant protections.",
    detail: "Download as a formatted PDF with one click.",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
  },
];

const techStack = [
  {
    icon: Brain,
    title: "GPT-4 Vision",
    description: "OpenAI's most capable vision model reads and understands your document images with near-human comprehension.",
  },
  {
    icon: Cpu,
    title: "Specialized System Prompts",
    description: "Each document type (medical, insurance, lease) uses a different AI persona — a medical billing advocate, an insurance appeal specialist, or a tenant rights advisor.",
  },
  {
    icon: Zap,
    title: "Real-time Analysis",
    description: "The entire process — from upload to complete Battle Plan — takes under 30 seconds.",
  },
  {
    icon: Lock,
    title: "Privacy by Design",
    description: "Documents are sent directly to OpenAI's API and are never stored on FairPrint's servers. We recommend redacting SSNs before uploading.",
  },
];

const redFlagTypes = [
  {
    category: "Medical Bills",
    flags: [
      "Duplicate line items (same service billed twice)",
      "Upcoding (billing for more expensive services than provided)",
      "Unbundling (splitting a single procedure into multiple charges)",
      "Balance billing violations (billing more than insurance contracted rate)",
      "Charges for cancelled or not-rendered services",
    ],
  },
  {
    category: "Insurance Denials",
    flags: [
      "Missing or incorrect denial reason code",
      "Failure to mention appeal rights and deadlines",
      "Pre-authorization that was actually granted",
      "Incorrect application of formulary exceptions",
      "Violations of the No Surprises Act or ACA requirements",
    ],
  },
  {
    category: "Rental Leases",
    flags: [
      "Illegal automatic renewal clauses",
      "Waiver of habitability rights (often unenforceable)",
      "Excessive security deposit amounts beyond state limits",
      "Prohibited eviction procedures or self-help clauses",
      "Ambiguous maintenance responsibility language",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          How <span className="gradient-text">FairPrint</span> Works
        </h1>
        <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto">
          From a confusing document to a ready-to-send dispute letter in five steps — powered by GPT-4 Vision.
        </p>
      </div>

      {/* Step-by-step */}
      <section className="mb-20 relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-green-500/50 hidden md:block" />

        <div className="space-y-10">
          {steps.map(({ step, icon: Icon, title, description, detail, color, border, bg }) => (
            <div key={step} className="flex gap-6 md:gap-8 relative">
              <div
                className={`shrink-0 relative z-10 w-14 h-14 ${bg} ${border} border-2 rounded-2xl flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-slate-600 text-xs font-bold tracking-wider uppercase">Step {step}</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
                <p className="text-slate-400 leading-relaxed mb-2">{description}</p>
                <div className={`inline-flex items-center gap-2 ${bg} ${border} border rounded-lg px-3 py-1.5 text-sm ${color}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology */}
      <section className="mb-20">
        <h2 className="section-title mb-2">The Technology</h2>
        <p className="text-slate-400 mb-10">What's running under the hood.</p>
        <div className="grid md:grid-cols-2 gap-5">
          {techStack.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card-hover">
              <div className="bg-blue-500/10 border border-blue-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Red flags reference */}
      <section className="mb-20">
        <h2 className="section-title mb-2">What the AI Looks For</h2>
        <p className="text-slate-400 mb-10">A sample of red flags by document type.</p>
        <div className="space-y-6">
          {redFlagTypes.map(({ category, flags }) => (
            <div key={category} className="card border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <h3 className="text-white font-semibold">{category}</h3>
              </div>
              <ul className="space-y-2">
                {flags.map((flag) => (
                  <li key={flag} className="flex items-start gap-3 text-sm text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400/60 mt-2 shrink-0" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to try it?</h2>
        <p className="text-slate-400 mb-8">Upload a document and see your Battle Plan in under a minute.</p>
        <Link href="/upload" className="btn-primary text-lg py-4 px-10">
          Analyze My Document
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
