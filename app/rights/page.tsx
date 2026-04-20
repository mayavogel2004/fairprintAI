"use client";

import { useState } from "react";
import {
  Shield,
  ChevronDown,
  ChevronUp,
  Scale,
  Heart,
  Home,
  FileText,
  Clock,
  Phone,
} from "lucide-react";
import clsx from "clsx";

interface Right {
  title: string;
  description: string;
  actionable?: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  rights: Right[];
}

const FEDERAL_RIGHTS: Category[] = [
  {
    id: "medical",
    label: "Medical Billing",
    icon: <Heart className="w-4 h-4" />,
    color: "text-orange-400",
    rights: [
      {
        title: "Right to an Itemized Bill",
        description:
          "Under federal law (and most state laws), you can request an itemized bill at any time — completely free. The hospital must provide a line-by-line breakdown of every charge. Many billing errors only appear when you get the itemized version.",
        actionable: 'Call the billing department and say: "I am requesting a complete itemized statement of all charges per my rights as a patient."',
      },
      {
        title: "No Surprises Act (2022)",
        description:
          "Protects you from unexpected out-of-network bills for emergency care and certain non-emergency services at in-network facilities. If you receive a surprise bill, you can file a complaint and request an Independent Dispute Resolution (IDR) process.",
        actionable: "File a complaint at cms.gov/nosurprises or call 1-800-985-3059.",
      },
      {
        title: "Right to a Good Faith Estimate",
        description:
          "Uninsured and self-pay patients must receive a Good Faith Estimate (GFE) from providers before scheduled services. If your bill is $400 or more above the estimate, you can dispute it.",
        actionable: "Always ask for a GFE before any scheduled procedure. Keep it to compare against your final bill.",
      },
      {
        title: "Emergency Medical Treatment (EMTALA)",
        description:
          "Any hospital with an emergency department must provide a medical screening exam and stabilizing treatment regardless of your ability to pay. You cannot be turned away from an ER for lack of insurance or money.",
        actionable: "If you were turned away or told you needed to pay before being seen, report it to CMS immediately.",
      },
      {
        title: "Hospital Financial Assistance (Charity Care)",
        description:
          "Under the Affordable Care Act, nonprofit hospitals must have financial assistance programs. They are required to make these programs widely available. If your income is below 200–400% of the federal poverty level, you may qualify for free or reduced-cost care.",
        actionable: 'Ask the billing department: "What financial assistance programs are available?" and request a charity care application.',
      },
      {
        title: "Medical Debt Credit Reporting",
        description:
          "As of 2023, medical debt under $500 cannot appear on your credit report. The three major credit bureaus (Equifax, Experian, TransUnion) agreed to remove medical debt under this threshold. Paid medical debt must also be removed.",
        actionable: "Check your credit report at annualcreditreport.com and dispute any medical debt under $500.",
      },
    ],
  },
  {
    id: "insurance",
    label: "Insurance Appeals",
    icon: <Shield className="w-4 h-4" />,
    color: "text-amber-400",
    rights: [
      {
        title: "Right to Appeal a Denial",
        description:
          "If your insurance claim is denied, you have the right to appeal — both internally (to your insurance company) and externally (to an independent review organization). Under the ACA, insurers must allow at least one internal appeal.",
        actionable: "Request the denial in writing. You typically have 180 days from the denial date to file an internal appeal.",
      },
      {
        title: "External Review Rights",
        description:
          "If your internal appeal fails, you have the right to an independent external review. The insurer must comply with the external reviewer's decision. This process is free for you.",
        actionable: "Contact your state insurance commissioner or use the federal external review process at healthcare.gov.",
      },
      {
        title: "Explanation of Benefits (EOB)",
        description:
          "After any claim is processed, your insurer must send you an Explanation of Benefits showing what was billed, what was approved, and what you owe. Carefully compare the EOB to your hospital bill — they should match.",
        actionable: "Request your EOB if you didn't receive one. Discrepancies between the EOB and your bill are major red flags.",
      },
      {
        title: "Coverage Disclosure",
        description:
          "Insurers must provide a Summary of Benefits and Coverage (SBC) — a plain-language document explaining your coverage. They must also provide 60 days' notice before any material changes to your plan.",
        actionable: "Request your SBC to understand exactly what your plan covers before disputes.",
      },
    ],
  },
  {
    id: "lease",
    label: "Tenant Rights",
    icon: <Home className="w-4 h-4" />,
    color: "text-green-400",
    rights: [
      {
        title: "Security Deposit Limits",
        description:
          "Most states limit security deposits to 1–2 months' rent. Landlords must return your deposit within a specific timeframe (usually 14–30 days) after move-out and provide an itemized list of any deductions.",
        actionable: "Document the condition of the property on move-in with photos and written documentation signed by both parties.",
      },
      {
        title: "Habitability Standards",
        description:
          "All residential leases include an implied warranty of habitability. Your landlord must keep the property in a livable condition — working heat, plumbing, electricity, and freedom from pest infestations.",
        actionable: "Send repair requests in writing (email/certified mail) and keep records. Unaddressed habitability issues may allow rent withholding in some states.",
      },
      {
        title: "Notice Requirements",
        description:
          "Landlords must give proper notice before entering (typically 24–48 hours), before rent increases, and before starting eviction proceedings. The specific timeframes vary by state.",
        actionable: "If your landlord enters without notice, document it. Repeated violations may constitute harassment under some state laws.",
      },
      {
        title: "Anti-Retaliation Protections",
        description:
          "It is illegal for a landlord to retaliate against you for reporting housing code violations, contacting a housing authority, or organizing with other tenants. Retaliation includes eviction, rent increases, or reducing services.",
        actionable: "Keep records of all complaints and any actions taken by the landlord afterward. Timing is key to proving retaliation.",
      },
    ],
  },
];

const STATES_RESOURCES: Record<string, { appeals: string; charity: string; tenant: string; hotline: string }> = {
  CA: { appeals: "45 days for internal appeal", charity: "Strong Medi-Cal charity care requirements", tenant: "AB 1482 rent control protections", hotline: "1-800-927-4357 (CA Dept of Insurance)" },
  NY: { appeals: "45 days internal, 60 days external", charity: "Hospital Financial Assistance law (2022)", tenant: "NYC Tenant Protection Unit, RSA protections", hotline: "1-800-342-3736 (NY Dept of Financial Services)" },
  TX: { appeals: "30 days internal appeal", charity: "Texas Indigent Healthcare Program", tenant: "No statewide rent control", hotline: "1-800-252-3439 (TX Dept of Insurance)" },
  FL: { appeals: "30 days internal appeal", charity: "Charity Care at eligible hospitals", tenant: "Landlord notice: 12 hrs for entry", hotline: "1-877-693-5236 (FL Dept of Financial Services)" },
  IL: { appeals: "60 days internal appeal", charity: "Illinois Hospital Uncompensated Care Act", tenant: "RLTO protections in Chicago", hotline: "1-866-445-5364 (IL Dept of Insurance)" },
  LA: { appeals: "30 days internal appeal", charity: "Louisiana Indigent Care Act", tenant: "10-day notice for eviction", hotline: "1-800-259-5300 (LA Dept of Insurance)" },
  WA: { appeals: "60 days internal appeal", charity: "Hospital Charity Care law — very strong", tenant: "RLTA 59.18 — strong tenant protections", hotline: "1-800-562-6900 (WA Insurance Commissioner)" },
  GA: { appeals: "30 days internal appeal", charity: "Certificate of Need hospitals required", tenant: "60-day notice to terminate", hotline: "1-800-656-2298 (GA Dept of Insurance)" },
  OH: { appeals: "180 days internal appeal", charity: "Ohio Hospital Financial Assistance policy", tenant: "30-day notice for termination", hotline: "1-800-686-1526 (OH Dept of Insurance)" },
  PA: { appeals: "180 days internal appeal", charity: "PA Free Care Program at nonprofit hospitals", tenant: "Philadelphia Tenant Protection Ord.", hotline: "1-877-881-6388 (PA Insurance Dept)" },
};

const STATE_OPTIONS = [
  { value: "", label: "Select your state…" },
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "IL", label: "Illinois" },
  { value: "LA", label: "Louisiana" },
  { value: "WA", label: "Washington" },
  { value: "GA", label: "Georgia" },
  { value: "OH", label: "Ohio" },
  { value: "PA", label: "Pennsylvania" },
];

export default function RightsPage() {
  const [openCategory, setOpenCategory] = useState<string>("medical");
  const [openRight, setOpenRight] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState("");

  function toggleCategory(id: string) {
    setOpenCategory(openCategory === id ? "" : id);
    setOpenRight(null);
  }

  function toggleRight(key: string) {
    setOpenRight(openRight === key ? null : key);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-orange-600 rounded-lg p-2">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="text-zinc-400 text-sm">Your Legal Protections</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">Know Your Rights</h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          You have more power than you think. Here are the federal and state protections
          that apply to medical bills, insurance denials, and rental leases.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="card text-center">
          <div className="text-2xl font-extrabold text-orange-400">6</div>
          <div className="text-zinc-400 text-xs mt-1">Patient Rights</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-extrabold text-amber-300">4</div>
          <div className="text-zinc-400 text-xs mt-1">Insurance Rights</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-extrabold text-green-400">4</div>
          <div className="text-zinc-400 text-xs mt-1">Tenant Rights</div>
        </div>
      </div>

      {/* Rights accordion */}
      <div className="space-y-3 mb-12">
        {FEDERAL_RIGHTS.map((category) => (
          <div key={category.id} className="card p-0 overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={category.color}>{category.icon}</span>
                <span className="text-white font-semibold">{category.label}</span>
                <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">
                  {category.rights.length} rights
                </span>
              </div>
              {openCategory === category.id ? (
                <ChevronUp className="w-4 h-4 text-zinc-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              )}
            </button>

            {/* Rights list */}
            {openCategory === category.id && (
              <div className="border-t border-zinc-800 divide-y divide-zinc-800">
                {category.rights.map((right, i) => {
                  const key = `${category.id}-${i}`;
                  const isOpen = openRight === key;
                  return (
                    <div key={key}>
                      <button
                        onClick={() => toggleRight(key)}
                        className="w-full text-left px-5 py-3 flex items-center justify-between hover:bg-white/3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-zinc-600 shrink-0" />
                          <span className="text-zinc-200 text-sm font-medium">{right.title}</span>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-4 space-y-3">
                          <p className="text-zinc-400 text-sm leading-relaxed">{right.description}</p>
                          {right.actionable && (
                            <div className="bg-orange-500/8 border border-orange-500/20 rounded-lg px-4 py-3">
                              <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-orange-400 text-xs font-bold uppercase tracking-wide mb-1">
                                    Action Step
                                  </div>
                                  <p className="text-zinc-300 text-sm leading-relaxed">{right.actionable}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* State-specific lookup */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-2">State-Specific Rules</h2>
        <p className="text-zinc-400 text-sm mb-5">
          Your state may have stronger protections than federal law. Select your state for key local rules.
        </p>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 mb-4 text-sm focus:outline-none focus:border-orange-500 transition-colors"
        >
          {STATE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-zinc-900">
              {o.label}
            </option>
          ))}
        </select>

        {selectedState && STATES_RESOURCES[selectedState] && (
          <div className="card border-orange-500/20 bg-orange-500/5 space-y-4">
            <h3 className="text-white font-bold text-lg">
              {STATE_OPTIONS.find((o) => o.value === selectedState)?.label} Specifics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: "Insurance Appeals", icon: <Shield className="w-3.5 h-3.5" />, value: STATES_RESOURCES[selectedState].appeals },
                { label: "Charity Care", icon: <Heart className="w-3.5 h-3.5" />, value: STATES_RESOURCES[selectedState].charity },
                { label: "Tenant Rights", icon: <Home className="w-3.5 h-3.5" />, value: STATES_RESOURCES[selectedState].tenant },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-wide mb-1">
                    {item.icon}
                    {item.label}
                  </div>
                  <p className="text-zinc-300 text-sm">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 bg-zinc-800/60 rounded-lg px-4 py-3">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wide mb-0.5">State Hotline</div>
                <div className="text-zinc-200 text-sm">{STATES_RESOURCES[selectedState].hotline}</div>
              </div>
            </div>
          </div>
        )}

        {selectedState && !STATES_RESOURCES[selectedState] && (
          <div className="card border-zinc-700 text-center py-6">
            <p className="text-zinc-400 text-sm">
              State-specific data for this state coming soon. Federal rights above still apply to you.
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <div className="mt-10 card border-orange-500/20 bg-orange-500/5 text-center">
        <Shield className="w-8 h-8 text-orange-400 mx-auto mb-3" />
        <h3 className="text-white font-bold text-lg mb-2">Ready to fight back?</h3>
        <p className="text-zinc-400 text-sm mb-4">
          Upload your document and let FairPrint find the violations in your bill.
        </p>
        <a href="/upload" className="btn-primary inline-flex">
          Analyze My Document
        </a>
      </div>
    </div>
  );
}
