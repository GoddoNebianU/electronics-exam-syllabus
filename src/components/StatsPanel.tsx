/* ==========================================================================
 * StatsPanel.tsx — 复习统计面板（右侧抽屉）
 * 展示：总体完成率（环形 SVG）/ 各科目完成率（横向条形 SVG）/
 *       公式收藏数 / 收藏章节数 / 最近复习记录（时间倒序）。
 * 纯 SVG/CSS 绘图，不引图表库。素雅配色，无渐变。
 * 图表子组件：StatsDonut.tsx / StatsBar.tsx。
 * 受控组件：open + onClose。
 * ========================================================================== */
import { useEffect } from 'react';
import { useProgressStore } from '../store/useProgressStore';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { SYLLABUS, getChapter } from '../data/syllabus';
import { FORMULA_VIEWS } from '../data/formula-registry';
import { StatsDonut } from './StatsDonut';
import { StatsBar } from './StatsBar';

function formatTime(at: number): string {
  const d = new Date(at);
  const now = Date.now();
  const diff = now - at;
  const min = 60 * 1000;
  const hour = 60 * min;
  const day = 24 * hour;
  if (diff < min) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / min)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} 天前`;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${mm}-${dd} ${hh}:${mi}`;
}

interface StatsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function StatsPanel({ open, onClose }: StatsPanelProps) {
  const map = useProgressStore((s) => s.map);
  const perSubject = useProgressStore((s) => s.perSubject());
  const recent = useProgressStore((s) => s.recent(8));
  const favChapters = useFavoriteStore((s) => s.chapterList());
  const favFormulas = useFavoriteStore((s) => s.formulaList());

  const totalReviewed = Object.keys(map).length;
  const totalChapters = SYLLABUS.reduce((n, s) => n + s.chapters.length, 0);
  const totalFormulas = FORMULA_VIEWS.reduce(
    (n, v) => n + v.data.formulas.length,
    0,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`stats-backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`stats-drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="复习统计"
        aria-hidden={!open}
      >
        <header className="stats-drawer__head">
          <h2 className="stats-drawer__title">复习统计</h2>
          <button
            type="button"
            className="stats-drawer__close"
            aria-label="关闭统计面板"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <div className="stats-drawer__body">
          <section className="stats__section">
            <StatsDonut value={totalReviewed} total={totalChapters} label="总体复习进度" />
          </section>

          <section className="stats__section">
            <h3 className="stats__section-title">各科目完成率</h3>
            <div className="stats__bars">
              {perSubject.map((s) => (
                <StatsBar key={s.subjectId} stat={s} />
              ))}
            </div>
          </section>

          <section className="stats__section">
            <h3 className="stats__section-title">公式手册</h3>
            <div className="stats__cards">
              <div className="stats__card">
                <div className="stats__card-num">{favFormulas.length}</div>
                <div className="stats__card-label">收藏公式</div>
              </div>
              <div className="stats__card">
                <div className="stats__card-num">{totalFormulas}</div>
                <div className="stats__card-label">公式总数</div>
              </div>
              <div className="stats__card">
                <div className="stats__card-num">{favChapters.length}</div>
                <div className="stats__card-label">收藏章节</div>
              </div>
            </div>
          </section>

          <section className="stats__section">
            <h3 className="stats__section-title">最近复习</h3>
            {recent.length === 0 ? (
              <div className="stats__empty">
                还没有复习记录。标记章节为「已复习」后这里会显示。
              </div>
            ) : (
              <ul className="stats__recent">
                {recent.map((r, i) => {
                  const pair = getChapter(r.subjectId, r.chapterId);
                  if (!pair) return null;
                  const subjShort =
                    SYLLABUS.find((s) => s.id === r.subjectId)?.short ??
                    r.subjectId;
                  return (
                    <li
                      key={`${r.subjectId}-${r.chapterId}-${r.at}-${i}`}
                      className="stats__recent-item"
                    >
                      <span
                        className="stats__recent-dot"
                        data-subject={r.subjectId}
                      />
                      <span className="stats__recent-subject">{subjShort}</span>
                      <span className="stats__recent-title">
                        {pair.chapter.title}
                      </span>
                      <span className="stats__recent-time">{formatTime(r.at)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </aside>
    </>
  );
}
