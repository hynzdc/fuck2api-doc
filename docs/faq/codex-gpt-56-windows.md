# Codex App 不显示 GPT-5.6（Windows）

## 现象

- 没有 ChatGPT 账号，只能用 **API Key / Custom Provider** 登录
- CLI 执行 `codex debug models` **能看到** `gpt-5.6-sol` / `gpt-5.6-terra` / `gpt-5.6-luna`
- **Codex Desktop App** 模型下拉只显示 `GPT-5.5` / `GPT-5.4` / `GPT-5.4 Mini` / `GPT-5.2` 等旧模型

## 原因

Codex App 前端会读取 Statsig 动态配置 `107580212`，其中包含：

- `available_models`
- `use_hidden_models`
- `default_model`

当前 Chromium LocalStorage（LevelDB）里缓存的是旧白名单，例如：

```text
["gpt-5.5","gpt-5.4","gpt-5.4-mini","gpt-5.3-codex","gpt-5.2"]
```

当 `use_hidden_models=true` 时，前端**只显示** `available_models` 里的模型，因此 `gpt-5.6-*` 会被过滤掉。

## 快速修复（提示词）

把下面整段提示词复制给本地 Agent 执行即可。  
**注意**：仅修复缓存时，App 下次重启后可能被远端旧配置覆盖，需要再执行一次，或加守护逻辑在重启时自动刷新配置。

```text
请帮我本地修复 Codex Desktop App 模型下拉不显示新模型的问题。

背景：
- 我没有 ChatGPT 账号，只能 API key / custom provider 登录。
- CLI `codex debug models` 能看到 `gpt-5.6-sol / gpt-5.6-terra / gpt-5.6-luna`。
- Codex App 模型下拉只显示 `GPT-5.5 / GPT-5.4 / GPT-5.4 Mini / GPT-5.2`。
- 不要删除或覆盖 `C:\Users\<你的用户名>\.codex\auth.json`，不要清空整个 App 数据目录，不要回显 token/API key。

已定位根因：
Codex App 前端会读取 Statsig dynamic config `107580212`：
- `available_models`
- `use_hidden_models`
- `default_model`

当前 Chromium LocalStorage leveldb 里这个配置是旧白名单：
`["gpt-5.5","gpt-5.4","gpt-5.4-mini","gpt-5.3-codex","gpt-5.2"]`

前端过滤逻辑是：当 `use_hidden_models=true` 时，只显示 `available_models` 里的模型，所以 `gpt-5.6-*` 被过滤掉。

修复要求：
1. 只杀 Codex App 相关进程：
   - `ChatGPT.exe` 且命令行包含 `OpenAI.Codex_`
   - 内置 `codex.exe` 且命令行包含 `OpenAI.Codex_...\resources\codex.exe`
2. 备份这个目录：
   `C:\Users\<你的用户名>\AppData\Local\Packages\OpenAI.Codex_2p2nqsd0c76g0\LocalCache\Roaming\Codex\web\Codex\Default\Local Storage\leveldb`
3. 用 LevelDB 工具精确修改 `statsig.cached.evaluations.*` 里 dynamic config `107580212`：
   - `available_models` 增加：
     `gpt-5.6-sol`
     `gpt-5.6-terra`
     `gpt-5.6-luna`
   - `default_model` 改为 `gpt-5.6-sol`
   - `use_hidden_models` 改为 `false`
   - 同时把内层 Statsig response 的 `time` 改成未来时间戳，避免 App 启动后被远端旧白名单覆盖。
4. 重启 Codex App：
   `Start-Process explorer.exe 'shell:AppsFolder\OpenAI.Codex_2p2nqsd0c76g0!App'`
5. 验证模型下拉应显示 `GPT-5.6-Sol / GPT-5.6-Terra / GPT-5.6-Luna`。

如果这个缓存修复仍被覆盖，请继续做更稳的本地前端过滤修复：在解包后的 App 前端 `model-list-filter` 或 `model-queries` 逻辑中，让 `available_models` 默认补入 `gpt-5.6-sol / gpt-5.6-terra / gpt-5.6-luna`，或者在 `use_hidden_models=true` 时不要过滤掉 provider 返回且 `visibility=list` 的模型。修改前必须备份 `app.asar`。
```

::: tip 路径说明
原文示例用户名为 `epean`，请改成你自己的 Windows 用户名。  
包名 `OpenAI.Codex_2p2nqsd0c76g0` 以本机实际安装为准，可在  
`%LOCALAPPDATA%\Packages\` 下搜索 `OpenAI.Codex_`。
:::

## 修复后效果

模型下拉应能看到 GPT-5.6 系列，例如：

![Codex App 显示 GPT-5.6 模型](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711203350479.png)

## 相关

- [Codex 配置](/guide/cli/codex)
- [Mac / Win 通用：CC Switch 官方登录预热](/faq/codex-gpt-56-mac-win)
