/* ==========================================================================
 * SearchBox.tsx — 全文搜索
 * 首次搜索惰性 fetch 全部 md 建索引；输入防抖；结果按科目分组；
 * 命中片段高亮；点击跳转。迁移自 legacy/js/search.js。
 * ========================================================================== */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SYLLABUS, flattenChapters } from '../data/syllabus';
import type { Chapter, Subject } from '../data/types';
import { assetUrl } from '../lib/assets';

interface IndexEntry {
  subject: Subject;
  chapter: Chapter;
  plain: string;
}

interface Hit extends IndexEntry {
  inTitle: boolean;
  snippet: string;
}

let indexCache: IndexEntry[] | null = null;
let building: Promise<IndexEntry[]> | null = null;

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^[#>\-*|+\s]+/gm, '')
    .replace(/[*_~]/g, '')
    .replace(/\n{2,}/g, '\n');
}

async function buildIndex(): Promise<IndexEntry[]> {
  if (indexCache) return indexCache;
  if (building) return building;
  building = (async () => {
    const items = flattenChapters();
    const entries = await Promise.all(
      items.map(async ({ subject, chapter }) => {
        let text = '';
        try {
          const res = await fetch(assetUrl(chapter.file));
          if (res.ok) text = await res.text();
        } catch {
          /* 单章失败不阻塞其余 */
        }
        return { subject, chapter, plain: stripMarkdown(text) };
      }),
    );
    indexCache = entries;
    building = null;
    return entries;
  })();
  return building;
}

function regEscape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function snippet(plain: string, query: string, len = 60): string {
  const lower = plain.toLowerCase();
  const at = lower.indexOf(query.toLowerCase());
  if (at < 0) return '';
  const start = Math.max(0, at - len);
  const end = Math.min(plain.length, at + query.length + len);
  let s = plain.slice(start, end).replace(/\n/g, ' ').trim();
  if (start > 0) s = '…' + s;
  if (end < plain.length) s = s + '…';
  return s;
}

function escapeHtml(s: string): string {
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

export function SearchBox() {
  const [value, setValue] = useState('');
  const [building, setBuilding] = useState(false);
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const runSearch = useCallback(async (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query) {
      setHits(null);
      setOpen(false);
      return;
    }
    setBuilding(true);
    setOpen(true);
    const idx = await buildIndex();
    setBuilding(false);
    const q = query.toLowerCase();
    const found: Hit[] = [];
    for (const entry of idx) {
      const inTitle = entry.chapter.title.toLowerCase().includes(q);
      const at = entry.plain.toLowerCase().indexOf(q);
      if (inTitle || at >= 0) {
        found.push({ ...entry, inTitle, snippet: snippet(entry.plain, query) });
      }
    }
    setHits(found);
  }, []);

  const onChange = (v: string) => {
    setValue(v);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!v) {
      setHits(null);
      setOpen(false);
      return;
    }
    debounceRef.current = window.setTimeout(() => runSearch(v), 200);
  };

  // 点击外部关闭 + 快捷键
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const go = (subjectId: string, chapterId: string) => {
    navigate(`/${subjectId}/${chapterId}`);
    setOpen(false);
    setValue('');
    setHits(null);
  };

  return (
    <div className={`search ${value ? 'is-active' : ''}`} ref={boxRef}>
      <span className="search__icon">⌕</span>
      <input
        ref={inputRef}
        className="search__input"
        type="text"
        placeholder="搜索章节或知识点…（按 / 聚焦）"
        autoComplete="off"
        spellCheck={false}
        aria-label="全文搜索"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (value.trim()) runSearch(value);
        }}
      />
      {value && (
        <button
          type="button"
          className="search__clear"
          aria-label="清除搜索"
          onClick={() => {
            setValue('');
            setHits(null);
            setOpen(false);
            inputRef.current?.focus();
          }}
        >
          ✕
        </button>
      )}
      {open && (
        <div className="search__results is-open" role="listbox">
          {building && (
            <div className="search__empty">正在建立索引…</div>
          )}
          {!building && hits && hits.length === 0 && (
            <div className="search__empty">
              未找到包含「{escapeHtml(value.trim())}」的章节
            </div>
          )}
          {!building &&
            hits &&
            hits.length > 0 &&
            SYLLABUS.map((subj) => {
              const group = hits.filter((h) => h.subject.id === subj.id);
              if (!group.length) return null;
              return (
                <div key={subj.id}>
                  <div className="search__group-label">
                    {subj.name}（{group.length}）
                  </div>
                  {group.map((h) => (
                    <a
                      key={`${h.subject.id}-${h.chapter.id}`}
                      className="search__item"
                      href={`#/${h.subject.id}/${h.chapter.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(h.subject.id, h.chapter.id);
                      }}
                    >
                      <div
                        className="search__item-title"
                        dangerouslySetInnerHTML={{
                          __html: highlightHtml(h.chapter.title, value.trim()),
                        }}
                      />
                      {h.snippet && (
                        <div
                          className="search__item-preview"
                          dangerouslySetInnerHTML={{
                            __html: highlightHtml(h.snippet, value.trim()),
                          }}
                        />
                      )}
                    </a>
                  ))}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
