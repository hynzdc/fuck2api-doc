# Pi 配置

本文介绍如何安装并配置 **Pi**（`@earendil-works/pi-coding-agent`），让它通过 **Fuck2API** 调用模型。

Pi 是一款终端里的 AI coding agent，支持自定义 OpenAI / Anthropic 兼容端点，非常适合接入 Fuck2API。

- 项目主页：[pi.dev](https://pi.dev)
- 源码仓库：[earendil-works/pi](https://github.com/earendil-works/pi)
- 官方文档：[pi.dev/docs](https://pi.dev/docs/latest)

官方 Base URL：

```text
https://fxxkapi.top
```

OpenAI 兼容前缀（Pi 自定义 provider 常用）：

```text
https://fxxkapi.top/v1
```

::: tip 提示
先在 [ApiKey 管理](/guide/apikey) 创建密钥。  
Pi 通过 `~/.pi/agent/models.json` 配置自定义 provider；改完后在会话里执行 `/model` 即可刷新，一般不用重启。
:::

官方交互界面示意（来源：[Pi 官方文档](https://github.com/earendil-works/pi)）：

![Pi 交互界面](/images/pi/interactive-mode.png)

## 1. 安装 Pi

需要本机已安装 Node.js（建议 18+）。可先看 [通用步骤](/guide/common-steps)。

### npm 全局安装（推荐）

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

`--ignore-scripts` 是官方推荐写法：安装时不执行依赖生命周期脚本，不影响正常使用。

### 官方安装脚本

```bash
curl -fsSL https://pi.dev/install.sh | sh
```

安装完成后，终端应能直接运行：

```bash
pi --version
```

![安装并检查 Pi 版本](/images/pi/01-install-version.svg)

## 2. 找到 Pi 配置目录

Pi 的用户配置默认在 `~/.pi/agent/`。

打开 **终端**，按系统切换下方标签运行命令：

::: code-group

```bash [macOS / Linux]
mkdir -p "$HOME/.pi/agent"
open "$HOME/.pi/agent" 2>/dev/null || xdg-open "$HOME/.pi/agent" 2>/dev/null || ls -la "$HOME/.pi/agent"
```

```bash [Windows PowerShell]
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.pi\agent" | Out-Null
explorer "$env:USERPROFILE\.pi\agent"
```

```bash [Windows CMD]
mkdir "%USERPROFILE%\.pi\agent" 2>nul
start "" "%USERPROFILE%\.pi\agent"
```

:::

![Pi 配置目录](/images/pi/02-config-dir.svg)

主要会用到：

| 文件 | 作用 |
| --- | --- |
| `models.json` | 自定义 provider / 模型 / Base URL |
| `auth.json` | 内置 provider 的密钥（可选；自定义 provider 也可直接写在 `models.json`） |
| `settings.json` | 主题、思考等级等偏好 |

## 3. 配置 Fuck2API（推荐）

在配置目录创建或编辑 `models.json`：

```text
~/.pi/agent/models.json
```

写入如下内容（把模型 ID 换成你在控制台真实可用的名字）：

```json
{
  "providers": {
    "fuck2api": {
      "baseUrl": "https://fxxkapi.top/v1",
      "api": "openai-completions",
      "apiKey": "sk-你的密钥",
      "authHeader": true,
      "models": [
        {
          "id": "gpt-4o",
          "name": "Fuck2API · GPT-4o",
          "reasoning": false,
          "input": ["text", "image"],
          "contextWindow": 128000,
          "maxTokens": 16384,
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        },
        {
          "id": "claude-sonnet-4",
          "name": "Fuck2API · Claude Sonnet 4",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 200000,
          "maxTokens": 16384,
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        },
        {
          "id": "gemini-2.5-pro",
          "name": "Fuck2API · Gemini 2.5 Pro",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 1000000,
          "maxTokens": 16384,
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        },
        {
          "id": "grok-4.5",
          "name": "Fuck2API · Grok",
          "reasoning": true,
          "input": ["text"],
          "contextWindow": 128000,
          "maxTokens": 16384,
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        }
      ]
    }
  }
}
```

![models.json 接入 Fuck2API](/images/pi/03-models-json.svg)

::: warning 重要
- `baseUrl` 必须是 **`https://fxxkapi.top/v1`**（带 `/v1`）
- `api` 使用 **`openai-completions`**（OpenAI Chat Completions，兼容面最广）
- `apiKey` 填入你在 [Fuck2API 后台](https://fxxkapi.top) 生成的 ApiKey
- `authHeader: true` 会自动带上 `Authorization: Bearer <apiKey>`
- `models[].id` 必须是控制台真实存在的模型 ID，不要自己瞎编
- 不要把 API Key 发给别人，也不要提交到 Git 仓库
:::

### 用环境变量存密钥（更安全）

如果不想把 Key 明文写在 `models.json` 里：

```json
{
  "providers": {
    "fuck2api": {
      "baseUrl": "https://fxxkapi.top/v1",
      "api": "openai-completions",
      "apiKey": "$FUCK2API_KEY",
      "authHeader": true,
      "models": [
        {
          "id": "gpt-4o",
          "name": "Fuck2API · GPT-4o",
          "input": ["text", "image"],
          "contextWindow": 128000,
          "maxTokens": 16384
        }
      ]
    }
  }
}
```

然后在 shell 里导出：

::: code-group

```bash [macOS / Linux]
export FUCK2API_KEY="sk-你的密钥"
```

```powershell [Windows PowerShell]
$env:FUCK2API_KEY = "sk-你的密钥"
# 永久写入用户环境变量（可选）：
# [Environment]::SetEnvironmentVariable("FUCK2API_KEY", "sk-你的密钥", "User")
```

:::

## 4. 启动并选择模型

进入你的项目目录后启动：

```bash
cd /path/to/your/project
pi
```

进入交互界面后：

1. 输入 `/model`（或快捷键 `Ctrl+L`）打开模型列表
2. 选中 `fuck2api` 下的模型，例如 `gpt-4o` / `claude-sonnet-4`
3. 随便聊一句，确认能正常回复

![用 /model 切换到 Fuck2API 模型](/images/pi/06-model-select.svg)

也可以启动时直接指定：

```bash
pi --provider fuck2api --model gpt-4o
```

![启动 Pi 并指定模型](/images/pi/05-start-pi.svg)

查看当前已识别的模型：

```bash
pi --list-models
```

![pi --list-models 确认配置](/images/pi/04-list-models.svg)

## 5. 常用操作速查

| 操作 | 说明 |
| --- | --- |
| `/model` | 切换模型 |
| `/settings` | 思考等级、主题、传输等设置 |
| `/new` | 新开会话 |
| `/resume` | 恢复历史会话 |
| `/compact` | 手动压缩上下文 |
| `/quit` | 退出 |
| `@文件名` | 模糊搜索并引用项目文件 |
| `!command` | 执行 shell 并把输出发给模型 |
| `!!command` | 只执行 shell，不发给模型 |

默认工具能力：

- `read` 读文件
- `write` 写文件
- `edit` 改文件
- `bash` 跑命令

更多扩展、Skills、主题见官方文档：[Customization](https://pi.dev/docs/latest)。

## 6. 可选：Anthropic Messages 协议

若你主要用 Claude 系列，且 Fuck2API 已兼容 Anthropic Messages，可额外加一个 provider：

```json
{
  "providers": {
    "fuck2api-anthropic": {
      "baseUrl": "https://fxxkapi.top",
      "api": "anthropic-messages",
      "apiKey": "sk-你的密钥",
      "models": [
        {
          "id": "claude-sonnet-4",
          "name": "Fuck2API · Claude（Anthropic 协议）",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 200000,
          "maxTokens": 16384,
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        }
      ]
    }
  }
}
```

::: tip
大多数场景优先用第 3 节的 **`openai-completions` + `/v1`**，一套配置就能切 GPT / Claude / Gemini / Grok。  
只有确认 Anthropic 协议可用、且需要 Claude 专有能力时，再加 `anthropic-messages`。
:::

## 7. 兼容性微调（连不上 / 报参数错误时）

部分网关对 OpenAI 字段支持不完整时，可在 provider 上加 `compat`：

```json
{
  "providers": {
    "fuck2api": {
      "baseUrl": "https://fxxkapi.top/v1",
      "api": "openai-completions",
      "apiKey": "sk-你的密钥",
      "authHeader": true,
      "compat": {
        "supportsDeveloperRole": false,
        "supportsReasoningEffort": false
      },
      "models": [
        {
          "id": "gpt-4o",
          "name": "Fuck2API · GPT-4o",
          "input": ["text"],
          "contextWindow": 128000,
          "maxTokens": 8192
        }
      ]
    }
  }
}
```

改完后在 Pi 里再执行一次 `/model` 刷新即可。

## 常见问题

| 现象 | 处理 |
| --- | --- |
| 401 / 鉴权失败 | 检查 `apiKey` 是否完整；是否误加空格/引号；`authHeader` 是否为 `true` |
| 模型列表没有 fuck2api | 确认 `~/.pi/agent/models.json` 路径与 JSON 语法；在会话里执行 `/model` 刷新 |
| 模型不可用 / 404 | 把 `models[].id` 改成控制台真实模型 ID |
| 连不上 | 确认 `baseUrl` 为 `https://fxxkapi.top/v1`，本机网络可访问该域名 |
| 报 unknown field / role 错误 | 按第 7 节加上 `compat.supportsDeveloperRole: false` 等 |
| Key 写在文件里不放心 | 改用 `"apiKey": "$FUCK2API_KEY"` + 环境变量 |

## 相关文档

- [ApiKey 管理](/guide/apikey)
- [通用步骤](/guide/common-steps)
- [Grok Build 配置](/guide/cli/grok-build)
- [Claude Code 配置](/guide/cli/claude-code)
- [Codex 配置](/guide/cli/codex)
- [官方 Pi 文档 · Custom Models](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/models.md)
