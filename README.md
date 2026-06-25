# 电子技术基础考纲 · 备考工具

数电 + 模电**考试大纲**与**公式手册**，React + Vite + TypeScript 构建，PWA 离线可用。

🔗 **在线访问**：<https://goddonebianu.github.io/electronics-exam-syllabus/>

---

## 功能

| 功能 | 说明 |
|------|------|
| **大纲浏览** | 数电 9 章 + 模电 10 章，markdown 渲染（表格/代码/引用美化），题型徽标 |
| **重要度评级** | 从题型分布**动态计算**（公式：题数×权重→星级），非手写 |
| **公式手册** | 电磁场 111 式 + 模电 86 式，KaTeX 渲染，按章节分类 |
| **公式推导** | 101 个推导性公式附分步推导（折叠展开，每步 KaTeX 渲染） |
| **符号点击弹窗** | 公式/推导里每个符号可点击 → 弹窗显示名称/释义/单位 |
| **公式搜索** | 按标题/说明/符号名释义模糊搜索，命中高亮 |
| **收藏夹** | 收藏公式（跨科目「★ 收藏」筛选）+ 收藏章节快捷访问 |
| **复习统计** | SVG 环形/条形图，各科目完成率 + 最近复习时间线 |
| **全文搜索** | 惰性建内存索引，命中高亮、按科目分组 |
| **复习进度** | 每章标记已复习，localStorage 持久化 |
| **亮/暗主题** | localStorage 记忆，跟随系统 `prefers-color-scheme` |
| **PWA** | 可安装到手机桌面，Service Worker 缓存全部资源离线运行 |
| **响应式** | 桌面侧边栏常驻，移动端抽屉化 |

---

## 技术栈

- **React 18** + **Vite 5** + **TypeScript**
- **Tailwind CSS v3**（素雅配色，CSS 变量 + Tailwind config）
- **Zustand**（主题/进度/收藏/路由 状态管理）
- **React Router v6** HashRouter（GitHub Pages 子路径友好）
- **KaTeX**（LaTeX 渲染）+ **marked**（markdown 渲染）
- **vite-plugin-pwa**（Service Worker + manifest，离线缓存）
- **pnpm**（包管理）

---

## 项目结构

```
电子技术基础考纲/
├── index.html                 ← Vite 入口
├── .nojekyll                  ← 禁用 GitHub Pages Jekyll
├── package.json               ← pnpm 管理
├── vite.config.ts             ← base=/electronics-exam-syllabus/ + PWA
├── tailwind.config.js
├── .github/workflows/deploy.yml  ← pnpm build → GitHub Pages 自动部署
├── src/
│   ├── main.tsx  App.tsx  routes.tsx  index.css
│   ├── components/             ← Header Sidebar ChapterList FormulaCard
│   │                             FormulaNav FormulaSections MarkdownView
│   │                             DerivationSteps SymbolPopover SearchBox
│   │                             StatsPanel StatsDonut StatsBar ...
│   ├── pages/                  ← OutlinePage FormulaPage
│   ├── store/                  ← useThemeStore useProgressStore
│   │                             useFavoriteStore useSyllabusStore
│   ├── lib/                    ← markupSymbols protect-math render katex assets
│   ├── data/                   ← syllabus fields(+推导) modian-formulas(+推导)
│   │                             formula-registry types
│   └── styles/                 ← tokens base layout components markdown
│                                 formula-page derivation stats search ...
├── public/
│   ├── 大纲/                   ← 19 份 markdown（数电 9 + 模电 10）
│   └── pwa-*.png               ← PWA 图标
└── legacy/                     ← 旧原生前端（归档参考）
```

---

## 本地开发

```bash
pnpm install
pnpm dev          # http://localhost:5173/electronics-exam-syllabus/
```

## 构建

```bash
pnpm build       # tsc --noEmit + vite build → dist/
pnpm preview     # 本地预览构建产物
```

## 部署

push 到 `main` → GitHub Actions 自动 `pnpm build` → 部署 `dist/` 到 GitHub Pages。

---

## 维护说明

- **新增大纲章节**：`src/data/syllabus.ts` 的 RAW 数组追加一项（topics 含题型/题数），importance 自动计算。
- **新增公式科目**：新建 `src/data/xxx-formulas` 数据（categories + formulas + symbols），在 `src/data/formula-registry.ts` 加一行注册。
- **importance 评级**：从 topics 动态计算（`calcImportance`），公式：`Σ(题数 × 权重) / 45 × 4 + 1`，权重：判断1/填空1.5/简答4/计算4/综合7/设计9。
- **LaTeX 转义**：数据里反斜杠双写（`\\frac`），否则 `\f` 被 JS 解析成换页符。
- **推导 text**：数学段用 `$...$` 标记，前端 `renderTextWithMath` 自动 KaTeX 渲染。
