# Gemini 配置

<Badge text="CLI 配置" tone="green" />

::: tip 提示
**强烈建议使用 [CC-Switch](/guide/cc-switch) 来进行配置，小白友好！**
:::

本文介绍手动配置 Gemini CLI 接入 Fuck2API。

## 1. 找到 Gemini 配置文件夹

打开 **终端**，按系统切换下方标签运行命令：

::: code-group

```bash [Windows]
start "" "%USERPROFILE%\.gemini"
```

```bash [macOS]
open "$HOME/.gemini"
```

:::

![打开 Gemini 配置目录](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711163845909.png)

## 2. 创建 `.env` 文件

在配置文件夹中手动创建 `.env`，写入如下内容：

```bash
GOOGLE_GEMINI_BASE_URL=https://fxxkapi.top
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3-pro-preview
```

::: warning 重要
- Base URL 使用：`https://fxxkapi.top`
- `GEMINI_API_KEY` 填入你在 [Fuck2API 后台](https://fxxkapi.top) 生成的 ApiKey
- `GEMINI_MODEL` 可按控制台实际可用模型修改
:::

## 3. 填入 ApiKey

在 `GEMINI_API_KEY=` 后面写入密钥，保存文件。

密钥创建见：[ApiKey 管理](/guide/apikey)

## 4. 验证配置

终端运行：

```bash
gemini
```

进行简单对话，确认配置成功。

![验证 Gemini](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164207319.png)

## 安装 Gemini CLI（如未安装）

```bash
npm i -g @google/gemini-cli@latest
```

也可先看 [通用步骤](/guide/common-steps)。

## 常见问题

| 现象 | 处理 |
| --- | --- |
| 鉴权失败 | 检查 Key 是否完整、是否选对分组 |
| 模型不存在 | 把 `GEMINI_MODEL` 改成控制台真实模型名 |
| 连不上 | 确认 `GOOGLE_GEMINI_BASE_URL=https://fxxkapi.top` |

## 相关文档

- [CC-Switch 配置](/guide/cc-switch)
- [Claude Code 配置](/guide/cli/claude-code)
- [Codex 配置](/guide/cli/codex)
