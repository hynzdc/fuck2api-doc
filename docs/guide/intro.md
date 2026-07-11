# 平台简介

<Badge text="入门" tone="violet" /> <Badge text="5 分钟" tone="cyan" />

**fuck2api** 是面向开发者与团队的 **AI API 中转与聚合平台**。  
用 **一套 OpenAI 兼容接口**，统一接入 GPT、Claude、Gemini 等顶级模型能力，并提供稳定网关、智能路由、透明计费与完善文档。

## 你能用它做什么

| 场景 | 说明 |
| --- | --- |
| 个人开发 | 一个 Key 跑通 Claude Code / Codex / 本地脚本 |
| 团队协作 | 统一额度、权限与模型白名单，成本可追溯 |
| 产品接入 | 标准 HTTP API，任意语言 / 框架都能调用 |
| 自建部署 | Docker 一键拉起，数据与密钥自持 |

## 核心能力

### 1. OpenAI 协议兼容

绝大多数客户端只需改两处：

1. **Base URL** → `https://fxxkapi.top`（OpenAI SDK 常用 `https://fxxkapi.top/v1`）
2. **API Key** → 你的 `sk-...`

即可继续使用原有 SDK、CLI 与 GUI 工具。

### 2. 多模型统一入口

- Chat / Completions / Responses
- Embeddings
- 图像生成
- 流式（SSE）输出

模型名保持业界习惯（如 `gpt-4o`、`claude-sonnet-4`、`gemini-2.5-pro`），也可配置别名映射。

### 3. 生产级网关

- 就近接入与边缘加速
- 上游故障自动切换
- 限流、配额、IP 与模型级权限
- 请求日志与延迟观测

## 架构一览

```text
┌─────────────┐     HTTPS      ┌──────────────────┐      ┌─────────────┐
│  Claude Code│ ─────────────► │                  │ ───► │  OpenAI     │
│  Codex CLI  │                │   fuck2api 网关  │ ───► │  Anthropic  │
│  Gemini CLI │   API Key      │  鉴权·路由·计费  │ ───► │  Google     │
│  你的 App   │ ─────────────► │                  │ ───► │  其他渠道   │
└─────────────┘                └──────────────────┘      └─────────────┘
```

## 文档怎么读

建议按这条路径：

1. [充值](/guide/recharge)
2. [ApiKey 管理](/guide/apikey)
3. [通用步骤](/guide/common-steps)
4. [CC-Switch 配置](/guide/cc-switch) 或手动 [Claude Code](/guide/cli/claude-code) / [Codex](/guide/cli/codex) / [Gemini](/guide/cli/gemini)
5. Windows 用户可看 [WSL 配置](/guide/cli/wsl)
6. 深入对接看 [API 接入](/api/overview)

::: tip 维护提示
本站所有内容都在仓库 `docs/` 目录下的 Markdown 文件中。  
改文档 = 改 `.md` 文件，本地 `pnpm dev` 即时预览，`pnpm build` 产出静态站。
:::

## 下一步

<div class="f2-card-links">
  <a class="f2-card-link" href="/guide/recharge">
    <div class="f2-card-link__title">💳 充值</div>
    <p class="f2-card-link__desc">支付宝充值，兑换比例 1:10。</p>
  </a>
  <a class="f2-card-link" href="/guide/apikey">
    <div class="f2-card-link__title">🔑 ApiKey 管理</div>
    <p class="f2-card-link__desc">在后台创建 API 密钥。</p>
  </a>
  <a class="f2-card-link" href="/guide/common-steps">
    <div class="f2-card-link__title">🧰 通用步骤</div>
    <p class="f2-card-link__desc">检查 Node.js、安装 CLI 并测试运行。</p>
  </a>
</div>
