# 贡献指南

感谢你一起把 fuck2api 文档做得更好。本站的目标是：**好看、好读、好改**。

## 本地开发

```bash
# 需要 Node.js 18+
pnpm install
pnpm dev
```

浏览器打开终端提示的本地地址（默认 `http://localhost:5173`）。

## 目录结构

```text
docs/
├── .vitepress/
│   ├── config.mts          # 站点配置：导航、侧栏、主题
│   └── theme/
│       ├── index.ts        # 主题入口 & 全局组件
│       ├── style.css       # 高级视觉样式
│       └── components/     # Vue 组件
├── guide/                  # 快速开始 + CLI 配置
│   └── cli/                # Claude Code / Codex / Grok / Gemini / WSL
├── api/                    # API 接入
├── faq/                    # 帮助
├── public/                 # 静态资源 logo/favicon
├── index.md                # 入口（跳转到快速开始）
├── changelog.md
└── contributing.md
```

## 如何新增一篇文档

1. 在对应目录新建 `xxx.md`
2. 在 `docs/.vitepress/config.mts` 的 `sidebar` 里挂上链接
3. 如需出现在顶栏，更新 `nav`
4. 本地预览无误后提交

### 文档模板

```md
# 标题

<Badge text="标签" tone="violet" />

简短导语。

## 小节

内容...

::: tip
提示块
:::

## 下一步

→ [下一篇](/path)
```

## 写作规范

1. **先结论后细节**，扫读也能懂
2. 命令与配置给 **可复制** 的完整示例
3. 域名 / Key 用占位符，勿写真实密钥
4. 中英文混排时，中文与英文、数字间加空格（可选，保持全站一致）
5. 截图放到 `docs/public/images/`，用有意义的文件名

## 样式与组件

可在 Markdown 中直接使用：

| 组件 | 用途 |
| --- | --- |
| `<Badge text="..." tone="violet" />` | 行内标签 |
| `<ApiEndpoint method="POST" path="/v1/..." />` | 接口条 |
| `<FeatureGrid ... />` | 特性栅格 |
| 自定义容器 `::: tip` | 提示 / 警告 |

样式变量集中在 `docs/.vitepress/theme/style.css`，改品牌色主要动：

- `--f2-violet` / `--f2-cyan` / `--f2-emerald`
- `--vp-c-brand-*`

## 构建与预览

```bash
pnpm build
pnpm preview
```

## 提交建议

```text
docs: 补充 Claude Code WSL 配置说明
docs: 修正 embeddings 示例 JSON
style: 调整导航品牌字重
```

## 行为准则

- 尊重用户与贡献者
- 不在文档中引导违法滥用
- 发现安全问题请私下联系维护者，勿直接公开细节
