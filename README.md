# 电子技术基础考纲 · 离线备考工具

数字电子技术（数电）+ 模拟电子技术（模电）考试大纲的**纯前端、零构建、完全离线**浏览工具。
本地 markdown 大纲经 `marked.js` 渲染成排版精美的可读页面，配双科目主题色、全文搜索、复习进度跟踪。

---

## 目录结构

```
电子技术基础考纲/
├── 大纲/                         ← 原始 markdown（勿改）
│   ├── 数电/  (9 章, 01..09)
│   └── 模电/  (10 章, 01..10)
├── README.md                     ← 本文件
└── 网站/                         ← 前端项目根（在此起 http server）
    ├── index.html                ← 单入口
    ├── css/
    │   ├── variables.css         ← 设计令牌：亮/暗主题 + 数电蓝/模电橙
    │   ├── base.css              ← reset + 基础排版
    │   ├── layout.css            ← 顶栏/侧边栏/主区骨架 + 响应式
    │   ├── components.css        ← 按钮/徽标/章节项/搜索框/进度条/Tab
    │   └── markdown.css          ← 渲染出的 md 样式（标题/表格/代码/引用）
    ├── js/
    │   ├── main.js               ← 入口编排（初始化 + 模块互连）
    │   ├── config.js             ← 大纲数据（科目/章节/题量/重要度）单一数据源
    │   ├── router.js             ← hash 路由（#/shudian/01）
    │   ├── sidebar.js            ← 侧边栏：科目 Tab + 章节树 + 进度
    │   ├── content.js            ← fetch md + marked 渲染 + 面包屑
    │   ├── search.js             ← 全文搜索（惰性建内存索引）
    │   ├── theme.js              ← 亮/暗主题切换 + localStorage
    │   └── progress.js           ← 复习进度标记 + localStorage
    └── vendor/
        └── marked.min.js         ← marked v12（全局 window.marked，勿改）
```

> 每个 JS 文件单一职责，用 ES Module `export`/`import` 互连；`main.js` 仅做编排。
> CSS 按职责拆分，`index.html` 用多个 `<link>` 并行引入（无 `@import`）。

---

## 如何启动（重要）

> **必须在项目根目录起服务器**（不是 `网站/` 目录）。
> 因为大纲 `大纲/` 是 `网站/` 的**同级目录**，`fetch('../大纲/...')` 在浏览器里会被
> 规范化成 `GET /大纲/...`。只有把项目根作为服务器根目录，`大纲/` 才能被访问到；
> 若在 `网站/` 下起服务器，`大纲/` 在其之外会被 404。

由于浏览器安全策略，**`fetch` 本地 `.md` 必须走 http 协议**——直接双击 `index.html`
（`file://` 协议）会被 CORS 拦截，导致章节无法加载。请用任意静态服务器：

**推荐：Python 内置 http server（在项目根目录执行）**

```bash
cd 电子技术基础考纲          # 进入项目根目录（本 README 所在目录）
python3 -m http.server 8000
```

然后浏览器打开 <http://localhost:8000/网站/> （注意末尾带 `网站/`）。

> 环境要求：Python 3（系统自带即可，无需安装任何依赖）。
> 按 `Ctrl+C` 关闭服务器。

> 为什么不在 `网站/` 下起服务器？
> `http.server` 的服务根固定在其启动目录，无法返回上级目录的文件。本项目的大纲
> markdown 与 `网站/` 平级，故必须以项目根为服务根。URL 路径对应关系：
> - 页面：`/网站/index.html`
> - 资源：`/网站/css/*`、`/网站/js/*`、`/网站/vendor/*`
> - 大纲：`fetch('../大纲/数电/01.md')` → 浏览器规范化为 `GET /大纲/数电/01.md` ✓

---

## 功能列表

| 功能 | 说明 |
|------|------|
| **侧边栏导航** | 顶部「数电 / 模电」Tab 切换；章节项含题量徽标 + 重要度星标；点击加载对应大纲 |
| **内容渲染** | 本地 `marked.js` 渲染 markdown，表格/代码块/引用块/标题层级全部美化；表格自动横向滚动 |
| **hash 路由** | `#/shudian/01`、`#/modian/10`；刷新可定位、可分享；首屏默认数电第 1 章 |
| **全文搜索** | 顶部搜索框（按 `/` 快捷聚焦）；首次搜索惰性 fetch 全部 md 建内存索引；命中片段高亮、按科目分组、点击跳转 |
| **主题切换** | 亮/暗双模式，右上角按钮切换；localStorage 记忆偏好；无记忆时跟随系统 `prefers-color-scheme` |
| **复习进度** | 每章「标记已复习」按钮；localStorage 记录；侧边栏章节打勾 + 顶部进度条「已复习 X/19」 |
| **响应式** | 桌面侧边栏常驻；移动端侧边栏抽屉化（汉堡按钮 + 遮罩 + ESC 关闭） |
| **双主题色** | 数电 = 蓝/青冷色系，模电 = 橙/红暖色系；切换科目 Tab 时主色调（按钮/进度条/标题装饰）跟随变化 |

---

## 主题色方案

| 科目 | 主色 | 辅色 | 用途 |
|------|------|------|------|
| 数电 shudian | `#2563eb` 蓝 | `#0891b2` 青 | 渐变用于 logo / Tab 激活态 / 进度条 / 章节高亮 |
| 模电 modian | `#ea580c` 橙 | `#dc2626` 红 | 同上 |

- 亮色/暗色模式各自有独立的色值（暗色下提亮以保证对比度）。
- 题型徽标用与科目解耦的语义色：判断=紫、填空=青绿、简答=琥珀、综合=玫红、计算=靛、设计=青蓝。
- 所有颜色、间距、圆角、字号均为 CSS 变量，集中在 `css/variables.css`。

---

## 技术栈

- 纯原生 **HTML + CSS + ES Modules**（`<script type="module">`）。
- **零构建**：无 Vite / Webpack / React / Vue。
- **零联网**：markdown 渲染器 `marked.js` 已下载至 `vendor/`，全局暴露 `window.marked.parse()`。
- 数据全部在 `js/config.js` 中以结构化对象导出，新增/修改章节只改这一个文件。

---

## 维护说明

- 新增章节：在 `js/config.js` 对应科目的 `chapters` 数组追加一项
  `{ id, title, file, topics: [{key, range}], importance }`，并把 md 放进 `大纲/` 对应目录。
- `topics.key` 取值：`judge` 判断 / `fill` 填空 / `short` 简答 / `comp` 综合 / `calc` 计算 / `design` 设计。
- 切换主题色基调：改 `css/variables.css` 中 `[data-subject="shudian"]` / `[data-subject="modian"]` 块。
- 清空复习进度：浏览器控制台执行 `localStorage.removeItem('ezt-reviewed')` 后刷新。
