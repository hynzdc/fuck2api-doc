# WSL 配置

Windows 系统下配置 WSL 运行 AI 终端（Claude Code / Codex / Gemini 等）。

## 什么是 WSL？为什么要配置 WSL？

**WSL** = Windows Subsystem for Linux，可以让你在 Windows 下几乎无感地运行 Linux 子系统，无需额外配置完整虚拟机。

不少 AI 终端工具在 Linux 环境下原生支持更好，使用 WSL 运行 Claude Code / Codex / Gemini 等，通常比直接在 Windows 上更稳、体验更好。

## 配置 WSL

打开命令行并执行：

```bash
wsl --install
```

安装完成后，按提示配置用户并重启。重启后执行：

```bash
wsl -l -v
```

通常你会看到已经安装了一个 Ubuntu 作为默认发行版。

![WSL 列表](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164423237.png)

打开终端并输入 `wsl` 连接到对应发行版：

![进入 WSL](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164437499.png)

::: tip 提示
如果输入 `wsl --install` 无反应，尝试用 `wsl.exe` 替换 `wsl`。
:::

### 卸载已安装的发行版

```bash
wsl --list --verbose
```

例如发行版名为 `Ubuntu-24.04`：

```bash
wsl --unregister Ubuntu-24.04
```

### 指定位置安装发行版

1. 在目标位置创建新文件夹，例如 `D:\wsl`
2. 安装：

```bash
wsl --install Ubuntu-24.04 --location "D:\wsl"
```

更多参数见微软文档：  
https://learn.microsoft.com/en-us/windows/wsl/basic-commands#install

## 在 WSL 中使用 Codex 或其他 AI 终端

打开命令行，输入 `wsl` 登录默认发行版。  
WSL 是全新环境，需要 **重新安装** AI 终端相关工具。

### 安装 Node.js（nvm）

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

nvm install 22
nvm use 22
```

![安装 Node](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164642395.png)

### 安装 Codex（示例）

```bash
npm install -g @openai/codex
```

![安装 Codex](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164701394.png)

同样可安装：

```bash
npm i -g @anthropic-ai/claude-code@latest
npm i -g @google/gemini-cli@latest
```

### 配置文件迁移（重要）

::: warning WSL 与 Windows 的配置文件不互通
需要在 WSL 中单独放一份 `.codex` / `.claude` / `.gemini` 配置。
:::

#### 方式一：手动导入

1. 在 Windows 下复制用户目录中的配置文件夹（例如 `.codex` 或 `.claude`）：

![Windows 用户目录](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164718034.png)

```text
C:\Users\<your-user-name>
```

2. 在资源管理器地址栏打开 WSL 家目录（或从左下角 Linux 图标进入）：

![WSL 路径](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164736245.png)

```text
\\wsl.localhost\<Your-Distro-Name>\home\<Your-User-Name>
```

![粘贴配置](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164753948.png)

3. 将复制的文件夹粘贴到该目录下，重启 AI 终端。

配置内容中的 Base URL 请统一为 Fuck2API：

| 工具 | 关键字段 | 值 |
| --- | --- | --- |
| Claude Code | `ANTHROPIC_BASE_URL` | `https://fxxkapi.top` |
| Codex | `base_url` | `https://fxxkapi.top/v1` |
| Gemini | `GOOGLE_GEMINI_BASE_URL` | `https://fxxkapi.top` |

详见：

- [Claude Code 配置](/guide/cli/claude-code)
- [Codex 配置](/guide/cli/codex)
- [Gemini 配置](/guide/cli/gemini)

#### 方式二：通过 Windows 下的 CC-Switch 导入

1. 打开 [CC-Switch](/guide/cc-switch)，点击左上角设置（齿轮）→ **高级** → **配置文件目录**

![CC-Switch 设置](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164817843.png)

2. 将路径修改为 WSL 内路径（以 Codex 为例）：

```text
\\wsl.localhost\<Your-Distro-Name>\home\<Your-User-Name>\.codex
```

现在你可以在 Windows 侧管理配置，并在 WSL 中正常使用 Codex 等工具。

![CC-Switch WSL 路径](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164833586.png)

## 使用 VS Code 与 WSL 协作（以 Codex 扩展为例）

### 方案 A：VS Code 留在 Windows

在不连接 WSL、在 Windows 目录下工作时：

![Codex 在 WSL 中运行](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164850673.png)

在 VS Code 的 Codex 扩展右上角设置中勾选 **「Windows 设置 - 在 WSL 中运行」**，然后重新加载窗口。

若右上角没有该项：

1. `Ctrl + ,` 打开设置  
2. 搜索 `codex`  
3. 勾选 `Run Codex In Windows Subsystem For Linux`  

### 方案 B：VS Code 连接到 WSL

1. 点击左下角 `><`（远程连接）按钮  

![远程连接](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164905694.png)

2. 选择 `Connect to WSL Using Distro`  

![选择 Distro](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164919200.png)

3. 选择你已迁移过配置文件的 Linux 发行版  

![选择发行版](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711164930679.png)

此时 VS Code 已连接到 WSL。若提示缺少 Codex CLI，请在 WSL 中重新安装；随后即可在 Terminal 或扩展中唤起 AI 终端。

::: tip
如扩展提示需要登录，请回看上文「配置文件迁移」部分，确认 WSL 内已有正确的 ApiKey 与 `https://fxxkapi.top` 相关配置。
:::

## 相关文档

- [CC-Switch 配置](/guide/cc-switch)
- [通用步骤](/guide/common-steps)
- [Claude Code 配置](/guide/cli/claude-code)
- [Codex 配置](/guide/cli/codex)
- [Gemini 配置](/guide/cli/gemini)
