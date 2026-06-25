/* ==========================================================================
 * StatsBar.tsx — 统计面板：单科目横向条形（SVG/CSS）
 * 从 StatsPanel 抽出。
 * ========================================================================== */
import type { SubjectStat } from '../store/useProgressStore';

/** 单科目横向条形 */
export function StatsBar({ stat }: { stat: SubjectStat }) {
  const pct = stat.total > 0 ? Math.round((stat.reviewed / stat.total) * 100) : 0;
  return (
    <div className="stats__bar-row">
      <div className="stats__bar-head">
        <span className="stats__bar-name">{stat.name}</span>
        <span className="stats__bar-count">
          <em>{stat.reviewed}</em>/{stat.total} · {pct}%
        </span>
      </div>
      <div className="stats__bar-track">
        <div
          className="stats__bar-fill"
          data-subject={stat.subjectId}
          style={{
            width: `${pct}%`,
            transition: 'width 500ms cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
    </div>
  );
}
