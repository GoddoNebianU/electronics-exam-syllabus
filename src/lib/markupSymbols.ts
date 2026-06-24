/* ==========================================================================
 * markupSymbols.ts — 公式 LaTeX 源标记（区间调度，长 token 优先，\htmlClass 包裹）
 * 迁移自 legacy/js/formula-core.js，TS 化，行为完全不变。
 *
 * 把 latex 里属于 symbols 列表的 token 包裹成 \htmlClass{sym sym-KID}{TOKEN}，
 * 渲染后可点击触发符号定义弹窗。
 * ========================================================================== */
import type { SymbolDict } from '../data/types';

/** 把 LaTeX token 转成 CSS class 安全 id（KID）。
 *  反斜杠→连字符；{} ^ 等结构字符丢弃；其余非 [A-Za-z0-9_-]→连字符；
 *  合并多余连字符；去除首尾连字符。
 *  '\nabla\times'→'nabla-times'  'E'→'E'
 *  '\varepsilon_0'→'varepsilon_0'  '\mathbf{S}'→'mathbfS'  'I_{CEO}'→'I_CEO'
 */
export function toKid(token: string): string {
  return token
    .replace(/\\/g, '-')
    .replace(/[{}\^]/g, '')
    .replace(/[^A-Za-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** 注册表：kid → token（点击反查）。按 symbolsDict 缓存，保证每数据集独立。 */
interface Registry {
  /** 登记 token 取得 KID（处理碰撞：追加数字后缀） */
  kidOf: (token: string) => string;
  /** KID → token 反查 */
  resolve: (kid: string) => string | undefined;
}

const registries = new WeakMap<SymbolDict, Registry>();

/** 取/建某数据集的 KID 注册表。 */
export function getRegistry(symbolsDict: SymbolDict): Registry {
  const cached = registries.get(symbolsDict);
  if (cached) return cached;

  const kidToToken = new Map<string, string>();

  function kidOf(token: string): string {
    let k = toKid(token);
    const base = k;
    let n = 2;
    while (kidToToken.has(k) && kidToToken.get(k) !== token) k = `${base}-${n++}`;
    kidToToken.set(k, token);
    return k;
  }

  // 预登记全部字典 token，保证点击反查总能命中
  for (const tok of Object.keys(symbolsDict)) kidOf(tok);

  const reg: Registry = {
    kidOf,
    resolve: (kid: string) => kidToToken.get(kid),
  };
  registries.set(symbolsDict, reg);
  return reg;
}

function isLetter(ch: string | undefined): boolean {
  if (!ch) return false;
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

interface Interval {
  start: number;
  end: number;
  token: string;
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
 * @param latex            公式 LaTeX 源（JS 已转义）
 * @param symbols         该公式涉及的符号 token 数组
 * @param symbolsDict     符号定义字典（token→{name,desc,unit}）
 * @returns               标记后的 LaTeX（可直接喂给 katex.renderToString）
 */
export function markupSymbols(
  latex: string,
  symbols: string[] | undefined,
  symbolsDict: SymbolDict,
): string {
  if (!latex) return latex;
  const toks = (symbols ?? []).filter((t) =>
    Object.prototype.hasOwnProperty.call(symbolsDict, t),
  );
  if (!toks.length) return latex;

  const { kidOf } = getRegistry(symbolsDict);

  // 1) 收集所有合法出现区间
  const intervals: Interval[] = [];
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
  const chosen: Interval[] = [];
  for (const iv of intervals) {
    let overlap = false;
    for (const c of chosen) {
      if (iv.start < c.end && c.start < iv.end) {
        overlap = true;
        break;
      }
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
    const wrapped = prev === '_' || prev === '^' ? `{${body}}` : body;
    out = out.slice(0, iv.start) + wrapped + out.slice(iv.end);
  }
  return out;
}
