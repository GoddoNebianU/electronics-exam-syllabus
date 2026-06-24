/* ==========================================================================
 * formula-core.js — 公式手册共享核心（数据无关）
 *
 * 电磁场（fields）与模电（modian）两个公式页共用本模块。调用方传入各自的
 * 数据集（categories / formulas / symbols 字典）+ 容器 + 主题/标题，core 负责：
 *   - markupSymbols：latex 源标记（区间调度，长 token 优先，\htmlClass 包裹）
 *   - createPopover：符号定义弹窗工厂（各自独立实例 + 独立 kidToToken）
 *   - mountFormulaPage：把整页（工具栏 + 分类导航 + 公式区 + 筛选 + 滚动联动
 *     + 符号点击委托）渲染进指定容器
 *
 * 约定：渲染出的 DOM class 沿用 fields-* 命名（见 fields.css），两个页面共享
 * 同一套样式；主题色由 <html data-subject="..."> 驱动，popover/nav 等会自动跟随。
 *
 * 依赖：全局 window.katex（vendor/katex/katex.min.js），trust:true 支持 \htmlClass。
 * ========================================================================== */

/* ==========================================================================
 * 1. KID 生成 + 按数据集独立的注册表
 * ========================================================================== */

/** 把 LaTeX token 转成 CSS class 安全 id（KID）。
 *  反斜杠→连字符；{} ^ 等结构字符丢弃；其余非 [A-Za-z0-9_-]→连字符；
 *  合并多余连字符；去除首尾连字符。
 *  '\nabla\times'→'nabla-times'  'E'→'E'
 *  '\varepsilon_0'→'varepsilon_0'  '\mathbf{S}'→'mathbfS'  'I_{CEO}'→'I_CEO'
 */
export function toKid(token) {
  return token
    .replace(/\\/g, '-')
    .replace(/[{}\^]/g, '')
    .replace(/[^A-Za-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** 按 symbolsDict 对象缓存注册表（WeakMap：dict→{kidOf,resolve}），
 *  保证每个数据集拥有独立的 kidToToken，互不混用。 */
const registries = new WeakMap();

/** 取/建某数据集的 KID 注册表。 */
export function getRegistry(symbolsDict) {
  let reg = registries.get(symbolsDict);
  if (reg) return reg;
  const kidToToken = new Map();

  /** 登记 token 取得 KID；处理极小概率碰撞（追加数字后缀）。 */
  function kidOf(token) {
    let k = toKid(token);
    const base = k;
    let n = 2;
    while (kidToToken.has(k) && kidToToken.get(k) !== token) k = `${base}-${n++}`;
    kidToToken.set(k, token);
    return k;
  }

  // 预登记全部字典 token，保证点击反查总能命中
  for (const tok of Object.keys(symbolsDict)) kidOf(tok);

  reg = {
    kidOf,
    resolve: (kid) => kidToToken.get(kid),
  };
  registries.set(symbolsDict, reg);
  return reg;
}

/* ==========================================================================
 * 2. markupSymbols：latex 源标记 + 区间调度（长 token 优先）
 * ========================================================================== */

function isLetter(ch) {
  if (!ch) return false;
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

/**
 * 把 latex 里属于 symbols 列表的 token 包裹成 \htmlClass{sym sym-KID}{TOKEN}。
 *
 * 算法（区间调度防重叠）：
 *   1) 仅处理字典 symbolsDict 内的 token（结构类 \frac \mathbf 不在）。
 *   2) 收集每个 token 在 latex 里的所有出现区间 [start,end)；
 *      排除「字母边界内」的匹配（防止单字母 token 吞掉 \frac/\partial 等命令名）。
 *   3) 按「长度降序优先、start 升序」贪心选择不重叠区间（长 token 优先占用）。
 *   4) 从后往前（start 降序）插入 \htmlClass 包裹，保持前段索引不变。
 *
 * @param {string} latex            公式 LaTeX 源（JS 已转义）
 * @param {string[]} symbols        该公式涉及的符号 token 数组
 * @param {Object} symbolsDict      符号定义字典（token→{name,desc,unit}）
 * @returns {string}                标记后的 LaTeX（可直接喂给 katex.renderToString）
 */
export function markupSymbols(latex, symbols, symbolsDict) {
  if (!latex) return latex;
  const toks = (symbols || []).filter((t) => Object.prototype.hasOwnProperty.call(symbolsDict, t));
  if (!toks.length) return latex;

  const { kidOf } = getRegistry(symbolsDict);

  // 1) 收集所有合法出现区间
  const intervals = [];
  for (const tok of toks) {
    const isCmd = tok.charCodeAt(0) === 92; // 以 '\' 开头的命令型 token
    let from = 0;
    while (from <= latex.length) {
      const idx = latex.indexOf(tok, from);
      if (idx === -1) break;
      const before = idx > 0 ? latex[idx - 1] : '';
      const after = idx + tok.length < latex.length ? latex[idx + tok.length] : '';
      let ok = true;
      if (isCmd) {
        // 命令型 token：仅查后界，避免匹配成更长命令名（如 \int 撞 \intop）的前缀；
        // 前界无需查——前导 '\' 已保证不会落在另一命令的字母中段。
        if (isLetter(after)) ok = false;
      } else {
        // 裸字母 token：前后任一为字母则跳过（避免吞掉 \frac/\partial 等命令名）
        if (isLetter(before) || isLetter(after)) ok = false;
      }
      if (ok) intervals.push({ start: idx, end: idx + tok.length, token: tok });
      from = idx + 1;
    }
  }
  if (!intervals.length) return latex;

  // 2) 贪心选择不重叠区间：长度降序，其次 start 升序
  intervals.sort((a, b) => {
    const la = a.end - a.start;
    const lb = b.end - b.start;
    if (lb !== la) return lb - la;
    return a.start - b.start;
  });
  const chosen = [];
  for (const iv of intervals) {
    let overlap = false;
    for (const c of chosen) {
      if (iv.start < c.end && c.start < iv.end) { overlap = true; break; }
    }
    if (!overlap) chosen.push(iv);
  }

  // 3) 从后往前插入包裹（保持前段索引不变）
  chosen.sort((a, b) => b.start - a.start);
  let out = latex;
  for (const iv of chosen) {
    const mid = out.slice(iv.start, iv.end); // === iv.token
    const k = kidOf(iv.token);
    // 若 token 紧跟在 _ 或 ^ 之后（裸下标/上标，如 F_x），KaTeX 不接受函数型命令作脚
    // 本，需额外套一层花括号：_{\htmlClass{...}{x}} 才合法。
    const prev = iv.start > 0 ? out[iv.start - 1] : '';
    const body = `\\htmlClass{sym sym-${k}}{${mid}}`;
    const wrapped = (prev === '_' || prev === '^') ? `{${body}}` : body;
    out = out.slice(0, iv.start) + wrapped + out.slice(iv.end);
  }
  return out;
}

/* ==========================================================================
 * 3. 通用工具
 * ========================================================================== */

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function renderKatex(latex, displayMode) {
  if (typeof window === 'undefined' || !window.katex) return '';
  return window.katex.renderToString(latex, {
    displayMode: !!displayMode,
    throwOnError: false,
    trust: true, // 必须：KaTeX 默认禁用 HTML 扩展命令 \htmlClass
    strict: false, // 关闭 htmlExtension 警告（trust 已允许 \htmlClass，此处仅去噪）
  });
}

/* ==========================================================================
 * 4. 符号弹窗工厂（每个视图一个独立实例）
 * ========================================================================== */

/**
 * 创建一个符号定义弹窗。
 * @param {Object} symbolsDict  符号字典（查 name/desc/unit）
 * @returns {{open:(token,anchor)=>void, close:()=>void}}
 */
export function createPopover(symbolsDict) {
  let popoverEl = null;
  let backdropEl = null;
  let symEl, nameEl, descEl, unitEl;

  function ensure() {
    if (popoverEl) return;
    backdropEl = document.createElement('div');
    backdropEl.className = 'fields-popover-backdrop';

    popoverEl = document.createElement('div');
    popoverEl.className = 'fields-popover';
    popoverEl.setAttribute('role', 'dialog');
    popoverEl.setAttribute('aria-label', '符号定义');
    popoverEl.innerHTML = `
      <button class="fields-popover__close" type="button" aria-label="关闭">✕</button>
      <div class="fields-popover__sym"></div>
      <div class="fields-popover__name"></div>
      <div class="fields-popover__desc"></div>
      <div class="fields-popover__unit"></div>`;

    document.body.appendChild(backdropEl);
    document.body.appendChild(popoverEl);

    symEl = popoverEl.querySelector('.fields-popover__sym');
    nameEl = popoverEl.querySelector('.fields-popover__name');
    descEl = popoverEl.querySelector('.fields-popover__desc');
    unitEl = popoverEl.querySelector('.fields-popover__unit');

    backdropEl.addEventListener('click', close);
    popoverEl.querySelector('.fields-popover__close').addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
    window.addEventListener('scroll', () => {
      if (popoverEl && popoverEl.classList.contains('is-open')) position(popoverEl._anchor);
    }, { passive: true });
    window.addEventListener('resize', () => {
      if (popoverEl && popoverEl.classList.contains('is-open')) position(popoverEl._anchor);
    });
  }

  function position(anchorEl) {
    if (!popoverEl || !anchorEl) return;
    const r = anchorEl.getBoundingClientRect();
    const pw = popoverEl.offsetWidth;
    const ph = popoverEl.offsetHeight;
    const gap = 10;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = r.left + r.width / 2 - pw / 2;
    let top = r.bottom + gap;
    if (top + ph > vh - 10) top = r.top - ph - gap; // 下方不够翻上方
    left = Math.max(10, Math.min(left, vw - pw - 10));
    top = Math.max(10, Math.min(top, vh - ph - 10));

    popoverEl.style.left = left + 'px';
    popoverEl.style.top = top + 'px';
  }

  function open(token, anchorEl) {
    ensure();
    const def = symbolsDict[token];
    if (!def) return;
    try {
      symEl.innerHTML = window.katex.renderToString(token, {
        displayMode: false, throwOnError: false, trust: true, strict: false,
      });
    } catch (e) {
      symEl.textContent = token;
    }
    nameEl.textContent = def.name;
    descEl.textContent = def.desc;
    unitEl.textContent = '单位：' + def.unit;

    popoverEl._anchor = anchorEl;
    popoverEl.classList.add('is-open');
    backdropEl.classList.add('is-open');
    requestAnimationFrame(() => position(anchorEl));
  }

  function close() {
    if (!popoverEl) return;
    popoverEl.classList.remove('is-open');
    backdropEl.classList.remove('is-open');
    popoverEl._anchor = null;
  }

  return { open, close };
}

/* ==========================================================================
 * 5. 渲染工厂：markup / renderFormula / renderSections / renderNav
 * ========================================================================== */

/**
 * 创建绑定到某数据集的渲染器。
 * @param {Object} symbolsDict  符号字典
 * @param {string} routeBase    分类导航锚点前缀，如 '#/fields'
 */
export function createFormulaRenderer(symbolsDict, routeBase) {
  function markup(f) {
    return markupSymbols(f.latex, f.symbols, symbolsDict);
  }

  function renderFormula(f) {
    let math = '';
    try {
      math = renderKatex(markup(f), true);
    } catch (e) {
      math = `<code>${esc(f.latex)}</code>`;
    }
    return `
      <article class="formula" id="f-${esc(f.id)}">
        <h4 class="formula__title">${esc(f.title)}</h4>
        <div class="formula__math">${math}</div>
        ${f.note ? `<p class="formula__note">${esc(f.note)}</p>` : ''}
      </article>`;
  }

  function renderSections(categories, formulas, filter) {
    const q = (filter || '').trim().toLowerCase();
    const parts = [];
    for (const c of categories) {
      const fs = [];
      for (const f of formulas) {
        if (f.cat !== c.id) continue;
        if (q) {
          const hay = (f.title + ' ' + (f.note || '')).toLowerCase();
          if (!hay.includes(q)) continue;
        }
        fs.push(f);
      }
      if (!fs.length) continue;
      parts.push(`
        <section class="fields-section" id="cat-${esc(c.id)}" data-cat="${esc(c.id)}">
          <header class="fields-section__head">
            <h3 class="fields-section__title">${esc(c.name)}</h3>
            <p class="fields-section__brief">${esc(c.brief)}</p>
          </header>
          ${fs.map(renderFormula).join('')}
        </section>`);
    }
    if (!parts.length) {
      return `<div class="state"><div class="state__title">没有匹配的公式</div>
        <div class="state__desc">试试其他关键词，或清空筛选。</div></div>`;
    }
    return parts.join('');
  }

  function renderNav(categories, formulas) {
    const countOf = (catId) => formulas.reduce((n, f) => n + (f.cat === catId ? 1 : 0), 0);
    return `
      <nav class="fields-nav" aria-label="公式分类导航">
        <div class="fields-nav__label">章节分类</div>
        ${categories.map((c) => `
          <a class="fields-nav__item" href="${routeBase}/${esc(c.id)}" data-cat="${esc(c.id)}">
            <span class="fields-nav__name">${esc(c.name)}</span>
            <span class="fields-nav__brief">${esc(c.brief)}</span>
            <span class="fields-nav__count">${countOf(c.id)}</span>
          </a>`).join('')}
      </nav>`;
  }

  return { markup, renderFormula, renderSections, renderNav };
}

/* ==========================================================================
 * 6. 整页挂载（工具栏 + 导航 + 公式区 + 筛选 + 滚动联动 + 点击委托）
 * ========================================================================== */

/**
 * 把整页渲染进 rootEl。
 * @param {Object}   opts
 * @param {HTMLElement} opts.rootEl      挂载容器（由调用方提供，复用 .fields-root）
 * @param {Array}    opts.categories     [{id,name,brief}]
 * @param {Array}    opts.formulas       [{id,cat,title,latex,symbols,note}]
 * @param {Object}   opts.symbols        符号字典 {token:{name,desc,unit}}
 * @param {string}   opts.title          工具栏主标题
 * @param {string}   opts.subtitle       工具栏副标题
 * @param {string}   opts.routeBase      分类锚点前缀 '#/fields'
 * @param {string}   opts.backHref       返回链接 href
 * @param {string}   [opts.catId]        初始定位分类
 * @param {{open:Function,close:Function}} opts popover 弹窗实例
 */
export function mountFormulaPage(opts) {
  const {
    rootEl, categories, formulas, symbols,
    title, subtitle, routeBase, backHref,
    catId, popover,
  } = opts;
  if (!rootEl) return;

  const renderer = createFormulaRenderer(symbols, routeBase);
  const { resolve } = getRegistry(symbols);

  rootEl.hidden = false;
  rootEl.innerHTML = `
    <div class="fields-toolbar">
      <div class="fields-toolbar__left">
        <a class="fields-back" href="${esc(backHref)}" title="返回考纲大纲">← 考纲</a>
        <div class="fields-toolbar__title">
          <span class="fields-toolbar__name">${esc(title)}</span>
          <span class="fields-toolbar__sub">${esc(subtitle)}</span>
        </div>
      </div>
      <div class="fields-toolbar__right">
        <div class="fields-search">
          <span class="fields-search__icon">⌕</span>
          <input class="fields-search__input fp-search"
                 type="text" placeholder="筛选公式标题或说明…"
                 autocomplete="off" spellcheck="false" aria-label="筛选公式">
        </div>
      </div>
    </div>
    <div class="fields-body">
      ${renderer.renderNav(categories, formulas)}
      <div class="fields-main">${renderer.renderSections(categories, formulas, '')}</div>
    </div>`;

  bindToolbar(rootEl);
  setActiveNav(rootEl, catId);
  setupScrollSpy(rootEl);
  bindSymbolClicks(rootEl, resolve, popover);

  // 初始滚动到路由指定的分类
  if (catId) {
    const el = rootEl.querySelector(`#cat-${CSS.escape(catId)}`);
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

/* ---- 整页内部交互（全部在 rootEl 范围内查询，避免双视图 ID 冲突）---- */

function applyFilter(rootEl, query) {
  const q = query.trim().toLowerCase();
  const sections = rootEl.querySelectorAll('.fields-section');
  sections.forEach((sec) => {
    let any = false;
    sec.querySelectorAll('.formula').forEach((f) => {
      const title = f.querySelector('.formula__title');
      const note = f.querySelector('.formula__note');
      const hay = (title ? title.textContent : '') + ' ' + (note ? note.textContent : '');
      const match = !q || hay.toLowerCase().includes(q);
      f.style.display = match ? '' : 'none';
      if (match) any = true;
    });
    sec.style.display = any ? '' : 'none';
  });
}

function bindToolbar(rootEl) {
  const input = rootEl.querySelector('.fp-search');
  if (!input) return;
  let raf = 0;
  input.addEventListener('input', (e) => {
    const v = e.target.value;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => applyFilter(rootEl, v));
  });
}

function setActiveNav(rootEl, catId) {
  rootEl.querySelectorAll('.fields-nav__item').forEach((a) => {
    a.classList.toggle('is-active', a.getAttribute('data-cat') === catId);
  });
}

function setupScrollSpy(rootEl) {
  const items = rootEl.querySelectorAll('.fields-nav__item');
  const sections = rootEl.querySelectorAll('.fields-section');
  if (!items.length || !('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entries) => {
    let best = null;
    entries.forEach((en) => {
      if (en.isIntersecting) {
        if (!best || en.boundingClientRect.top < best.boundingClientRect.top) best = en;
      }
    });
    if (best) {
      const cat = best.target.getAttribute('data-cat');
      items.forEach((a) => a.classList.toggle('is-active', a.getAttribute('data-cat') === cat));
    }
  }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });

  sections.forEach((s) => obs.observe(s));
}

/** 在持久容器上做符号点击委托（仅绑一次）。 */
function bindSymbolClicks(rootEl, resolve, popover) {
  if (rootEl.dataset.fpBound === '1') return;
  rootEl.dataset.fpBound = '1';
  rootEl.addEventListener('click', (e) => {
    const sym = e.target.closest('.sym');
    if (!sym) return;
    e.preventDefault();
    e.stopPropagation();
    const cls = sym.getAttribute('class') || '';
    const m = cls.match(/sym-([A-Za-z0-9_-]+)/);
    if (!m) return;
    const token = resolve(m[1]);
    if (token) popover.open(token, sym);
  });
}
