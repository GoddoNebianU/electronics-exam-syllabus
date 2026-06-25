/* ==========================================================================
 * StatsDonut.tsx — 统计面板：总体环形进度（SVG donut）
 * 从 StatsPanel 抽出。纯 SVG/CSS 绘图。
 * ========================================================================== */

/** 总体环形进度（SVG donut） */
export function StatsDonut({
  value,
  total,
  label,
}: {
  value: number;
  total: number;
  label: string;
}) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(value / total, 1) : 0;
  const dash = c * pct;
  return (
    <div className="stats__donut">
      <svg viewBox="0 0 100 100" width="108" height="108">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth="9"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--accent-line)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 500ms cubic-bezier(0.4,0,0.2,1)' }}
        />
        <text
          x="50"
          y="48"
          textAnchor="middle"
          dominantBaseline="central"
          className="stats__donut-pct"
          fill="var(--text)"
        >
          {Math.round(pct * 100)}%
        </text>
        <text
          x="50"
          y="64"
          textAnchor="middle"
          dominantBaseline="central"
          className="stats__donut-sub"
          fill="var(--text-faint)"
        >
          {value}/{total}
        </text>
      </svg>
      <div className="stats__donut-label">{label}</div>
    </div>
  );
}
