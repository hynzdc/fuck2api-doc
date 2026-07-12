# fuck2api Docs

> 高端、易维护的 **fuck2api** 官方使用教程站。

![Node](https://img.shields.io/badge/node-%3E%3D18-7c5cff)
![VitePress](https://img.shields.io/badge/vitepress-1.x-22d3ee)
![License](https://img.shields.io/badge/license-MIT-34d399)

## ✨ 特性

- **暗色优先高级主题**：紫青渐变、玻璃拟态导航、微噪点质感
- **精简导航**：快速开始 · API 接入 · 控制台 · 更多
- **Markdown 即内容**：改 `.md` 就能更新文档，零后端
- **本地全文搜索**：`Ctrl/⌘ K`
- **一键部署静态站**：Cloudflare / Vercel / Nginx 均可
- **自定义组件**：Badge、ApiEndpoint、FeatureGrid 等

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 本地开发（热更新）
pnpm dev

# 构建静态站点
pnpm build

# 预览构建产物
pnpm preview
```

开发服务器默认：`http://localhost:5173`（自动进入 `/guide/intro`）

## 📁 目录

```text
docs/
├── .vitepress/          # 主题与站点配置
│   ├── config.mts       # 导航 / 侧栏 / SEO
│   └── theme/           # 样式与 Vue 组件
├── guide/               # 快速开始（含）
│   └── ├── api/                 # API 接入
├── faq/                 # 常见问题
├── public/              # logo、favicon
├── index.md             # 入口跳转
├── changelog.md
└── contributing.md
```

## ✏️ 日常维护

| 你想… | 怎么做 |
| --- | --- |
| 改某篇教程 | 编辑对应 `docs/**/*.md` |
| 加新页面 | 新建 md + 在 `config.mts` sidebar 注册 |
| 改导航 | 编辑 `docs/.vitepress/config.mts` → `nav` / `sidebar` |
| 改品牌色 / 视觉 | 编辑 `docs/.vitepress/theme/style.css` |
| 写更新说明 | 编辑 `docs/changelog.md` |

详见 [贡献指南](./docs/contributing.md)。

## 🌐 部署

构建产物：`docs/.vitepress/dist`

### Cloudflare Pages

- Build command: `pnpm build`
- Output directory: `docs/.vitepress/dist`

### Nginx

```nginx
root /var/www/fuck2api-docs;
location / {
  try_files $uri $uri.html $uri/ /index.html;
}
```

## 🎨 设计原则

1. **比参考站更高级**：更强的品牌渐变、更细的排版层级、更统一的卡片语言
2. **比参考站更好维护**：纯 Markdown + 单一 config，无复杂 CMS
3. **先让人跑通**：通用配置公式置顶，客户端文档只讲差异点
4. **可扫读**：表格、步骤条、卡片链接、错误码速查

## 📄 License

MIT
