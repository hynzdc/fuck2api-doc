# CC-Switch 配置

### 什么是 CC-Switch

![image-20260711145249228](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711145249399.png)

- ✅ 一键切换 API 配置 - 在多个 API 提供商之间快速切换
- ✅ 可视化配置管理 - 通过图形界面轻松管理所有配置
- ✅ MCP 服务器管理 - 管理 Model Context Protocol 服务器
- ✅ 系统托盘快捷操作 - 通过托盘菜单快速切换
- ✅ 本地代理 - 支持热切换CC、CX、Gemini的供应商
- ✅ 故障转移 - 全自动渠道故障转移

### 软件下载

访问 [CC Switch Download](https://github.com/farion1231/cc-switch/releases/latest) 页面下载最新的CC-Switch工具，在本地进行安装

![image-20260711145359445](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711145359532.png)

### 配置渠道商

**这一步以Codex的配置为例，CC与Gemini配置同理**

- **步骤一：**

  1. 打开软件，选择要配置的CLI
  2. 选择好CLI后，点击添加供应商进行配置

  ![image-20260711145634692](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711145634805.png)

- **步骤二：**

  1. 在API Key 和 API请求地址写上在后台创建的

  2. 在 `API Key` 部分填写你在后台生成的密钥

  3. 右下角点击添加

- **步骤三：**

  1. 在主界面查看，确保目前使用的渠道是我们刚配置的

  ![image-20260711153802750](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711153802823.png)

- **步骤四：**

  1. 在主界面点击设置按钮，进入通用设置页面

  2. 在下方找到 `跳过Claude Code初次安装确认`，确保这项是打开的

  ![image-20260711153913187](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711153913252.png)

- **步骤五：**

  1. 打开终端，运行codex或者claude，进行简单对话，查看配置是否正常

  ![image-20260711154227376](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711154227478.png)

### 拉取模型列表

点击获取模型列表，点击添加模型，可以预设一个模型，比如`gpt-5.6-sol`

![image-20260711153439220](https://pic-es.oss-cn-shanghai.aliyuncs.com/20260711153439401.png)

## 下一步

→ [Claude Code 配置](/guide/cli/claude-code)  
→ [Codex 配置](/guide/cli/codex)  
→ [Grok Build 配置](/guide/cli/grok-build)  
→ [Gemini 配置](/guide/cli/gemini)  
→ [WSL 配置](/guide/cli/wsl)
