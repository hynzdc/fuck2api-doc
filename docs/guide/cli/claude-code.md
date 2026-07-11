# Claude Code 配置

::: tip 提示
**强烈建议使用 [CC-Switch](/guide/cc-switch) 来进行配置，小白友好！**
:::

本文介绍在 **不依赖 CC-Switch** 时，手动配置 Claude Code 走 Fuck2API。

## 1. 找到 Claude Code 配置文件夹

首先打开你的 **终端** 程序（Windows 或 macOS 均可），按系统切换下方标签运行命令，打开 Claude Code 的配置文件夹。

::: code-group

```bash [Windows]
start "" "%USERPROFILE%\.claude"
```

```bash [macOS]
open "$HOME/.claude"
```

:::

![打开 Claude 配置目录](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711163217154.png)

## 2. 创建 `settings.json`

在配置文件夹中手动创建 `settings.json`，写入如下内容：

::: warning 重要
`ANTHROPIC_BASE_URL` 请使用 Fuck2API 官方地址：`https://fxxkapi.top`
:::

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "",
    "ANTHROPIC_BASE_URL": "https://fxxkapi.top",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

## 3. 填入 ApiKey

在 `ANTHROPIC_AUTH_TOKEN` 中填入你在 [Fuck2API 后台](https://fxxkapi.top) 生成的 ApiKey，然后保存文件。

可先在 [ApiKey 管理](/guide/apikey) 中创建密钥。

## 4. 验证配置

在终端运行：

```bash
claude
```

进行简单对话，确认可以正常回复。

![验证 Claude Code](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711163248265.png)

## 环境变量方式（可选）

也可以不写 `settings.json`，直接导出环境变量：

```bash
export ANTHROPIC_BASE_URL="https://fxxkapi.top"
export ANTHROPIC_AUTH_TOKEN="sk-你的密钥"
# 部分版本也支持：
# export ANTHROPIC_API_KEY="sk-你的密钥"
```

## 常见问题

| 现象 | 处理 |
| --- | --- |
| 401 / 鉴权失败 | 检查 Token 是否完整、是否误加引号或空格 |
| 连不上 | 确认 `ANTHROPIC_BASE_URL` 为 `https://fxxkapi.top` |
| 模型不可用 | 到控制台确认当前 Key 可用模型 / 分组 |

## 相关文档

- [CC-Switch 配置](/guide/cc-switch)
- [通用步骤](/guide/common-steps)
- [Codex 配置](/guide/cli/codex)
