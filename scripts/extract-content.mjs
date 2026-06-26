/* ==========================================================================
 * extract-content.mjs — 一次性提取脚本
 *
 * 把 src/data/ 里的知识数据（公式/符号/分类/大纲）经 esbuild 打包后导出为
 * content/ 下的 JSON 文件。纯数据搬运，零手写、零转义风险。
 *
 * 用法： node scripts/extract-content.mjs
 * ========================================================================== */
import { createRequire } from 'node:module';
// pnpm 严格模式下 esbuild 是 vite 的间接依赖，ESM 裸导入解析不到；用 createRequire 走 CJS 解析（已验证可用）。
const esbuild = createRequire(import.meta.url)('esbuild');
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TMP = path.join(ROOT, '.tmp-extract');

/** 把 src/data/<relFile> 这个 TS 数据模块打包成 ESM，在 Node 里 import 拿到导出。 */
async function bundleImport(relFile) {
  const result = await esbuild.build({
    entryPoints: [path.join(ROOT, 'src/data', relFile)],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'es2022',
    write: false,
  });
  const code = result.outputFiles[0].text;
  await mkdir(TMP, { recursive: true });
  const tmpFile = path.join(TMP, relFile.replace(/[\\/]/g, '_') + '.mjs');
  writeFileSync(tmpFile, code);
  return import('file://' + tmpFile);
}

/** 按 cat 把公式分组；未匹配任何分类的视为孤儿并告警。 */
function groupByCat(formulas, categories, label) {
  const byId = new Map(categories.map((c) => [c.id, []]));
  const orphans = [];
  for (const f of formulas) {
    if (byId.has(f.cat)) byId.get(f.cat).push(f);
    else orphans.push(f);
  }
  if (orphans.length) {
    console.warn(`[${label}] 警告：${orphans.length} 条公式的 cat 未命中分类：`,
      [...new Set(orphans.map((f) => f.cat))]);
  }
  return byId;
}

async function writeJson(relPath, obj) {
  const abs = path.join(ROOT, relPath);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  console.log('  wrote', relPath, `(${Array.isArray(obj) ? obj.length + ' 条' : Object.keys(obj).length + ' 键'})`);
}

console.log('打包并导入 TS 数据模块…');
const fields = await bundleImport('fields.ts');
const modian = await bundleImport('modian-formulas.ts');
const syll = await bundleImport('syllabus.ts');

console.log(`\n数量核对：fields 公式 ${fields.FIELDS_FORMULAS.length} 式 / modian 公式 ${modian.MODIAN_FORMULAS.length} 式`);

// ---- 电磁场 ----
console.log('\n写出 content/fields/ …');
await writeJson('content/fields/categories.json', fields.FIELDS_CATEGORIES);
await writeJson('content/fields/symbols.json', fields.FIELDS_SYMBOLS);
const fGroups = groupByCat(fields.FIELDS_FORMULAS, fields.FIELDS_CATEGORIES, 'fields');
for (const cat of fields.FIELDS_CATEGORIES) {
  await writeJson(`content/fields/formulas/${cat.id}.json`, fGroups.get(cat.id));
}

// ---- 模电 ----
console.log('\n写出 content/modian/ …');
await writeJson('content/modian/categories.json', modian.MODIAN_CATEGORIES);
await writeJson('content/modian/symbols.json', modian.MODIAN_SYMBOLS);
const mGroups = groupByCat(modian.MODIAN_FORMULAS, modian.MODIAN_CATEGORIES, 'modian');
for (const cat of modian.MODIAN_CATEGORIES) {
  await writeJson(`content/modian/formulas/${cat.id}.json`, mGroups.get(cat.id));
}

// ---- 大纲元数据（RAW 形态，剥离计算字段 importance/importanceReason）----
console.log('\n写出 content/syllabus.json …');
const rawSyllabus = syll.SYLLABUS.map((s) => ({
  id: s.id,
  name: s.name,
  short: s.short,
  dir: s.dir,
  chapters: s.chapters.map((c) => ({
    id: c.id,
    title: c.title,
    file: c.file,
    topics: c.topics,
  })),
}));
await writeJson('content/syllabus.json', rawSyllabus);

await rm(TMP, { recursive: true, force: true });
console.log('\n提取完成。');
