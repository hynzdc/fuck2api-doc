# Grok Build 配置

本文介绍如何让 **Grok Build**（`grok` CLI / TUI）通过 Fuck2API 调用模型。

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
Base URL 一般写到 `/v1` 即可，不要写到 `/chat/completions`。Grok Build 会自动拼接接口路径。
:::

## 1. 安装 Grok Build

安装完成后的命令是 `grok`。

### macOS / Linux / Windows Git Bash

打开终端，执行官方安装命令：

```bash
curl -fsSL https://x.ai/cli/install.sh | bash
```

如果 `x.ai` 域名连接失败，可以使用备用安装源：

```bash
curl -fsSL https://storage.googleapis.com/grok-build-public-artifacts/cli/install.sh | bash
```

安装完成后，重新打开终端，或者执行：

```bash
source ~/.zshrc
```

### Windows（PowerShell）

打开 PowerShell，执行官方安装命令：

```powershell
irm https://x.ai/cli/install.ps1 | iex
```

如果 `x.ai` 域名连接失败，可以使用备用安装源：

```powershell
irm https://storage.googleapis.com/grok-build-public-artifacts/cli/install.ps1 | iex
```

安装完成后，重新打开 PowerShell。

如果当前窗口里找不到 `grok`，可以先关闭 PowerShell 再打开，或者检查用户环境变量 `Path` 中是否包含：

```text
%USERPROFILE%\.grok\bin
```

### 验证安装

macOS / Windows 都可以执行：

```bash
grok --version
```

如果能看到类似输出，说明安装成功：

```text
grok 0.2.82
```

查看帮助：

```bash
grok --help
```

更新到最新版：

```bash
grok update
```

### 安装后找不到 `grok`

**macOS：** 先执行 `source ~/.zshrc`。如果仍然找不到：

```bash
export PATH="$HOME/.grok/bin:$PATH"
grok --version
```

**Windows PowerShell：** 先重新打开 PowerShell。如果仍然找不到，临时添加到当前窗口：

```powershell
$env:Path="$env:USERPROFILE\.grok\bin;$env:Path"
grok --version
```

也可以永久添加用户环境变量：

```powershell
$oldPath = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "$env:USERPROFILE\.grok\bin;$oldPath", "User")
```

然后重新打开 PowerShell。

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
default = "fuck2api-grok"

# 方式 A：整站模型列表也走 Fuck2API（可选，但很方便）
[endpoints]
models_base_url = "https://fxxkapi.top/v1"

# 方式 B：显式声明一个/多个自定义模型（推荐，最稳）
[model.fuck2api-grok]
model = "grok-4.5"                        # 发给上游的真实模型名，按控制台可用 Grok 模型改
base_url = "https://fxxkapi.top/v1"       # Fuck2API OpenAI 兼容地址
name = "Fuck2API · Grok"
description = "经 Fuck2API 接入的 Grok 模型"
api_key = "sk-你的密钥"                    # 填入你的 Fuck2API ApiKey
api_backend = "chat_completions"          # 默认就是 chat_completions，可省略
context_window = 128000

[model.fuck2api-claude]
model = "claude-sonnet-4"
base_url = "https://fxxkapi.top/v1"
name = "Fuck2API · Claude"
description = "经 Fuck2API 接入的 Claude 模型"
api_key = "sk-你的密钥"
api_backend = "chat_completions"
context_window = 200000

[model.fuck2api-gemini]
model = "gemini-2.5-pro"
base_url = "https://fxxkapi.top/v1"
name = "Fuck2API · Gemini"
api_key = "sk-你的密钥"
api_backend = "chat_completions"
context_window = 1000000
```

::: warning 重要
- `base_url` 必须是 **`https://fxxkapi.top/v1`**（带 `/v1`），不要写成 `/chat/completions`
- `model` 字段填控制台真实存在的模型 ID（Grok 系列示例用 `grok-4.5`）
- `api_key` 填入你在 [Fuck2API 后台](https://fxxkapi.top) 生成的 ApiKey
- 不要把 API Key 发给别人，也不要提交到 Git 仓库
:::

## 4. 纯环境变量快速法（不改 config 也能试）

如果你只想先跑通，也可以不改 `config.toml`，用环境变量连接 Fuck2API：

```text
XAI_API_KEY
GROK_XAI_API_BASE_URL
```

其中：

- `XAI_API_KEY` 填 Fuck2API 提供的 API Key
- `GROK_XAI_API_BASE_URL` 填 Fuck2API 的 Base URL（写到 `/v1`）

### 当前终端临时可用

::: code-group

```bash [macOS / Linux]
export XAI_API_KEY="sk-你的密钥"
export GROK_XAI_API_BASE_URL="https://fxxkapi.top/v1"
# 可选：同时给整站模型列表用
export GROK_MODELS_BASE_URL="https://fxxkapi.top/v1"
grok
```

```powershell [Windows PowerShell]
$env:XAI_API_KEY = "sk-你的密钥"
$env:GROK_XAI_API_BASE_URL = "https://fxxkapi.top/v1"
$env:GROK_MODELS_BASE_URL = "https://fxxkapi.top/v1"
grok
```

```cmd [Windows CMD]
set XAI_API_KEY=sk-你的密钥
set GROK_XAI_API_BASE_URL=https://fxxkapi.top/v1
set GROK_MODELS_BASE_URL=https://fxxkapi.top/v1
```

:::

### 持久化（推荐）

::: code-group

```bash [macOS / Linux zsh]
echo 'export XAI_API_KEY="sk-你的密钥"' >> ~/.zshrc
echo 'export GROK_XAI_API_BASE_URL="https://fxxkapi.top/v1"' >> ~/.zshrc
echo 'export GROK_MODELS_BASE_URL="https://fxxkapi.top/v1"' >> ~/.zshrc
source ~/.zshrc
```

```powershell [Windows 用户环境变量]
[Environment]::SetEnvironmentVariable("XAI_API_KEY", "sk-你的密钥", "User")
[Environment]::SetEnvironmentVariable("GROK_XAI_API_BASE_URL", "https://fxxkapi.top/v1", "User")
[Environment]::SetEnvironmentVariable("GROK_MODELS_BASE_URL", "https://fxxkapi.top/v1", "User")
# 重新打开终端后生效
```

:::

此时 Grok 会：

1. 用 `https://fxxkapi.top/v1` 拉模型列表（请求 `/v1/models`）
2. 用 `Authorization: Bearer <XAI_API_KEY>` 访问 Fuck2API
3. 不再依赖 `grok login` 的浏览器登录

::: tip 凭证优先级（Grok 官方逻辑）
对某个自定义模型：`api_key` 字段 > `env_key` 环境变量 > 登录 session > `XAI_API_KEY`
:::

## 5. 启动并验证

进入项目目录后启动：

```bash
cd /path/to/your/project
grok
```

Windows PowerShell 示例：

```powershell
cd C:\path\to\your\project
grok
```

或直接带提示词：

```bash
grok "帮我看一下当前仓库结构"
```

单轮输出，不进入交互界面：

```bash
grok -p "解释一下这个项目的目录结构"
```

列出可用模型：

```bash
grok models
```

继续最近一次会话：

```bash
grok --continue
```

### 切换到 Fuck2API 模型

在 TUI 里任选一种：

| 方式 | 操作 |
| --- | --- |
| 斜杠命令 | `/model fuck2api-grok` 或 `/m fuck2api-grok` |
| 快捷键 | 在滚动区按 `Ctrl+M` 打开模型选择器 |
| 启动参数 | `grok -m fuck2api-grok` |

启动后进行简单对话，能正常返回即说明配置成功。

若使用纯环境变量方式，执行 `grok models` 时若看到类似 `You are using XAI_API_KEY.` 且能正常列出模型，也说明配置已生效。

![启动并验证 Grok Build](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711171421889.png)

## 6. 常见问题

### 安装时连不上 `x.ai`

macOS / Linux：

```bash
curl -fsSL https://storage.googleapis.com/grok-build-public-artifacts/cli/install.sh | bash
```

Windows PowerShell：

```powershell
irm https://storage.googleapis.com/grok-build-public-artifacts/cli/install.ps1 | iex
```

### 配置后请求失败

macOS / Linux 检查：

```bash
echo $XAI_API_KEY
echo $GROK_XAI_API_BASE_URL
grok models
```

Windows PowerShell 检查：

```powershell
echo $env:XAI_API_KEY
echo $env:GROK_XAI_API_BASE_URL
grok models
```

确认：

- API Key 是 Fuck2API 提供的完整 Key
- Base URL 写到 `/v1`
- Base URL 不要写成 `/chat/completions`
- 网络可以访问 Fuck2API 域名
- Fuck2API 已兼容 `/models` 和 `/chat/completions` 接口

### 安全提醒

不要把 API Key 发给别人，也不要提交到 Git 仓库。推荐保存在本机配置、环境变量或安全的密钥管理工具里。
