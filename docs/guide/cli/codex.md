# Codex 配置

<Badge text="CLI 配置" tone="cyan" />

::: tip 提示
**强烈建议使用 [CC-Switch](/guide/cc-switch) 来进行配置，小白友好！**
:::

本文介绍手动配置 **Codex CLI / VS Code 插件 / Codex App** 接入 Fuck2API。

## 1. 安装 Codex

### Codex CLI

命令行版本先安装：

```bash
npm i -g @openai/codex@latest
```

包地址：https://www.npmjs.com/package/@openai/codex

### VS Code 插件

- 市场地址：https://marketplace.visualstudio.com/items?itemName=openai.chatgpt  
- 或在 VS Code 扩展中心搜索 `codex` 安装  

### Codex App

下载与入门：https://developers.openai.com/codex/quickstart?setup=app

## 2. 找到 Codex 配置文件夹

打开 **终端**，按系统切换下方标签运行命令：

::: code-group

```bash [Windows]
start "" "%USERPROFILE%\.codex"
```

```bash [macOS]
open "$HOME/.codex"
```

:::

![打开 Codex 配置目录](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711163554059.png)

## 3. 创建配置文件

在配置文件夹中创建 / 编辑两个文件：

### `config.toml`

```toml
model_provider = "fuck2api"
model = "gpt-5.5"
model_reasoning_effort = "xhigh"
network_access = "enabled"
disable_response_storage = true
windows_wsl_setup_acknowledged = true
model_verbosity = "high"

[model_providers.fuck2api]
name = "fuck2api"
base_url = "https://fxxkapi.top/v1"
wire_api = "responses"
requires_openai_auth = true
```

### `auth.json`

```json
{
  "OPENAI_API_KEY": ""
}
```

::: warning 重要
- `base_url` 使用：`https://fxxkapi.top/v1`
- `OPENAI_API_KEY` 填入你在 [Fuck2API 后台](https://fxxkapi.top) 生成的 ApiKey
:::

## 4. 填入 ApiKey 并保存

在 `auth.json` 的 `OPENAI_API_KEY` 中写入密钥后保存。

密钥创建见：[ApiKey 管理](/guide/apikey)

## 5. 验证配置

终端运行：

```bash
codex
```

进行简单对话，确认配置成功。

![验证 Codex](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711163655740.png)

## CLI 模型提醒

- CLI 启动后，尽量不要在会话里随意切换模型。
- 若切换过模型，需要重新用命令启动，例如：

```bash
codex -m gpt-5.3-codex -c model_reasoning_effort="xhigh"
```

（具体模型名以你控制台可用模型为准。）

## 配置生效提醒

- 每次修改 `config.toml` 或 `auth.json` 后，都需要 **重启** Codex 才会生效。
- 重启方式：`Ctrl + C` 退出当前进程，再重新运行 `codex`。
- **VS Code 插件版** 与 **Codex App** 同样适用本套配置思路（Base URL + ApiKey）。

## 环境变量方式（可选）

```bash
export OPENAI_API_KEY="sk-你的密钥"
export OPENAI_BASE_URL="https://fxxkapi.top/v1"
```

## 相关文档

- [CC-Switch 配置](/guide/cc-switch)
- [Grok Build 配置](/guide/cli/grok-build)
- [Claude Code 配置](/guide/cli/claude-code)
- [Gemini 配置](/guide/cli/gemini)
