# Grok Build 配置

<Badge text="CLI 配置" tone="violet" />

本文介绍如何让 **Grok Build**（`grok` CLI / TUI）通过 Fuck2API 中转调用模型。

官方 Base URL：

```text
https://fxxkapi.top
```

OpenAI 兼容前缀（Grok 自定义模型常用）：

```text
https://fxxkapi.top/v1
```

::: tip 提示
先在 [ApiKey 管理](/guide/apikey) 创建密钥，并确认余额充足。  
Grok 支持自定义 OpenAI 兼容端点，非常适合对接 Fuck2API。
:::

## 1. 安装 Grok Build

### macOS / Linux / Windows Git Bash

```bash
curl -fsSL https://x.ai/cli/install.sh | bash
```

### Windows（PowerShell）

```powershell
irm https://x.ai/cli/install.ps1 | iex
```

安装完成后验证：

```bash
grok --version
```

更新到最新版：

```bash
grok update
```

## 2. 找到 Grok 配置文件

Grok 全局配置位于用户目录下的 `config.toml`。

打开配置目录：

::: code-group

```bash [Windows]
start "" "%USERPROFILE%\.grok"
```

```bash [macOS]
open "$HOME/.grok"
```

```bash [Linux]
xdg-open "$HOME/.grok" 2>/dev/null || ls -la "$HOME/.grok"
```

:::

配置文件路径：

::: code-group

```text [Windows]
%USERPROFILE%\.grok\config.toml
```

```text [macOS / Linux]
~/.grok/config.toml
```

:::

如果没有该文件，可手动新建一个空文件再写入下面内容。

## 3. 推荐配置：自定义模型指向 Fuck2API

编辑 `~/.grok/config.toml`（Windows 为 `%USERPROFILE%\.grok\config.toml`），写入：

```toml
[models]
# 启动默认使用的模型（与下面 [model.xxx] 名称对应）
default = "fuck2api-gpt"

# 方式 A：整站模型列表也走 Fuck2API（可选，但很方便）
[endpoints]
models_base_url = "https://fxxkapi.top/v1"

# 方式 B：显式声明一个/多个自定义模型（推荐，最稳）
[model.fuck2api-gpt]
model = "gpt-4o"                          # 发给上游的真实模型名，按控制台可用模型改
base_url = "https://fxxkapi.top/v1"       # Fuck2API OpenAI 兼容地址
name = "Fuck2API · GPT"
description = "经 Fuck2API 中转的 GPT 模型"
env_key = "F2_API_KEY"                    # 从环境变量读 Key（更安全）
api_backend = "chat_completions"          # 默认就是 chat_completions，可省略
context_window = 128000

[model.fuck2api-claude]
model = "claude-sonnet-4"
base_url = "https://fxxkapi.top/v1"
name = "Fuck2API · Claude"
description = "经 Fuck2API 中转的 Claude 模型"
env_key = "F2_API_KEY"
api_backend = "chat_completions"
context_window = 200000

[model.fuck2api-gemini]
model = "gemini-2.5-pro"
base_url = "https://fxxkapi.top/v1"
name = "Fuck2API · Gemini"
env_key = "F2_API_KEY"
api_backend = "chat_completions"
context_window = 1000000
```

::: warning 重要
- `base_url` 必须是 **`https://fxxkapi.top/v1`**（带 `/v1`）
- `model` 字段填控制台真实存在的模型 ID
- `env_key` 对应的环境变量里放你的 Fuck2API ApiKey
:::

### 也可以直接把 Key 写进配置（不推荐）

```toml
[model.fuck2api-gpt]
model = "gpt-4o"
base_url = "https://fxxkapi.top/v1"
name = "Fuck2API · GPT"
api_key = "sk-你的密钥"
```

更推荐用环境变量，避免 Key 明文落盘后误提交。

## 4. 设置 ApiKey 环境变量

::: code-group

```bash [macOS / Linux]
export F2_API_KEY="sk-你的密钥"
# 可选：同时给整站模型列表用
export XAI_API_KEY="sk-你的密钥"
export GROK_MODELS_BASE_URL="https://fxxkapi.top/v1"
```

```powershell [Windows PowerShell]
$env:F2_API_KEY = "sk-你的密钥"
$env:XAI_API_KEY = "sk-你的密钥"
$env:GROK_MODELS_BASE_URL = "https://fxxkapi.top/v1"
```

```cmd [Windows CMD]
set F2_API_KEY=sk-你的密钥
set XAI_API_KEY=sk-你的密钥
set GROK_MODELS_BASE_URL=https://fxxkapi.top/v1
```

:::

### 持久化（推荐）

::: code-group

```bash [macOS / Linux zsh]
# 写入 ~/.zshrc
echo 'export F2_API_KEY="sk-你的密钥"' >> ~/.zshrc
echo 'export XAI_API_KEY="sk-你的密钥"' >> ~/.zshrc
echo 'export GROK_MODELS_BASE_URL="https://fxxkapi.top/v1"' >> ~/.zshrc
source ~/.zshrc
```

```powershell [Windows 用户环境变量]
setx F2_API_KEY "sk-你的密钥"
setx XAI_API_KEY "sk-你的密钥"
setx GROK_MODELS_BASE_URL "https://fxxkapi.top/v1"
# 重新打开终端后生效
```

:::

::: tip 凭证优先级（Grok 官方逻辑）
对某个自定义模型：`api_key` 字段 > `env_key` 环境变量 > 登录 session > `XAI_API_KEY`
:::

## 5. 纯环境变量快速法（不改 config 也能试）

如果你只想先跑通，可以：

```bash
export GROK_MODELS_BASE_URL="https://fxxkapi.top/v1"
export XAI_API_KEY="sk-你的密钥"
grok
```

此时 Grok 会：

1. 用 `https://fxxkapi.top/v1` 拉模型列表（请求 `/v1/models`）
2. 用 `Authorization: Bearer <XAI_API_KEY>` 访问中转
3. 不再依赖 `grok login` 的浏览器登录

## 6. 启动并验证

进入项目目录后启动：

```bash
cd /path/to/your/project
grok
```

或直接带提示词：

```bash
grok "帮我看一下当前仓库结构"
```

### 切换到 Fuck2API 模型

在 TUI 里任选一种：

| 方式 | 操作 |
| --- | --- |
| 斜杠命令 | `/model fuck2api-gpt` 或 `/m fuck2api-gpt` |
| 快捷键 | 在滚动区按 `Ctrl+M` 打开模型选择器 |
| 启动参数 | `grok -m fuck2api-gpt` |

启动后进行简单对话，能正常返回即说明配置成功。

![启动并验证 Grok Build](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711171421889.png)
