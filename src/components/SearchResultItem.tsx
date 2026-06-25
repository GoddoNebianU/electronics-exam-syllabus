/* ==========================================================================
 * SearchResultItem.tsx — 搜索结果单条项
 * 从 SearchBox 抽出：标题/片段高亮 + 点击跳转。
 * ========================================================================== */
import { memo } from 'react';

function regEscape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function escapeHtml(s: string): string {
  return String(s).replace(
    /[&<>]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string,
  );
}

function highlightHtml(text: string, query: string): string {
  if (!text) return '';
  const re = new RegExp(`(${regEscape(query)})`, 'gi');
  return text
    .replace(re, '\u0000$1\u0001')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\u0000/g, '<mark>')
    .replace(/\u0001/g, '</mark>');
}

interface SearchResultItemProps {
  title: string;
  snippet: string;
  query: string;
  href: string;
  onSelect: () => void;
}

/** 搜索结果单条（标题 + 片段高亮），用 memo 避免列表重渲染 */
export const SearchResultItem = memo(function SearchResultItem({
  title,
  snippet,
  query,
  href,
  onSelect,
}: SearchResultItemProps) {
  return (
    <a
      className="search__item"
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onSelect();
      }}
    >
      <div
        className="search__item-title"
        dangerouslySetInnerHTML={{
          __html: highlightHtml(title, query),
        }}
      />
      {snippet && (
        <div
          className="search__item-preview"
          dangerouslySetInnerHTML={{
            __html: highlightHtml(snippet, query),
          }}
        />
      )}
    </a>
  );
});
