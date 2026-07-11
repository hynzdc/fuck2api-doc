# OAI 对话接口对接文档

> 适用场景：通过 fuck2api 调用 OpenAI 兼容的对话接口。  
> fuck2api 域名：`https://fxxkapi.top`  
> 文档核对日期：2026-07-11

---

## 1. 接口概览

fuck2api 提供 OpenAI 兼容接口。直接发送 HTTP 请求时，请使用带 `/v1` 的 API Base URL：

```text
https://fxxkapi.top/v1
```

常用接口：

| 功能 | 方法 | 接口地址 |
|---|---:|---|
| 查询可用模型 | GET | `https://fxxkapi.top/v1/models` |
| 对话补全 | POST | `https://fxxkapi.top/v1/chat/completions` |

> **Base URL 容易混淆的地方**
>
> - 如果软件要求填写“站点域名”，并由软件自动拼接 `/v1`，填写：`https://fxxkapi.top`
> - 如果软件或 SDK 要求填写 OpenAI `baseURL` / `base_url`，通常填写：`https://fxxkapi.top/v1`
> - 不要把 Base URL 填成 `.../chat/completions`，接口路径应由 SDK 自动拼接。

---

## 2. 鉴权方式

推荐使用 Bearer Token：

```http
Authorization: Bearer YOUR_API_KEY
```

fuck2api 同时支持以下请求头形式，但建议统一使用 `Authorization`：

```http
x-api-key: YOUR_API_KEY
```

所有 JSON 请求均应携带：

```http
Content-Type: application/json
```

完整请求头示例：

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

> API Key 必须仅保存在服务端或安全的环境变量中，不要写入浏览器前端代码、公开仓库或客户端安装包。

---

## 3. 查询可用模型

不同账号、渠道和套餐可调用的模型可能不同，因此接入前应先查询模型列表，不建议在业务代码中盲目写死模型名称。

### 请求

```bash
curl --request GET 'https://fxxkapi.top/v1/models' \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

### OpenAI 兼容响应示例

```json
{
  "object": "list",
  "data": [
    {
      "id": "MODEL_ID",
      "object": "model",
      "owned_by": "provider"
    }
  ]
}
```

后续请求中的 `model` 应填写 `data[].id` 返回的实际模型 ID。

---

## 4. 普通对话

### 接口

```http
POST /v1/chat/completions
```

完整地址：

```text
https://fxxkapi.top/v1/chat/completions
```

### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| `model` | string | 是 | 模型 ID，建议从 `/v1/models` 获取 |
| `messages` | array | 是 | 对话消息数组 |
| `stream` | boolean | 否 | 是否使用 SSE 流式输出，默认 `false` |
| `temperature` | number | 否 | 随机性；是否支持及有效范围取决于具体模型 |
| `top_p` | number | 否 | 核采样参数；通常不建议与 `temperature` 同时大幅调整 |
| `max_tokens` | integer | 否 | 最大输出 Token；部分新模型可能使用其他输出上限字段，取决于渠道兼容性 |
| `stop` | string/array | 否 | 停止生成标记，是否支持取决于模型 |
| `tools` | array | 否 | 工具/函数定义，要求模型支持 Tool Calling |
| `tool_choice` | string/object | 否 | 工具选择策略 |
| `response_format` | object | 否 | JSON 输出格式，要求模型支持该功能 |
| `user` | string | 否 | 业务侧用户标识，不要传手机号等敏感明文 |

### `messages` 消息结构

| `role` | 用途 |
|---|---|
| `system` | 设置模型身份、规则或全局约束 |
| `user` | 用户输入 |
| `assistant` | 历史模型回复 |
| `tool` | 工具执行结果 |

### cURL 示例

```bash
curl --request POST 'https://fxxkapi.top/v1/chat/completions' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "model": "MODEL_ID",
    "messages": [
      {
        "role": "system",
        "content": "你是一个专业、简洁的中文助手。"
      },
      {
        "role": "user",
        "content": "请用三句话介绍上海。"
      }
    ],
    "stream": false
  }'
```

### 非流式响应示例

```json
{
  "id": "chatcmpl_xxx",
  "object": "chat.completion",
  "created": 1783760000,
  "model": "MODEL_ID",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "上海是中国重要的经济、金融和航运中心……"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 30,
    "completion_tokens": 55,
    "total_tokens": 85
  }
}
```

业务侧通常读取：

```text
choices[0].message.content
```

---

## 5. 多轮对话

Chat Completions 接口本身通常是无状态的。业务端需要保存历史消息，并在下一次请求时重新传入必要上下文。

```json
{
  "model": "MODEL_ID",
  "messages": [
    {
      "role": "system",
      "content": "你是一个中文旅行助手。"
    },
    {
      "role": "user",
      "content": "我准备去杭州玩两天。"
    },
    {
      "role": "assistant",
      "content": "可以安排西湖、灵隐寺和运河一带。"
    },
    {
      "role": "user",
      "content": "第二天不想走太多路，重新安排一下。"
    }
  ],
  "stream": false
}
```

建议：

1. 只保留当前任务真正需要的上下文。
2. 对较早消息进行摘要，避免上下文无限增长。
3. 不要完全依赖前端保存聊天记录，重要会话应存入服务端数据库。
4. 对用户输入、模型输出和 Token 使用量建立日志，但应脱敏。

---

## 6. 流式对话（SSE）

将 `stream` 设置为 `true`：

```bash
curl --no-buffer --request POST 'https://fxxkapi.top/v1/chat/completions' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "model": "MODEL_ID",
    "messages": [
      {
        "role": "user",
        "content": "写一段关于秋天的短文。"
      }
    ],
    "stream": true
  }'
```

典型 SSE 数据格式：

```text
data: {"choices":[{"delta":{"role":"assistant"},"index":0}]}

data: {"choices":[{"delta":{"content":"秋"},"index":0}]}

data: {"choices":[{"delta":{"content":"风"},"index":0}]}

data: [DONE]
```

处理规则：

1. 按行读取响应流。
2. 只处理以 `data:` 开头的行。
3. 收到 `data: [DONE]` 后结束读取。
4. 将每个数据块中的 `choices[0].delta.content` 依次拼接。
5. 流中断时不要直接重复扣费请求；应结合业务 ID、日志和重试策略处理。

---

## 7. JavaScript / Node.js 对接

### 安装 SDK

```bash
npm install openai
```

### 非流式调用

```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OAI_API_KEY,
  baseURL: "https://fxxkapi.top/v1",
});

const completion = await client.chat.completions.create({
  model: process.env.OAI_MODEL,
  messages: [
    { role: "system", content: "你是一个专业的中文助手。" },
    { role: "user", content: "解释什么是 REST API。" },
  ],
});

console.log(completion.choices[0]?.message?.content ?? "");
```

### 流式调用

```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OAI_API_KEY,
  baseURL: "https://fxxkapi.top/v1",
});

const stream = await client.chat.completions.create({
  model: process.env.OAI_MODEL,
  messages: [{ role: "user", content: "写一首四行短诗。" }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}
```

### `.env` 示例

```dotenv
OAI_API_KEY=YOUR_API_KEY
OAI_MODEL=MODEL_ID
```

---

## 8. Python 对接

### 安装 SDK

```bash
pip install openai
```

### 非流式调用

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OAI_API_KEY"],
    base_url="https://fxxkapi.top/v1",
)

completion = client.chat.completions.create(
    model=os.environ["OAI_MODEL"],
    messages=[
        {"role": "system", "content": "你是一个专业的中文助手。"},
        {"role": "user", "content": "解释什么是 REST API。"},
    ],
)

print(completion.choices[0].message.content)
```

### 流式调用

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OAI_API_KEY"],
    base_url="https://fxxkapi.top/v1",
)

stream = client.chat.completions.create(
    model=os.environ["OAI_MODEL"],
    messages=[{"role": "user", "content": "写一首四行短诗。"}],
    stream=True,
)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
```

---

## 9. Tool Calling（可选）

仅在所选模型和中转渠道支持 Tool Calling 时使用。

### 第一次请求：向模型声明工具

```json
{
  "model": "MODEL_ID",
  "messages": [
    {
      "role": "user",
      "content": "上海现在几点？"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_current_time",
        "description": "查询指定时区的当前时间",
        "parameters": {
          "type": "object",
          "properties": {
            "timezone": {
              "type": "string",
              "description": "IANA 时区，例如 Asia/Shanghai"
            }
          },
          "required": ["timezone"]
        }
      }
    }
  ]
}
```

如果模型返回 `tool_calls`，业务端应：

1. 解析工具名和参数。
2. 在自己的服务端执行工具。
3. 将原 assistant 消息和对应的 `tool` 结果追加到 `messages`。
4. 再次调用 `/v1/chat/completions` 获取最终自然语言回复。

> 不要直接信任模型生成的工具参数。执行数据库、支付、文件和系统命令前必须进行白名单校验和权限检查。

---

## 10. 错误处理

错误响应可能采用 OpenAI 风格：

```json
{
  "error": {
    "message": "Invalid API key",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}
```

也可能采用 fuck2api 自身格式，例如：

```json
{
  "code": "API_KEY_REQUIRED",
  "message": "API key is required in Authorization header"
}
```

客户端应同时兼容：

```text
error.message
message
code
```

常见 HTTP 状态码：

| 状态码 | 含义 | 建议处理 |
|---:|---|---|
| `400` | 参数、消息格式或模型参数错误 | 检查请求 JSON，不要自动重试 |
| `401` | 未携带 Key 或 Key 无效 | 检查 `Authorization: Bearer ...` |
| `403` | Key 无权限、渠道限制或账号受限 | 查询密钥权限及账号状态 |
| `404` | 路径或模型不存在 | 检查 `/v1`、接口路径及模型 ID |
| `429` | 请求过快、并发限制或额度不足 | 指数退避；同时检查余额与限额 |
| `500` | fuck2api 内部异常 | 短暂退避后重试并记录请求 ID |
| `502/503/504` | 上游异常、繁忙或超时 | 指数退避重试，限制最大次数 |

推荐重试策略：

- 仅对 `429`、`500`、`502`、`503`、`504` 和网络超时进行有限重试。
- 首次等待约 1 秒，随后使用指数退避并加入随机抖动。
- 最大重试次数建议 2～3 次。
- 对同一个用户操作设置业务请求 ID，避免网络重试导致重复提交。
- 记录响应头中的请求 ID（如存在），便于向 fuck2api 排查。

---

## 11. 服务端配置建议

```dotenv
OAI_BASE_URL=https://fxxkapi.top/v1
OAI_API_KEY=YOUR_API_KEY
OAI_MODEL=MODEL_ID
OAI_TIMEOUT_MS=120000
```

生产环境建议：

1. API Key 只保存在服务端密钥管理系统或环境变量中。
2. 在自己的服务端封装一层接口，浏览器不要直连 fuck2api。
3. 设置连接超时、读取超时、并发限制和单用户频率限制。
4. 定期调用 `/v1/models` 或通过后台配置更新模型 ID。
5. 记录模型、耗时、状态码、Token 使用量和业务请求 ID。
6. 日志中的 API Key、用户隐私及完整提示词应脱敏。

---

## 12. 最小联调清单

- [ ] `GET /v1/models` 能正常返回模型列表
- [ ] `POST /v1/chat/completions` 非流式请求成功
- [ ] `stream: true` 能持续接收 SSE 数据并识别 `[DONE]`
- [ ] 中文、长文本和多轮消息编码正常
- [ ] 401、429、超时和上游 5xx 已正确处理
- [ ] API Key 未暴露到前端、日志和 Git 仓库
- [ ] 已配置模型 ID、超时、并发与重试上限

---

## 13. 快速排错

### 返回 401

确认请求头严格为：

```http
Authorization: Bearer YOUR_API_KEY
```

### 返回 404

确认 SDK Base URL 是：

```text
https://fxxkapi.top/v1
```

而不是：

```text
https://fxxkapi.top/v1/chat/completions
```

### 提示模型不存在

先调用：

```http
GET https://fxxkapi.top/v1/models
```

然后使用返回的准确 `model` ID。

### SDK 请求出现双重 `/v1`

如果实际地址变成 `/v1/v1/chat/completions`，说明调用框架已经自动添加 `/v1`。此时将该框架中的站点地址改为：

```text
https://fxxkapi.top
```

具体以抓包得到的最终请求地址为准。

---

## 相关

- [生图接口文档对接](/api/images)
