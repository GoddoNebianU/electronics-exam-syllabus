/* ==========================================================================
 * assets.ts — base-path 感知的资源 URL 工具
 *
 * GitHub Pages 部署在 /electronics-exam-syllabus/ 子路径，vite.config.ts 已设
 * base。public/ 下的 md 文件须拼上 import.meta.env.BASE_URL 才能正确 fetch。
 * 开发环境 BASE_URL 默认 '/'，生产为 '/electronics-exam-syllabus/'。
 * ========================================================================== */

/** 取 base 路径，保证以 '/' 结尾 */
function base(): string {
  const b = import.meta.env.BASE_URL || '/';
  return b.endsWith('/') ? b : `${b}/`;
}

/**
 * 把相对资源路径（如 "大纲/数电/01-...md"）转为完整 URL。
 * 兼容开发（/）与生产（/electronics-exam-syllabus/）。
 */
export function assetUrl(relPath: string): string {
  const clean = relPath.replace(/^\/+/, '');
  return `${base()}${clean}`;
}
