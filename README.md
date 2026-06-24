# 电子技术基础考纲 · 离线备考工具

数电 + 模电**考试大纲**与**公式手册**的纯前端、零构建、完全离线浏览工具。
- 大纲：本地 markdown 经 `marked.js` 渲染成可读页面（数电 9 章 + 模电 10 章）
- 公式手册：电磁场与电磁波（111 式）+ 模拟电子技术（86 式），`KaTeX` 渲染，**公式里每个符号可点击弹窗显示定义**

仓库根目录即 Web 根目录，可直接部署到 GitHub Pages。

---

## 目录结构

```
电子技术基础考纲/
├── index.html                ← 单入口
├── .nojekyll                 ← 禁用 GitHub Pages 的 Jekyll，确保 .md 被 fetch 而非转换
├── css/                      ← 按职责拆分的样式
│   ├── variables.css         ← 设计令牌：亮/暗主题 + 数电灰蓝/模电暖灰/电磁场紫灰
│   ├── base.css  layout.css  components.css  markdown.css  fields.css
├── js/
│   ├── main.js               ← 入口编排
│   ├── config.js             ← 大纲数据（科目/章节/题量）单一数据源
│   ├── router.js  sidebar.js  content.js  search.js  theme.js  progress.js
│   ├── formula-core.js       ← 公式页共享核心（markupSymbols 区间调度 + 弹窗 + 渲染）
│   ├── formula-view.js       ← createFormulaView 工厂（数据驱动的可注册公式视图）
│   ├── formula-views.js      ← 公式视图注册点（电磁场 + 模电）
│   ├── fields-data.js        ← 电磁场公式数据（111 式 / 95 符号）
│   └── modian-formulas-data.js ← 模电公式数据（86 式 / 102 符号）
├── vendor/                   ← 本地依赖（离线）
│   ├── marked.min.js         ← markdown 渲染
│   └── katex/                ← LaTeX 渲染（katex.min.js + auto-render + 60 字体）
└── 大纲/                      ← 原始 markdown（数电 9 + 模电 10）
```

---

## 本地启动

> 浏览器安全策略要求 `fetch` 本地 `.md` 必须走 http 协议——直接双击 `index.html`（`file://`）会被 CORS 拦截。请用任意静态服务器：

```bash
cd 电子技术基础考纲          # 进入仓库根目录（本 README 所在目录）
python3 -m http.server 8000
```

浏览器打开 <http://localhost:8000/> 即可。

---

## 部署到 GitHub Pages

仓库根即 Web 根，部署零配置：

1. 把本仓库 push 到 GitHub。
2. 仓库 **Settings → Pages → Source** 选 `Deploy from a branch`，分支选 `main`、目录选 `/(root)`。
3. 保存后等 1~2 分钟，访问 `https://<用户名>.github.io/<仓库名>/`。

`.nojekyll` 已确保 GitHub Pages 不用 Jekyll 处理——`大纲/*.md` 会作为纯文本被 `fetch` 到，不会被转换成 HTML 导致 404。

---

## 功能

| 功能 | 说明 |
|------|------|
| **大纲浏览** | 侧边栏「数电 / 模电」Tab + 章节树（题量徽标 + 重要度星标）；`marked.js` 渲染，表格/代码/引用美化 |
| **公式手册** | 顶栏「📐 电磁场公式」「📐 模电公式」入口；按章节分类的公式卡片，`KaTeX` 渲染 |
| **符号点击弹窗** | 公式里每个符号可点击 → 弹窗显示名称/释义/单位（符号本身行内 KaTeX 渲染） |
| **全文搜索** | 顶部搜索框（按 `/` 聚焦）；惰性建内存索引，命中高亮、按科目分组 |
| **复习进度** | 每章可标记已复习；localStorage 记忆；侧边栏打勾 + 进度条 |
| **主题** | 亮/暗双模式，localStorage 记忆，跟随系统 `prefers-color-scheme` |
| **响应式** | 桌面侧边栏常驻；移动端抽屉化 |

---

## 技术栈与架构

- 纯原生 **HTML + CSS + ES Modules**（`<script type="module">`），**零构建**（无 Vite/Webpack/React/Vue），**零联网**（marked + KaTeX 均在 `vendor/`）。
- **视图注册架构**：公式页由 `createFormulaView(config)` 工厂生成，统一注册到 `formula-views.js`，`main.js` 路由遍历注册表派发。**新增一个公式科目只需「数据文件 + 一行注册」**，`main.js` / `index.html` 零改动（入口按钮与容器由工厂动态注入）。
- 符号可点击：公式 LaTeX 经 `markupSymbols` 区间调度算法把符号 token 包裹成 `\htmlClass{sym sym-KID}{...}`，`KaTeX` 以 `trust:true, strict:false` 渲染，点击 `.sym` 反查定义弹窗。

---

## 维护

- **新增大纲章节**：`js/config.js` 对应科目 `chapters` 追加一项，md 放进 `大纲/`。
- **新增公式科目**（如数电公式）：新建 `js/xxx-formulas-data.js`（导出 `XXX_CATEGORIES/FORMULAS/SYMBOLS`），在 `js/formula-views.js` 加一行 `createFormulaView({ id, routeBase, data, subject, ... })`。
- LaTeX 字符串里所有反斜杠必须双写（`\\frac` 等），否则 `\f` 会被 JS 解析成换页符损坏公式。
- 清空复习进度：浏览器控制台 `localStorage.removeItem('ezt-reviewed')` 后刷新。
