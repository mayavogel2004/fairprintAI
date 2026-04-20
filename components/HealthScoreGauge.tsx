"use client";

interface Props {
  score: number; // 0–100
  animated?: boolean;
}

export default function HealthScoreGauge({ score, animated = true }: Props) {
  const cx = 110;
  const cy = 105;
  const r = 82;
  const strokeW = 14;

  // Clamp score
  const s = Math.max(0, Math.min(100, score));

  // Convert a score value (0=left, 100=right) to an SVG point on the arc
  function getPoint(val: number) {
    const angle = Math.PI * (1 - val / 100);
    return {
      x: cx + r * Math.cos(angle),
      y: cy - r * Math.sin(angle),
    };
  }

  // Build an SVG arc path from score `from` to score `to`
  function arcPath(from: number, to: number) {
    const p1 = getPoint(from);
    const p2 = getPoint(to);
    // Never larger than a semicircle so large-arc=0
    return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  const needle = getPoint(s);

  // Color and label based on score
  const color =
    s >= 70 ? "#22c55e"   // green
    : s >= 40 ? "#f59e0b" // amber
    : "#ef4444";           // red

  const label =
    s >= 70 ? "Low Risk"
    : s >= 40 ? "Moderate Risk"
    : "High Risk";

  const sublabel =
    s >= 70 ? "Looks mostly clean"
    : s >= 40 ? "Some concerns found"
    : "Significant issues found";

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        viewBox="0 0 220 120"
        className="w-56 overflow-visible"
        aria-label={`Bill health score: ${s} out of 100 — ${label}`}
      >
        {/* ── Background track ── */}
        <path
          d={arcPath(0, 100)}
          fill="none"
          stroke="#27272a"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />

        {/* ── Zone indicators (faint) ── */}
        <path d={arcPath(0, 40)}  fill="none" stroke="#ef4444" strokeWidth={strokeW} opacity="0.18" />
        <path d={arcPath(40, 70)} fill="none" stroke="#f59e0b" strokeWidth={strokeW} opacity="0.18" />
        <path d={arcPath(70, 100)} fill="none" stroke="#22c55e" strokeWidth={strokeW} opacity="0.18" />

        {/* ── Score fill arc ── */}
        {s > 0 && (
          <path
            d={arcPath(0, s)}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            style={animated ? { transition: "stroke-dashoffset 1s ease" } : {}}
          />
        )}

        {/* ── Needle ── */}
        <line
          x1={cx}
          y1={cy}
          x2={needle.x.toFixed(2)}
          y2={needle.y.toFixed(2)}
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Needle center dot */}
        <circle cx={cx} cy={cy} r="5" fill={color} />
        <circle cx={cx} cy={cy} r="3" fill="white" />

        {/* ── Score number ── */}
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          fill="white"
          fontSize="26"
          fontWeight="800"
          fontFamily="Space Grotesk, sans-serif"
        >
          {s}
        </text>
        <text
          x={cx}
          y={cy + 38}
          textAnchor="middle"
          fill="#71717a"
          fontSize="10"
          fontFamily="Inter, sans-serif"
        >
          / 100
        </text>
      </svg>

      {/* Label below the gauge */}
      <div
        className="text-sm font-bold mt-1 tracking-wide"
        style={{ color }}
      >
        {label}
      </div>
      <div className="text-xs text-zinc-500 mt-0.5">{sublabel}</div>
    </div>
  );
}
