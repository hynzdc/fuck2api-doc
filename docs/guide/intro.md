# Fuck2API

**Fuck2API** 是 **FuckLab 内部实验室** 的 AI 模型统一接入工具。

面向实验室研发、实验与原型验证场景，通过 **一套 OpenAI 兼容接口** 统一接入 GPT、Claude、Gemini 等模型能力，提供稳定网关、智能路由与基础配额管理。

::: tip 使用范围
本服务仅供 **FuckLab 实验室团队内部** 使用。  
接口地址、密钥与文档请勿外传；资源有限，请按需、克制使用。
:::

---

## 定位

| 项 | 说明 |
| --- | --- |
| 使用范围 | 实验室内部研发与实验 |
| 使用方式 | 小范围开放，以自用与协作验证为主 |
| 关注点 | 稳定、可维护、低接入成本 |

当前能力覆盖：

- GPT
- Codex
- Claude Code
- Gemini
- 少量国产模型

---

## 你能用它做什么

| 场景 | 说明 |
| --- | --- |
| 个人开发 | 一个 Key 跑通 Claude Code / Codex / 本地脚本 |
| 实验室协作 | 统一额度、权限与模型白名单，成本可追溯 |
| 产品 / 原型接入 | 标准 HTTP API，任意语言 / 框架都能调用 |

---

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

---

## 架构一览

```text
┌─────────────┐     HTTPS      ┌──────────────────┐      ┌─────────────┐
│  Claude Code│ ─────────────► │                  │ ───► │  OpenAI     │
│  Codex CLI  │                │   fuck2api 网关  │ ───► │  Anthropic  │
│  Gemini CLI │   API Key      │  鉴权·路由·配额  │ ───► │  Google     │
│  你的 App   │ ─────────────► │                  │ ───► │  其他渠道   │
└─────────────┘                └──────────────────┘      └─────────────┘
```

---

## 文档怎么读

建议按这条路径：

1. [ApiKey 管理](/guide/apikey)
2. [通用步骤](/guide/common-steps)
3. [CC-Switch 配置](/guide/cc-switch) 或手动 [Claude Code](/guide/cli/claude-code) / [Codex](/guide/cli/codex) / [Gemini](/guide/cli/gemini) / [Pi](/guide/cli/pi)
4. Windows 用户可看 [WSL 配置](/guide/cli/wsl)
5. 深入对接看 [API 接入](/api/overview)

## 下一步

<div class="f2-card-links">
  <a class="f2-card-link" href="/guide/apikey">
    <div class="f2-card-link__title">🔑 ApiKey 管理</div>
    <p class="f2-card-link__desc">在后台创建 API 密钥。</p>
  </a>
  <a class="f2-card-link" href="/guide/common-steps">
    <div class="f2-card-link__title">🧰 通用步骤</div>
    <p class="f2-card-link__desc">检查 Node.js、安装 CLI 并测试运行。</p>
  </a>
  <a class="f2-card-link" href="/guide/cc-switch">
    <div class="f2-card-link__title">🔀 CC-Switch 配置</div>
    <p class="f2-card-link__desc">一键切换客户端接入配置。</p>
  </a>
</div>
