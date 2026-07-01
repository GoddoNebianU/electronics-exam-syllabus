/* ==========================================================================
 * ExamplesPage.tsx — 电磁场例题（期末考点全覆盖）
 *
 * 数据来自 content/fields/examples.json（Example[]），按分类分组展示。
 * 每题：题干（行内数学）+ 可折叠分步解答 + 最终答案 + 关联公式跳转。
 * 题干默认显示，解答默认折叠（先自己想，再展开核对）。
 * ==========================================================================
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FIELDS_CATEGORIES, FIELDS_EXAMPLES, FIELDS_FORMULAS } from '../data/content';
import type { Example, Formula } from '../data/types';
import { renderDisplay } from '../lib/katex';
import { renderRichText } from '../lib/text';
import { PageHeader } from '../components/PageHeader';

/** 公式 id → 所属分类 id（用于关联公式的跳转目标） */
const FORMULA_CAT: Record<string, string> = Object.fromEntries(
  FIELDS_FORMULAS.map((f: Formula) => [f.id, f.cat]),
);
const FORMULA_TITLE: Record<string, string> = Object.fromEntries(
  FIELDS_FORMULAS.map((f: Formula) => [f.id, f.title]),
);

export function ExamplesPage() {
  const [catFilter, setCatFilter] = useState<string>(''); // '' = 全部

  useEffect(() => {
    document.documentElement.setAttribute('data-subject', 'fields');
    document.title = '电磁场例题 · 电子技术基础考纲';
  }, []);

  const total = FIELDS_EXAMPLES.length;

  const groups = useMemo(() => {
    const items = catFilter === '' ? FIELDS_EXAMPLES : FIELDS_EXAMPLES.filter((e) => e.cat === catFilter);
    return FIELDS_CATEGORIES.map((c) => ({
      cat: c,
      items: items.filter((e) => e.cat === c.id),
    })).filter((g) => g.items.length > 0);
  }, [catFilter]);

  return (
    <div className="examples-root">
      <PageHeader
        title="电磁场例题"
        subtitle={`期末考点全覆盖 · 共 ${total} 题 · 8 分类`}
      />

      {/* 分类筛选 */}
      <div className="examples-filter">
        <button
          type="button"
          className="examples-chip"
          data-active={catFilter === ''}
          onClick={() => setCatFilter('')}
        >
          全部
        </button>
        {FIELDS_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className="examples-chip"
            data-active={catFilter === c.id}
            onClick={() => setCatFilter(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* 题目分组 */}
      {groups.length === 0 ? (
        <div className="examples-empty">暂无例题。</div>
      ) : (
        groups.map((g) => (
          <section key={g.cat.id} className="examples-section" id={`excat-${g.cat.id}`}>
            <h3 className="examples-section__title">
              <span>{g.cat.name}</span>
              <small>{g.cat.brief}</small>
              <em>{g.items.length} 题</em>
            </h3>
            {g.items.map((ex) => (
              <ExampleCard key={ex.id} ex={ex} />
            ))}
          </section>
        ))
      )}

      <p className="examples-hint">
        提示：先自己想，再点「显示解答」核对分步过程。点关联公式可跳到公式手册。
      </p>
    </div>
  );
}

/** 单题卡片 */
function ExampleCard({ ex }: { ex: Example }) {
  const [open, setOpen] = useState(false);
  const catName = FIELDS_CATEGORIES.find((c) => c.id === ex.cat)?.name ?? '';

  return (
    <article className="example" id={`ex-${ex.id}`}>
      <header className="example__head">
        {ex.type && <span className="example__type">{ex.type}</span>}
        <span className="example__cat">{catName}</span>
      </header>

      <h4 className="example__title">{ex.title}</h4>

      <div
        className="example__problem"
        dangerouslySetInnerHTML={{ __html: renderRichText(ex.problem) }}
      />

      <button
        type="button"
        className="example__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="example__toggle-icon">{open ? '▾' : '▸'}</span>
        {open ? '收起解答' : '显示解答'}
        <span className="example__toggle-count">{ex.steps.length} 步</span>
      </button>

      {open && (
        <div className="example__solution">
          <ol className="example__steps">
            {ex.steps.map((s, i) => (
              <li className="example__step" key={i}>
                <span
                  className="example__step-text"
                  dangerouslySetInnerHTML={{ __html: renderRichText(s.text) }}
                />
                {s.latex && (
                  <div
                    className="example__step-math"
                    dangerouslySetInnerHTML={{ __html: renderDisplay(s.latex) }}
                  />
                )}
              </li>
            ))}
          </ol>

          {ex.answer && (
            <div className="example__answer">
              <span className="example__answer-label">答案</span>
              <div
                className="example__answer-math"
                dangerouslySetInnerHTML={{ __html: renderDisplay(ex.answer) }}
              />
            </div>
          )}

          {ex.related && ex.related.length > 0 && (
            <div className="example__related">
              <span className="example__related-label">相关公式：</span>
              {ex.related.map((fid) => {
                const cat = FORMULA_CAT[fid];
                const title = FORMULA_TITLE[fid] ?? fid;
                return cat ? (
                  <Link key={fid} className="example__related-link" to={`/fields/${cat}`}>
                    {title}
                  </Link>
                ) : (
                  <span key={fid} className="example__related-link is-dangling">
                    {title}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
