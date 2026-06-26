/* ==========================================================================
 * chapters.ts — 章节正文 markdown 访问层
 *
 * 章节正文从 public/ 运行时 fetch 改为构建期内联（import.meta.glob ?raw）：
 * dev/build 一致、无重复副本、离线可用。chapter.file 形如
 * 'content/chapters/shudian/01-数字逻辑概论.md'（见 content/syllabus.json）。
 * ========================================================================== */

/** 所有章节正文（构建期内联为字符串）。key 形如 '/content/chapters/.../*.md' */
const CHAPTER_MD = import.meta.glob('/content/chapters/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** 按 chapter.file 取正文；找不到返回 null。 */
export function getChapterMarkdown(file: string): string | null {
  // glob key 带前导斜杠（项目根相对），chapter.file 不带 —— 兼容两种写法
  return CHAPTER_MD['/' + file] ?? CHAPTER_MD[file] ?? null;
}
