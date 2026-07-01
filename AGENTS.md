# AGENTS.md — 项目协作约定

本文件为所有参与者（含 AI 代理）记录本仓库的工程约定。改动代码前请先遵守此处规则。

## 1. 文件规模上限：400 行

- **所有源文件（`.ts` / `.tsx` / `.css`）单文件不得超过 400 行。** 接近或超出时，须按职责拆分为多个内聚模块（组件、工具、样式分节），而非塞进一个文件。
- **内容数据文件（`content/**/*.json`）** 同样遵守 400 行上限；超出时**按分类拆分**为多文件（参照 `content/fields/formulas/*.json` 与 `content/fields/examples/*.json` 的"每分类一文件"约定），由 `src/data/content.ts` 用 `import.meta.glob` 自动发现并按 `categories.json` 顺序拼装。
- **明确例外：** `content/*/symbols.json`（符号字典）是全局查表命名空间，被各处公式按 token 引用，不按分类拆分，不受 400 行限制约束。

## 2. 数据与代码分离

- 知识内容（公式 / 符号 / 例题 / 大纲 / 分类）一律放 `content/`，格式为纯 JSON；`src/` 下只写加载与渲染逻辑，不得内联内容。
- 顶层页面、路由、布局、顶栏入口的元数据集中声明在 `src/data/app-pages.tsx`（路由/布局/入口注册表）；`routes.tsx`、`App.tsx`、`Header.tsx` 三者均消费该表，不得各自硬编码路由判断。新增一个全宽页只需在注册表加一项，无需改动这三处。

## 3. 复用优先

- 全宽页页头（返回链接 + 标题 + 右侧控件槽）统一用 `src/components/PageHeader.tsx`，样式在 `src/styles/page.css`；不得在各页重复实现 toolbar。
- 渲染含 `$...$` 行内数学的纯文本用 `src/lib/text.ts` 的 `renderRichText`；需要符号点击弹窗的仍用 `DerivationSteps` 自带版本。
