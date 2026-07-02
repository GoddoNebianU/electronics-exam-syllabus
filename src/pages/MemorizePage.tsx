/* ==========================================================================
 * MemorizePage.tsx — 公式背记（闪卡）页
 *
 * 交互参考 memorize-math-formulas：题面（公式名）→ 揭晓答案（公式），
 * 上一张/下一张/答案 + 键盘（←/→/Space/n/l）+ 已看计数 + 公式组切换。
 *
 * 适配本项目数据：题面 = formula.title，答案 = formula.latex（KaTeX）。
 * 额外：默认只练「必背」（memorize !== false）、分类筛选、打乱、
 * 「会了」持久化进度（useMemorizeStore）。
 * ==========================================================================
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FORMULA_VIEWS, getFormulaView } from '../data/formula-registry';
import type { Formula, SymbolDef } from '../data/types';
import { renderDisplay } from '../lib/katex';
import { getRegistry, markupSymbols } from '../lib/markupSymbols';
import { PageHeader } from '../components/PageHeader';
import { SymbolPopover } from '../components/SymbolPopover';
import { memorizeKey, useMemorizeStore } from '../store/useMemorizeStore';

const SPACE = ' ';
const ENTER = 'Enter';

/** 判断事件目标是否在可编辑控件里（键盘快捷键需放行） */
function isEditableTarget(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || el.isContentEditable;
}

/** 线性同余 seeded 随机（给定 seed 产生稳定打乱） */
function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const out = [...arr];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function MemorizePage() {
  // —— 选择器状态 ——
  const [viewId, setViewId] = useState<string>(FORMULA_VIEWS[0].id);
  const [catFilter, setCatFilter] = useState<string>(''); // '' = 全部分类
  const [mustMemorizeOnly, setMustMemorizeOnly] = useState(true);
  const [shuffleSeed, setShuffleSeed] = useState(0); // 0 = 顺序；>0 = 打乱

  // —— 闪卡状态 ——
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [seenCount, setSeenCount] = useState(0); // 本次会话已看（揭晓过）计数

  const view = getFormulaViewById(viewId);
  const { categories, formulas, symbols } = view.data;
  const registry = useMemo(() => getRegistry(symbols), [symbols]);

  // 按当前选择过滤（科目在 viewId 切换时随 view 变）
  const baseDeck = useMemo<Formula[]>(
    () =>
      formulas.filter(
        (f) =>
          (catFilter === '' || f.cat === catFilter) &&
          (!mustMemorizeOnly || f.memorize !== false),
      ),
    [formulas, catFilter, mustMemorizeOnly],
  );

  const deck = useMemo<Formula[]>(
    () => (shuffleSeed === 0 ? baseDeck : seededShuffle(baseDeck, shuffleSeed)),
    [baseDeck, shuffleSeed],
  );

  const total = deck.length;
  const current = deck[pos];

  // 已会集合（订阅）
  const known = useMemorizeStore((s) => s.known);
  const toggleKnown = useMemorizeStore((s) => s.toggleKnown);
  const knownInDeck = useMemo(
    () => deck.filter((f) => known[memorizeKey(view.id, f.id)]).length,
    [deck, known, view.id],
  );

  // 主题色随选中科目
  useEffect(() => {
    document.documentElement.setAttribute('data-subject', view.subject);
    document.title = '公式背记 · 电子技术基础考纲';
  }, [view]);

  // 切换范围（科目/分类/必背）→ 复位闪卡
  useEffect(() => {
    setPos(0);
    setRevealed(false);
    setSeenCount(0);
  }, [viewId, catFilter, mustMemorizeOnly]);

  // 打乱变化 → 仅隐藏答案、钳制 pos
  useEffect(() => {
    setRevealed(false);
    setPos((p) => (total === 0 ? 0 : Math.min(p, total - 1)));
  }, [shuffleSeed, total]);

  // —— 动作 ——
  const go = (dir: 1 | -1) => {
    if (total === 0) return;
    if (revealed) setSeenCount((c) => c + 1); // 揭晓后翻走 = 看过一张（对齐参考）
    setRevealed(false);
    setPos((p) => (p + dir + total) % total);
  };
  const reveal = () => {
    if (!revealed) setRevealed(true);
  };
  /** 主键（Space/Enter）：未揭晓→揭晓；已揭晓→下一张（对齐参考的 Enter 逻辑） */
  const mainAction = () => (revealed ? go(1) : reveal());

  const onSelectView = (id: string) => {
    setViewId(id);
    setCatFilter('');
  };
  const onShuffle = () => setShuffleSeed((s) => (s === 0 ? 1 : s + 1));
  const onUnshuffle = () => setShuffleSeed(0);

  const currentKnown = current ? Boolean(known[memorizeKey(view.id, current.id)]) : false;

  // —— 键盘快捷键 ——
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      const k = e.key;
      if (k === 'ArrowRight' || k === 'n') {
        e.preventDefault();
        go(1);
      } else if (k === 'ArrowLeft' || k === 'l' || k === 'p') {
        e.preventDefault();
        go(-1);
      } else if (k === SPACE || k === ENTER) {
        e.preventDefault();
        mainAction();
      } else if (k === 'm') {
        if (current) {
          e.preventDefault();
          toggleKnown(memorizeKey(view.id, current.id));
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, total, current, view.id]);

  const answerHtml = useMemo(
    () => (current ? renderDisplay(markupSymbols(current.latex, current.symbols, symbols)) : ''),
    [current, symbols],
  );

  // 符号点击弹窗（与公式手册一致：点答案里的符号 → 显示定义）
  const [popover, setPopover] = useState<{ token: string; def: SymbolDef; anchor: HTMLElement } | null>(null);
  const onAnswerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!registry) return;
      const sym = (e.target as HTMLElement).closest('.sym') as HTMLElement | null;
      if (!sym) return;
      e.preventDefault();
      e.stopPropagation();
      const m = (sym.getAttribute('class') || '').match(/sym-([A-Za-z0-9_-]+)/);
      if (!m) return;
      const token = registry.resolve(m[1]);
      if (!token) return;
      const def = symbols[token];
      if (def) setPopover({ token, def, anchor: sym });
    },
    [registry, symbols],
  );

  const catName =
    catFilter === ''
      ? '全部分类'
      : categories.find((c) => c.id === catFilter)?.name ?? '全部分类';

  return (
    <div className="memorize-root">
      <PageHeader title="公式背记" subtitle={`${view.title} · ${catName}`}>
        <label className="memorize-select">
          <span>科目</span>
          <select
            value={viewId}
            onChange={(e) => onSelectView(e.target.value)}
            aria-label="选择科目"
          >
            {FORMULA_VIEWS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
          </select>
        </label>
        <label className="memorize-select">
          <span>分类</span>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            aria-label="选择分类"
          >
            <option value="">全部</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </PageHeader>

      {/* 控制条 */}
      <div className="memorize-controls">
        <button
          type="button"
          className="memorize-chip"
          data-active={mustMemorizeOnly}
          onClick={() => setMustMemorizeOnly((v) => !v)}
          title="仅练习考试必背公式（含非必背关闭）"
        >
          ✓ 仅必背
        </button>
        <button
          type="button"
          className="memorize-chip"
          data-active={shuffleSeed !== 0}
          onClick={shuffleSeed === 0 ? onShuffle : onUnshuffle}
          title="打乱顺序练习"
        >
          {shuffleSeed === 0 ? '⇄ 打乱' : '↞ 顺序'}
        </button>
        <span className="memorize-controls__spacer" />
        <span className="memorize-stat">
          已掌握 <em>{knownInDeck}</em>/{total}
        </span>
        <span className="memorize-stat memorize-stat--muted">
          本轮已看 <em>{seenCount}</em>
        </span>
      </div>

      {/* 进度条 */}
      <div className="memorize-progress" aria-hidden="true">
        <div
          className="memorize-progress__bar"
          style={{ width: `${total === 0 ? 0 : (knownInDeck / total) * 100}%` }}
        />
      </div>

      {/* 闪卡 */}
      {total === 0 ? (
        <div className="memorize-empty">
          <span className="memorize-empty__icon">∅</span>
          <p>当前筛选下没有公式。</p>
          <p className="memorize-empty__hint">
            试试关闭「仅必背」或切换分类。
          </p>
        </div>
      ) : (
        <article
          className="memorize-card"
          data-revealed={revealed}
          onClick={() => (!revealed ? reveal() : undefined)}
          title={revealed ? '按 → 看下一张' : '点击或按空格揭晓答案'}
        >
          <header className="memorize-card__head">
            <span className="memorize-card__index">
              第 {pos + 1} / {total}
            </span>
            <span className="memorize-card__cat">
              {categories.find((c) => c.id === current.cat)?.name}
            </span>
            <button
              type="button"
              className="memorize-card__known-toggle"
              data-known={currentKnown}
              onClick={(e) => {
                e.stopPropagation();
                toggleKnown(memorizeKey(view.id, current.id));
              }}
              title="标记此公式为已掌握（m）"
            >
              {currentKnown ? '✓ 会了' : '○ 会了'}
            </button>
          </header>

          <div className="memorize-card__title">{current.title}</div>

          <div className="memorize-card__body">
            <div className="memorize-card__body-inner">
              {!revealed ? (
                <div className="memorize-card__hint">
                  <span className="memorize-card__hint-line">回想这条公式</span>
                  <span className="memorize-card__hint-key">
                    点击卡片 / 按 <kbd>Space</kbd> 揭晓
                  </span>
                </div>
              ) : (
                <div
                  className="memorize-card__answer"
                  onClick={onAnswerClick}
                  dangerouslySetInnerHTML={{ __html: answerHtml }}
                />
              )}

              {revealed && current.note && (
                <p className="memorize-card__note">{current.note}</p>
              )}
            </div>
          </div>

          <footer className="memorize-card__foot">
            <button
              type="button"
              className="memorize-btn memorize-btn--ghost"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
            >
              ← 上一张 <kbd className="memorize-kbd">←</kbd>
            </button>

            <button
              type="button"
              className="memorize-btn memorize-btn--primary"
              onClick={(e) => {
                e.stopPropagation();
                mainAction();
              }}
            >
              {revealed ? '下一张 →' : '揭晓答案'}
              <kbd className="memorize-kbd">Space</kbd>
            </button>

            <button
              type="button"
              className="memorize-btn memorize-btn--ghost"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
            >
              下一张 <kbd className="memorize-kbd">→</kbd>
            </button>
          </footer>
        </article>
      )}

      {/* 键盘提示 */}
      <p className="memorize-keys">
        <kbd className="memorize-kbd">←</kbd>/<kbd className="memorize-kbd">→</kbd> 翻张 ·{' '}
        <kbd className="memorize-kbd">Space</kbd> 揭晓/下一张 ·{' '}
        <kbd className="memorize-kbd">n</kbd>/<kbd className="memorize-kbd">l</kbd> 下一/上一 ·{' '}
        <kbd className="memorize-kbd">m</kbd> 标记会了
      </p>

      <SymbolPopover
        def={popover?.def ?? null}
        token={popover?.token ?? null}
        anchor={popover?.anchor ?? null}
        onClose={() => setPopover(null)}
      />
    </div>
  );
}

/** 按 id 取公式视图（MemorizePage 仅用于类型收窄，视图必定存在） */
function getFormulaViewById(id: string): (typeof FORMULA_VIEWS)[number] {
  return getFormulaView(id) ?? FORMULA_VIEWS[0];
}
