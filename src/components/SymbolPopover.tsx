/* ==========================================================================
 * SymbolPopover.tsx — 符号定义弹窗
 * 点击公式中的符号 → 弹窗显示符号（行内 KaTeX）+ name/desc/unit。
 * 迁移自 legacy/js/formula-core.js 的 createPopover。
 *
 * 受控组件：父级传入 anchor（被点击的 .sym 元素）+ token + 字典；null 则关闭。
 * ========================================================================== */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { SymbolDef } from '../data/types';
import { renderInline } from '../lib/katex';

interface SymbolPopoverProps {
  def: SymbolDef | null;
  token: string | null;
  anchor: HTMLElement | null;
  onClose: () => void;
}

export function SymbolPopover({
  def,
  token,
  anchor,
  onClose,
}: SymbolPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  // 定位：锚点下方居中，空间不足翻上方
  const position = () => {
    if (!popoverRef.current || !anchor) return;
    const r = anchor.getBoundingClientRect();
    const pw = popoverRef.current.offsetWidth;
    const ph = popoverRef.current.offsetHeight;
    const gap = 10;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = r.left + r.width / 2 - pw / 2;
    let top = r.bottom + gap;
    if (top + ph > vh - 10) top = r.top - ph - gap; // 下方不够翻上方
    left = Math.max(10, Math.min(left, vw - pw - 10));
    top = Math.max(10, Math.min(top, vh - ph - 10));
    setPos({ left, top });
  };

  useLayoutEffect(() => {
    if (def) {
      requestAnimationFrame(position);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def, anchor]);

  // 滚动 / 缩放 / ESC 时重定位或关闭
  useEffect(() => {
    if (!def) return;
    const onScroll = () => position();
    const onResize = () => position();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def, anchor, onClose]);

  if (!def || !token) return null;

  const symHtml = renderInline(token);

  return (
    <>
      <div
        className={`fields-popover-backdrop ${def ? 'is-open' : ''}`}
        onClick={onClose}
      />
      <div
        ref={popoverRef}
        className={`fields-popover ${def ? 'is-open' : ''}`}
        role="dialog"
        aria-label="符号定义"
        style={pos ?? { left: -9999, top: -9999 }}
      >
        <button
          type="button"
          className="fields-popover__close"
          aria-label="关闭"
          onClick={onClose}
        >
          ✕
        </button>
        <div
          className="fields-popover__sym"
          dangerouslySetInnerHTML={{ __html: symHtml }}
        />
        <div className="fields-popover__name">{def.name}</div>
        <div className="fields-popover__desc">{def.desc}</div>
        <div className="fields-popover__unit">单位：{def.unit}</div>
      </div>
    </>
  );
}
