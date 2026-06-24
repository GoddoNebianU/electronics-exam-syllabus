/* ==========================================================================
 * ProgressTrack.tsx — 侧边栏复习进度条
 * 迁移自 legacy/js/sidebar.js 的 renderProgress。
 * ========================================================================== */
import { useProgressStore } from '../store/useProgressStore';
import { TOTAL_CHAPTERS } from '../data/syllabus';

export function ProgressTrack() {
  // 订阅 map 变化，重算计数
  const map = useProgressStore((s) => s.map);
  const done = Object.keys(map).length;
  const pct = Math.round((done / TOTAL_CHAPTERS) * 100);

  return (
    <div className="progress">
      <div className="progress__head">
        <span className="progress__label">复习进度</span>
        <span className="progress__count">
          已复习 <em>{done}</em> / {TOTAL_CHAPTERS}
        </span>
      </div>
      <div className="progress__bar">
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
