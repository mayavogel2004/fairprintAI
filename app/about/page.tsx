import Link from "next/link";
import {
  Shield,
  Heart,
  Target,
  Lightbulb,
  ArrowRight,
  Users,
  Scale,
} from "lucide-react";

const values = [
  {
    icon: Scale,
    title: "Equity",
    description:
      "The consumer protection laws that protect you are public knowledge — but inaccessible in practice. FairPrint bridges that gap.",
  },
  {
    icon: Shield,
    title: "Privacy",
    description:
      "We never store your documents. Your data flows from your device to OpenAI's API and back. That's it.",
  },
  {
    icon: Lightbulb,
    title: "Transparency",
    description:
      "Every red flag comes with an explanation. We don't just flag issues — we teach you why they're problems.",
  },
  {
    icon: Heart,
    title: "Accessibility",
    description:
      "No account. No subscription. No legal jargon. FairPrint is designed for anyone, anywhere, regardless of background.",
  },
];

const whoWeHelp = [
  { emoji: "👵", group: "Elderly patients", detail: "on fixed incomes who can't absorb billing errors" },
  { emoji: "🌐", group: "ESL speakers", detail: "navigating documents written in dense legal English" },
  { emoji: "🏠", group: "First-time renters", detail: "who don't know what's normal in a lease" },
  { emoji: "💊", group: "Chronically ill patients", detail: "repeatedly fighting insurance denials" },
  { emoji: "👨‍👩‍👧", group: "Families in crisis", detail: "dealing with unexpected medical debt" },
  { emoji: "🎓", group: "Anyone", detail: "who has ever felt defeated by a confusing document" },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-800 rounded-2xl mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-5">
          About <span className="gradient-text">FairPrint</span>
        </h1>
        <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto">
          FairPrint was built with one conviction: the complexity of legal and medical documents is
          a barrier that hurts the people who can least afford it.
        </p>
      </div>

      {/* Mission quote */}
      <section className="mb-16">
        <div className="card border-l-4 border-l-stone-300 bg-gradient-to-r from-stone-300/5 to-transparent">
          <p className="text-slate-200 text-xl leading-relaxed italic mb-4">
            &ldquo;Knowledge is power. When hospitals, insurance companies, and landlords hold all the knowledge,
            the power imbalance is total. FairPrint is an attempt to rebalance that equation using the same
            technology that powers billion-dollar enterprises — but pointed directly at the consumer.&rdquo;
          </p>
          <p className="text-slate-500 text-sm">— The FairPrint Mission</p>
        </div>
      </section>

      {/* The problem we're solving */}
      <section className="mb-16">
        <h2 className="section-title mb-6">The Problem</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>
              The average American reads at an 8th-grade reading level. Medical bills, insurance
              Explanation of Benefits (EOB) documents, and rental leases are written at a
              postgraduate legal level — often intentionally.
            </p>
            <p>
              This gap is a design feature, not a bug. Confusing documents lead to abandoned disputes,
              unpaid appeals, and signed contracts with terms that were never understood.
            </p>
          </div>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>
              Studies show that over 80% of medical bills contain errors. Ninety percent of insurance
              denials go unappealed — even though more than half of all appeals succeed when filed.
              One in three leases contains clauses that are unenforceable or outright illegal.
            </p>
            <p>
              The tools to fight back exist, but they&apos;re buried in legal codes, billing manuals,
              and government websites that require a law degree to navigate.
            </p>
          </div>
        </div>
      </section>

      {/* Who we help */}
      <section className="mb-16">
        <h2 className="section-title mb-3">Who FairPrint Is For</h2>
        <p className="text-slate-400 mb-8">Everyone. But especially:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {whoWeHelp.map(({ emoji, group, detail }) => (
            <div key={group} className="card border-slate-700 hover:border-slate-600 transition-colors">
              <div className="text-3xl mb-3">{emoji}</div>
              <div className="text-white font-semibold text-sm mb-1">{group}</div>
              <div className="text-slate-500 text-xs leading-tight">{detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="section-title mb-3">Our Values</h2>
        <p className="text-slate-400 mb-8">The principles behind every design decision.</p>
        <div className="grid md:grid-cols-2 gap-5">
          {values.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card-hover">
              <div className="bg-red-700/10 border border-red-700/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Limitations */}
      <section className="mb-16">
        <div className="card border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-start gap-4">
            <Target className="w-6 h-6 text-yellow-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-white font-semibold mb-2">Important Limitations</h3>
              <div className="text-slate-400 text-sm leading-relaxed space-y-2">
                <p>
                  FairPrint provides AI-generated analysis for informational and educational purposes only.
                  It is <strong className="text-slate-200">not a law firm</strong> and does not provide legal,
                  medical, or financial advice.
                </p>
                <p>
                  The dispute letters generated are starting points, not final documents. You should
                  review them, personalize them with your own details, and consult a licensed professional
                  for important legal or medical decisions.
                </p>
                <p>
                  AI can make mistakes. Always verify the AI&apos;s findings against your original document
                  before taking action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built with AI callout */}
      <section className="mb-16">
        <div className="card border-slate-700 text-center">
          <Users className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold text-lg mb-2">Built with AI, for people</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            FairPrint was built as a demonstration that AI can be a force for consumer empowerment —
            not just enterprise productivity. The same technology used to automate legal work at
            law firms can help a first-generation renter understand their lease.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Try it for free.</h2>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto">
          No account. No payment. Upload your document and see your Battle Plan in under a minute.
        </p>
        <Link href="/upload" className="btn-primary text-lg py-4 px-10">
          Analyze My Document
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
