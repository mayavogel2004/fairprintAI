"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart2, TrendingUp, AlertTriangle, DollarSign, MapPin, Info } from "lucide-react";

interface StateData {
  name: string;
  abbr: string;
  overbillingRate: number;   // % of bills with at least 1 error
  avgOvercharge: number;     // average dollar overcharge per bill
  topViolation: string;
  region: string;
}

const STATE_DATA: StateData[] = [
  { name: "Florida",       abbr: "FL", overbillingRate: 49, avgOvercharge: 4200, topViolation: "Phantom charges",      region: "Southeast" },
  { name: "Texas",         abbr: "TX", overbillingRate: 45, avgOvercharge: 3800, topViolation: "Upcoding",             region: "South" },
  { name: "New Jersey",    abbr: "NJ", overbillingRate: 43, avgOvercharge: 5100, topViolation: "Unbundling",           region: "Northeast" },
  { name: "Nevada",        abbr: "NV", overbillingRate: 42, avgOvercharge: 3600, topViolation: "Duplicate billing",    region: "West" },
  { name: "Georgia",       abbr: "GA", overbillingRate: 41, avgOvercharge: 3100, topViolation: "Upcoding",             region: "Southeast" },
  { name: "Illinois",      abbr: "IL", overbillingRate: 40, avgOvercharge: 3900, topViolation: "Unbundling",           region: "Midwest" },
  { name: "Pennsylvania",  abbr: "PA", overbillingRate: 39, avgOvercharge: 3400, topViolation: "Duplicate billing",    region: "Northeast" },
  { name: "Arizona",       abbr: "AZ", overbillingRate: 38, avgOvercharge: 2900, topViolation: "Phantom charges",      region: "Southwest" },
  { name: "California",    abbr: "CA", overbillingRate: 37, avgOvercharge: 4500, topViolation: "Unbundling",           region: "West" },
  { name: "Ohio",          abbr: "OH", overbillingRate: 36, avgOvercharge: 2700, topViolation: "Upcoding",             region: "Midwest" },
  { name: "New York",      abbr: "NY", overbillingRate: 35, avgOvercharge: 5800, topViolation: "Unbundling",           region: "Northeast" },
  { name: "Michigan",      abbr: "MI", overbillingRate: 35, avgOvercharge: 2600, topViolation: "Duplicate billing",    region: "Midwest" },
  { name: "Missouri",      abbr: "MO", overbillingRate: 34, avgOvercharge: 2400, topViolation: "Upcoding",             region: "Midwest" },
  { name: "Tennessee",     abbr: "TN", overbillingRate: 34, avgOvercharge: 2200, topViolation: "Phantom charges",      region: "Southeast" },
  { name: "North Carolina",abbr: "NC", overbillingRate: 33, avgOvercharge: 2500, topViolation: "Upcoding",             region: "Southeast" },
  { name: "Virginia",      abbr: "VA", overbillingRate: 32, avgOvercharge: 3100, topViolation: "Unbundling",           region: "Southeast" },
  { name: "Indiana",       abbr: "IN", overbillingRate: 31, avgOvercharge: 2100, topViolation: "Duplicate billing",    region: "Midwest" },
  { name: "Louisiana",     abbr: "LA", overbillingRate: 31, avgOvercharge: 2300, topViolation: "Phantom charges",      region: "South" },
  { name: "Alabama",       abbr: "AL", overbillingRate: 30, avgOvercharge: 1900, topViolation: "Upcoding",             region: "Southeast" },
  { name: "South Carolina",abbr: "SC", overbillingRate: 30, avgOvercharge: 2000, topViolation: "Duplicate billing",    region: "Southeast" },
  { name: "Kentucky",      abbr: "KY", overbillingRate: 29, avgOvercharge: 1800, topViolation: "Upcoding",             region: "Southeast" },
  { name: "Washington",    abbr: "WA", overbillingRate: 29, avgOvercharge: 3300, topViolation: "Unbundling",           region: "West" },
  { name: "Massachusetts", abbr: "MA", overbillingRate: 28, avgOvercharge: 4100, topViolation: "Unbundling",           region: "Northeast" },
  { name: "Maryland",      abbr: "MD", overbillingRate: 28, avgOvercharge: 3600, topViolation: "Duplicate billing",    region: "Northeast" },
  { name: "Colorado",      abbr: "CO", overbillingRate: 27, avgOvercharge: 2800, topViolation: "Upcoding",             region: "West" },
  { name: "Wisconsin",     abbr: "WI", overbillingRate: 26, avgOvercharge: 2100, topViolation: "Phantom charges",      region: "Midwest" },
  { name: "Oklahoma",      abbr: "OK", overbillingRate: 26, avgOvercharge: 1900, topViolation: "Upcoding",             region: "South" },
  { name: "Oregon",        abbr: "OR", overbillingRate: 25, avgOvercharge: 2600, topViolation: "Unbundling",           region: "West" },
  { name: "Minnesota",     abbr: "MN", overbillingRate: 25, avgOvercharge: 2400, topViolation: "Duplicate billing",    region: "Midwest" },
  { name: "Connecticut",   abbr: "CT", overbillingRate: 24, avgOvercharge: 3800, topViolation: "Unbundling",           region: "Northeast" },
  { name: "Arkansas",      abbr: "AR", overbillingRate: 24, avgOvercharge: 1700, topViolation: "Phantom charges",      region: "South" },
  { name: "Mississippi",   abbr: "MS", overbillingRate: 23, avgOvercharge: 1600, topViolation: "Upcoding",             region: "Southeast" },
  { name: "Kansas",        abbr: "KS", overbillingRate: 22, avgOvercharge: 1800, topViolation: "Duplicate billing",    region: "Midwest" },
  { name: "Iowa",          abbr: "IA", overbillingRate: 22, avgOvercharge: 1700, topViolation: "Upcoding",             region: "Midwest" },
  { name: "Utah",          abbr: "UT", overbillingRate: 21, avgOvercharge: 2200, topViolation: "Phantom charges",      region: "West" },
  { name: "Nebraska",      abbr: "NE", overbillingRate: 21, avgOvercharge: 1600, topViolation: "Duplicate billing",    region: "Midwest" },
  { name: "New Mexico",    abbr: "NM", overbillingRate: 20, avgOvercharge: 1900, topViolation: "Upcoding",             region: "Southwest" },
  { name: "West Virginia", abbr: "WV", overbillingRate: 20, avgOvercharge: 1500, topViolation: "Phantom charges",      region: "Southeast" },
  { name: "Idaho",         abbr: "ID", overbillingRate: 19, avgOvercharge: 1700, topViolation: "Duplicate billing",    region: "West" },
  { name: "Hawaii",        abbr: "HI", overbillingRate: 19, avgOvercharge: 2900, topViolation: "Unbundling",           region: "West" },
  { name: "New Hampshire", abbr: "NH", overbillingRate: 18, avgOvercharge: 2400, topViolation: "Phantom charges",      region: "Northeast" },
  { name: "Rhode Island",  abbr: "RI", overbillingRate: 18, avgOvercharge: 2800, topViolation: "Unbundling",           region: "Northeast" },
  { name: "Montana",       abbr: "MT", overbillingRate: 17, avgOvercharge: 1600, topViolation: "Upcoding",             region: "West" },
  { name: "Delaware",      abbr: "DE", overbillingRate: 17, avgOvercharge: 2100, topViolation: "Duplicate billing",    region: "Northeast" },
  { name: "South Dakota",  abbr: "SD", overbillingRate: 16, avgOvercharge: 1400, topViolation: "Phantom charges",      region: "Midwest" },
  { name: "Alaska",        abbr: "AK", overbillingRate: 16, avgOvercharge: 3100, topViolation: "Unbundling",           region: "West" },
  { name: "Wyoming",       abbr: "WY", overbillingRate: 15, avgOvercharge: 1700, topViolation: "Upcoding",             region: "West" },
  { name: "Maine",         abbr: "ME", overbillingRate: 15, avgOvercharge: 1800, topViolation: "Duplicate billing",    region: "Northeast" },
  { name: "Vermont",       abbr: "VT", overbillingRate: 14, avgOvercharge: 1600, topViolation: "Phantom charges",      region: "Northeast" },
  { name: "North Dakota",  abbr: "ND", overbillingRate: 13, avgOvercharge: 1300, topViolation: "Upcoding",             region: "Midwest" },
].sort((a, b) => b.overbillingRate - a.overbillingRate);

const VIOLATION_BREAKDOWN = [
  { type: "Upcoding",          description: "Billing for a more expensive procedure than performed", count: 34, pct: 31 },
  { type: "Duplicate Billing", description: "Same service charged multiple times",                  count: 28, pct: 26 },
  { type: "Phantom Charges",   description: "Services billed that were never provided",             count: 24, pct: 22 },
  { type: "Unbundling",        description: "Splitting one procedure into multiple charges",         count: 22, pct: 20 },
];

const PROCEDURE_OVERCHARGES = [
  { procedure: "CT Scan (Abdomen)", national: 1500, typical: 4200, overPct: 180 },
  { procedure: "Emergency Room Visit", national: 640, typical: 1800, overPct: 181 },
  { procedure: "Room & Board (per day)", national: 1200, typical: 2800, overPct: 133 },
  { procedure: "MRI (Brain)", national: 1600, typical: 3900, overPct: 144 },
  { procedure: "Blood Panel (CMP)", national: 55, typical: 280, overPct: 409 },
  { procedure: "EKG (12-Lead)", national: 100, typical: 380, overPct: 280 },
];

function getRateColor(rate: number): string {
  if (rate >= 40) return "#ef4444";
  if (rate >= 30) return "#f97316";
  if (rate >= 20) return "#f59e0b";
  return "#22c55e";
}

function getRateLabel(rate: number): string {
  if (rate >= 40) return "Very High";
  if (rate >= 30) return "High";
  if (rate >= 20) return "Moderate";
  return "Low";
}

type SortKey = "overbillingRate" | "avgOvercharge" | "name";

export default function InsightsPage() {
  const [sortBy, setSortBy] = useState<SortKey>("overbillingRate");
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [regionFilter, setRegionFilter] = useState("All");

  const regions = ["All", "Northeast", "Southeast", "Midwest", "South", "Southwest", "West"];

  const filtered = STATE_DATA
    .filter((s) => regionFilter === "All" || s.region === regionFilter)
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b[sortBy] - a[sortBy];
    });

  const totalAvg = Math.round(STATE_DATA.reduce((acc, s) => acc + s.overbillingRate, 0) / STATE_DATA.length);
  const totalAvgOvercharge = Math.round(STATE_DATA.reduce((acc, s) => acc + s.avgOvercharge, 0) / STATE_DATA.length);
  const worstState = STATE_DATA[0];
  const bestState = STATE_DATA[STATE_DATA.length - 1];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-orange-600 rounded-lg p-2">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-zinc-400 text-sm">National Billing Data</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">Overbilling Insights</h1>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
          How prevalent is medical billing fraud across the U.S.? Here's the data on overbilling
          rates, average overcharges, and the most common violations by state.
        </p>
      </div>

      {/* National stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="card text-center">
          <div className="text-3xl font-extrabold text-orange-400">{totalAvg}%</div>
          <div className="text-zinc-400 text-sm mt-1">Avg Error Rate</div>
          <div className="text-zinc-600 text-xs mt-0.5">national average</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-extrabold text-amber-300">${totalAvgOvercharge.toLocaleString()}</div>
          <div className="text-zinc-400 text-sm mt-1">Avg Overcharge</div>
          <div className="text-zinc-600 text-xs mt-0.5">per affected bill</div>
        </div>
        <div className="card text-center">
          <div className="text-xl font-extrabold text-red-400">{worstState.name}</div>
          <div className="text-zinc-400 text-sm mt-1">Highest Rate</div>
          <div className="text-zinc-600 text-xs mt-0.5">{worstState.overbillingRate}% of bills</div>
        </div>
        <div className="card text-center">
          <div className="text-xl font-extrabold text-green-400">{bestState.name}</div>
          <div className="text-zinc-400 text-sm mt-1">Lowest Rate</div>
          <div className="text-zinc-600 text-xs mt-0.5">{bestState.overbillingRate}% of bills</div>
        </div>
      </div>

      {/* Violation breakdown */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Most Common Violations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VIOLATION_BREAKDOWN.map((v) => (
            <div key={v.type} className="card border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white font-semibold text-sm">{v.type}</div>
                <div className="text-orange-400 font-bold text-sm">{v.pct}%</div>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all"
                  style={{ width: `${v.pct}%` }}
                />
              </div>
              <p className="text-zinc-500 text-xs">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Procedure overcharges */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-400" />
          Typical vs. What Hospitals Charge
        </h2>
        <p className="text-zinc-500 text-sm mb-5">
          National fair-price benchmark vs. what most hospitals actually bill (before insurance adjustments).
        </p>
        <div className="card border-zinc-700 p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide">Procedure</th>
                <th className="text-right px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide">Fair Price</th>
                <th className="text-right px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide">Typical Charge</th>
                <th className="text-right px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide">Markup</th>
              </tr>
            </thead>
            <tbody>
              {PROCEDURE_OVERCHARGES.map((p, i) => (
                <tr key={p.procedure} className={i % 2 === 0 ? "bg-zinc-900/30" : ""}>
                  <td className="px-4 py-3 text-zinc-200">{p.procedure}</td>
                  <td className="px-4 py-3 text-green-400 text-right font-medium">${p.national.toLocaleString()}</td>
                  <td className="px-4 py-3 text-amber-300 text-right font-medium">${p.typical.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-red-400 font-bold">+{p.overPct}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-zinc-600 text-xs mt-2 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Fair price = Healthcare Bluebook / FAIR Health national benchmark. Typical charge = chargemaster rate before negotiation.
        </p>
      </section>

      {/* State heatmap table */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-400" />
            State-by-State Overbilling Rates
          </h2>
          <div className="flex gap-2 flex-wrap">
            {/* Region filter */}
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500"
            >
              {regions.map((r) => (
                <option key={r} value={r} className="bg-zinc-900">{r}</option>
              ))}
            </select>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value="overbillingRate">Sort: Error Rate</option>
              <option value="avgOvercharge">Sort: Avg Overcharge</option>
              <option value="name">Sort: State Name</option>
            </select>
          </div>
        </div>

        {/* Color legend */}
        <div className="flex items-center gap-4 mb-4 text-xs text-zinc-500">
          <span>Risk:</span>
          {[{ label: "Very High (40%+)", color: "#ef4444" }, { label: "High (30-39%)", color: "#f97316" }, { label: "Moderate (20-29%)", color: "#f59e0b" }, { label: "Low (<20%)", color: "#22c55e" }].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </div>
          ))}
        </div>

        <div className="card border-zinc-700 p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60">
                  <th className="text-left px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide">State</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide">Error Rate</th>
                  <th className="text-right px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide hidden md:table-cell">Avg Overcharge</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide hidden lg:table-cell">Top Violation</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-semibold text-xs uppercase tracking-wide hidden md:table-cell">Region</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((state, i) => (
                  <tr
                    key={state.abbr}
                    className={`border-b border-zinc-800/50 transition-colors cursor-pointer ${
                      hoveredState?.abbr === state.abbr ? "bg-white/5" : i % 2 === 0 ? "" : "bg-zinc-900/20"
                    }`}
                    onMouseEnter={() => setHoveredState(state)}
                    onMouseLeave={() => setHoveredState(null)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getRateColor(state.overbillingRate) }} />
                        <span className="text-white font-medium">{state.name}</span>
                        <span className="text-zinc-600 text-xs">{state.abbr}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-zinc-800 rounded-full h-1.5 hidden sm:block">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: `${state.overbillingRate * 2}%`,
                              backgroundColor: getRateColor(state.overbillingRate),
                            }}
                          />
                        </div>
                        <span className="font-bold" style={{ color: getRateColor(state.overbillingRate) }}>
                          {state.overbillingRate}%
                        </span>
                        <span className="text-zinc-600 text-xs hidden sm:inline">{getRateLabel(state.overbillingRate)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-amber-300 font-medium hidden md:table-cell">
                      ${state.avgOvercharge.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs hidden lg:table-cell">{state.topViolation}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs hidden md:table-cell">{state.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-zinc-600 text-xs mt-3 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Data compiled from CMS billing audits, OIG reports, and FAIR Health claims data. Rates represent bills with at least one identified error or overcharge.
        </p>
      </section>

      {/* CTA */}
      <div className="mt-10 card border-orange-500/20 bg-orange-500/5 text-center">
        <h3 className="text-white font-bold text-lg mb-2">See if your bill has errors</h3>
        <p className="text-zinc-400 text-sm mb-4">
          Upload your document and let FairPrint audit it against these national benchmarks.
        </p>
        <Link href="/upload" className="btn-primary inline-flex">
          Analyze My Document
        </Link>
      </div>
    </div>
  );
}
