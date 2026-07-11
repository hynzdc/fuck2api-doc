# Codex App 不显示 GPT-5.6（Mac / Win 通用）

通过 **官方 ChatGPT 登录预热模型列表 + CC Switch 保留登录态 + 再切回 API Key**，让 Codex Desktop App 正常显示 GPT-5.6。  
**macOS / Windows 通用**，比直接改本地缓存更省事。

## 准备工作

- 一个 **ChatGPT 账号**（FREE 号即可，可用谷歌邮箱注册）
- 已安装并配置好 [CC Switch](/guide/cc-switch)
- 本机已装 Codex Desktop App

## 操作步骤

### 1. 先用官方账号登录 Codex

1. 登录 ChatGPT 官方账号（FREE 号即可）：

![注册 / 登录 ChatGPT 官方账号](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711212616978.png)

2. 打开桌面 Codex，用该官方号登录：

![Codex 使用 GPT 官方号登录](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711212756102.png)

登录后点 Codex 左下角账号 / 设置，能看到账号与剩余用量，说明已是官方登录状态。

::: tip
后面步骤中 **先不要关掉 Codex**。
:::

### 2. 在 CC Switch 打开 3 个开关

打开 CC Switch → 左上角 **设置 → 通用**，打开下面三个开关：

| 开关 | 作用 |
| --- | --- |
| **Codex 应用增强 → 切换第三方时保留官方登录** | 切到第三方 API 时仍保留官方插件、手机远程等能力 |
| **窗口行为 → 开机自启** | 随系统启动自动运行 CC Switch |
| **窗口行为 → 静默启动** | 启动时不弹主窗口，只在托盘运行 |

![CC Switch 通用设置中的三个开关](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711212956479.png)

### 3. 切换到第三方 API

在 CC Switch 里把 Codex 切换到你的第三方 / Fuck2API 配置：

![在 CC Switch 中切换 API](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711213211887.png)

**验证**：查看 `auth.json`，若仍有登录相关 token，说明切换方式正确：

![auth.json 仍保留登录 token](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711213325376.png)

### 4. 重启 Codex

重启 Codex App 后，模型列表中应已出现 GPT-5.6：

![重启后出现 GPT-5.6](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711213422238.png)

![模型列表中的 GPT-5.6](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711213440147.png)

### 5. 退出官方登录，改用 API Key

1. 在 Codex 中退出当前官方登录：

![退出 Codex 官方登录](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711213530493.png)

2. 改用 **API Key** 登录，填入 Fuck2API 的密钥：

![使用 API Key 重新登录](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711213638211.png)

![API Key 登录完成](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711213716722.png)

完成后可继续用 API Key 请求；GPT-5.6 不再是「自定义模型」形态，也可正常滑动调节强度。

## 相关

- [CC Switch 配置](/guide/cc-switch)
- [Codex 配置](/guide/cli/codex)
- [仅 Windows：改本地 Statsig 缓存](/faq/codex-gpt-56-windows)
