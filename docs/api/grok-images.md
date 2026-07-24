---
date: 2026-07-24
---

# Grok 生图接口对接文档

## 1. 接口概览

fuck2api 提供 **Grok Imagine** 生图能力，接口形态兼容 OpenAI Images API。直接发送 HTTP 请求时，请使用带 `/v1` 的 API Base URL：

```text
https://fxxkapi.top/v1
```

常用接口：

| 功能 | 方法 | 接口地址 |
|---|---:|---|
| 查询可用模型 | GET | `https://fxxkapi.top/v1/models` |
| 文生图 | POST | `https://fxxkapi.top/v1/images/generations` |
| 图生图 / 多图参考 | POST | `https://fxxkapi.top/v1/images/edits` |

> **Base URL 容易混淆的地方**
>
> - 如果软件要求填写“站点域名”，并由软件自动拼接 `/v1`，填写：`https://fxxkapi.top`
> - 如果软件或 SDK 要求填写 OpenAI `baseURL` / `base_url`，通常填写：`https://fxxkapi.top/v1`
> - 不要把 Base URL 填成 `.../images/generations`，接口路径应由 SDK 自动拼接。

::: tip 提示
先在 [ApiKey 管理](/guide/apikey) 创建密钥，并确认余额充足。  
Grok 生图与 [OAI 生图](/api/images) 共用同一组路径，**区别主要在 `model` 与多图传参方式**。
:::

## 2. 鉴权方式

推荐使用 Bearer Token：

```http
Authorization: Bearer YOUR_API_KEY
```

完整请求头示例：

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

> API Key 必须仅保存在服务端或安全的环境变量中，不要写入浏览器前端代码、公开仓库或客户端安装包。

## 3. 可用模型

接入前建议先查询：

```bash
curl --request GET 'https://fxxkapi.top/v1/models' \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

当前站内常见的 Grok 生图相关模型（以你账号实际返回为准）：

| 模型 ID | 用途 | 实测 |
|---|---|---|
| `grok-imagine` | 文生图 / 图生图 / 多图参考（推荐） | 通过 |
| `grok-imagine-image` | 文生图 | 通过 |
| `grok-imagine-image-quality` | 文生图（质量档） | 通过 |
| `grok-imagine-edit` | 名称像编辑模型 | **上游 404，暂不推荐** |

业务代码中建议默认使用：

```text
grok-imagine
```

## 4. 文生图

### 接口

```http
POST /v1/images/generations
```

完整地址：

```text
https://fxxkapi.top/v1/images/generations
```

### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| `prompt` | string | 是 | 画面描述，支持中英文 |
| `model` | string | 是 | 推荐 `grok-imagine` |
| `n` | integer | 否 | 生成张数，默认 `1`；实测 `n=2` 可返回 2 张 |
| `size` | string | 否 | 如 `1024x1024`（可选） |
| `aspect_ratio` / `aspectRatio` | string | 否 | 画幅，如 `16:9`（可选，两种写法均可用） |
| `quality` | string | 否 | 质量档，如 `high`（可选） |
| `response_format` | string | 否 | 默认返回 `url`；也可设为 `b64_json` |

### cURL 示例

```bash
curl --request POST 'https://fxxkapi.top/v1/images/generations' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "model": "grok-imagine",
    "prompt": "一只穿着宇航服的橘猫漂浮在星空中，电影感光影",
    "n": 1
  }'
```

### 响应示例（默认 URL）

Grok 默认返回 **可访问的 `https://imgen.x.ai/...` 图片链接**，并带 `mime_type`：

```json
{
  "data": [
    {
      "url": "https://imgen.x.ai/xai-imgen/xai-tmp-imgen-xxxx.jpeg",
      "mime_type": "image/jpeg"
    }
  ],
  "usage": {
    "cost_in_usd_ticks": 500000000
  }
}
```

业务侧通常读取：

```text
data[0].url
```

### 响应示例（Base64）

```bash
curl --request POST 'https://fxxkapi.top/v1/images/generations' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "model": "grok-imagine",
    "prompt": "a blue circle icon",
    "response_format": "b64_json"
  }'
```

```json
{
  "data": [
    {
      "b64_json": "/9j/4AAQSkZJRgABAQAAAQABAAD/...",
      "mime_type": "image/jpeg"
    }
  ],
  "usage": {
    "cost_in_usd_ticks": 500000000
  }
}
```

::: tip 提示
- Grok 默认返回 **公网 URL**，与部分 OAI 模型默认返回 `b64_json` 不同
- `url` 可能有时效，生产环境建议尽快下载并转存到你自己的 OSS / CDN
- 响应中常见 `mime_type` 为 `image/jpeg`
- 生图超时建议设为 **120～300 秒**
:::

## 5. 图生图（单张）

### 接口

```http
POST /v1/images/edits
```

完整地址：

```text
https://fxxkapi.top/v1/images/edits
```

### 方式 A：multipart 上传本地文件（单张推荐）

```bash
curl --request POST 'https://fxxkapi.top/v1/images/edits' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --form 'model=grok-imagine' \
  --form 'prompt=把这张图改成赛博朋克霓虹风格' \
  --form 'image=@./source.jpg;type=image/jpeg'
```

### 方式 B：JSON + Data URL / 公网 URL

```bash
curl --request POST 'https://fxxkapi.top/v1/images/edits' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "model": "grok-imagine",
    "prompt": "把这张图改成水彩风格",
    "images": [
      {
        "image_url": "data:image/jpeg;base64,/9j/4AAQ..."
      }
    ]
  }'
```

也支持公网可访问地址：

```json
{
  "model": "grok-imagine",
  "prompt": "把这张图改成水彩风格",
  "images": [
    {
      "image_url": "https://imgen.x.ai/xai-imgen/xai-tmp-imgen-xxxx.jpeg"
    }
  ]
}
```

### 响应

与文生图一致，读取：

```text
data[0].url
# 或
data[0].b64_json
```

## 6. 多图生图 / 多参考图（重点）

Grok 多图参考**推荐走 JSON**，不要依赖 `multipart` 重复 `image[]`（实测容易被上游拒绝）。

### 推荐：`images[].image_url`

每张参考图放一个对象，字段名是 `image_url`，值可以是：

1. `data:image/png;base64,...` / `data:image/jpeg;base64,...`
2. 公网可访问的 `https://...` 图片地址

```bash
curl --request POST 'https://fxxkapi.top/v1/images/edits' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "model": "grok-imagine",
    "prompt": "把第一张图的主体和第二张图的配色融合，生成简洁产品图标",
    "images": [
      {
        "image_url": "data:image/jpeg;base64,/9j/4AAQ..."
      },
      {
        "image_url": "data:image/png;base64,iVBORw0KGgo..."
      }
    ]
  }'
```

### 兼容：`image` 传字符串数组

```json
{
  "model": "grok-imagine",
  "prompt": "融合这两张参考图生成简洁图标",
  "image": [
    "data:image/png;base64,iVBORw0KGgo...",
    "data:image/png;base64,iVBORw0KGgo..."
  ]
}
```

### 本地多图如何转 Data URL

```python
import base64
from pathlib import Path

def to_data_url(path: str) -> str:
    p = Path(path)
    mime = "image/png" if p.suffix.lower() == ".png" else "image/jpeg"
    b64 = base64.b64encode(p.read_bytes()).decode()
    return f"data:{mime};base64,{b64}"

images = [
    {"image_url": to_data_url("./person.jpg")},
    {"image_url": to_data_url("./style.png")},
    {"image_url": to_data_url("./bg.jpg")},
]
```

::: tip 多图对接约定（已实测）
1. **优先 JSON**：`images: [{ "image_url": "..." }, ...]`
2. Data URL 必须带完整前缀：`data:image/png;base64,` 或 `data:image/jpeg;base64,`
3. 公网 URL 也可以，但服务端必须能访问该地址
4. 在 `prompt` 中写清「第 1 张 / 第 2 张」各自作用更稳
5. `multipart` 单图可用；**多图重复 `image[]` 对 Grok 不稳定，不推荐**
6. 模型请用 `grok-imagine`，不要用会 404 的 `grok-imagine-edit`
:::

## 7. JavaScript / Node.js 对接

### 安装

```bash
npm install openai
```

### 文生图

```js
import OpenAI from "openai";
import fs from "node:fs";

const client = new OpenAI({
  apiKey: process.env.OAI_API_KEY,
  baseURL: "https://fxxkapi.top/v1",
  timeout: 180_000,
});

const result = await client.images.generate({
  model: "grok-imagine",
  prompt: "一只穿着宇航服的橘猫漂浮在星空中，电影感光影",
  n: 1,
});

console.log(result.data[0]?.url ?? "");
```

### 多图参考（推荐原生 fetch + JSON）

OpenAI 官方 SDK 对 Grok 多图 JSON 字段兼容不一定完整，生产环境可用 `fetch`：

```js
import fs from "node:fs";

function toDataUrl(filePath, mime = "image/png") {
  const b64 = fs.readFileSync(filePath).toString("base64");
  return `data:${mime};base64,${b64}`;
}

const payload = {
  model: "grok-imagine",
  prompt: "把第一张人像和第二张场景融合，生成电影感海报",
  images: [
    { image_url: toDataUrl("./person.jpg", "image/jpeg") },
    { image_url: toDataUrl("./background.png", "image/png") },
  ],
};

const res = await fetch("https://fxxkapi.top/v1/images/edits", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.OAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

const data = await res.json();
console.log(data.data?.[0]?.url ?? data);
```

## 8. Python 对接

### 安装

```bash
pip install openai requests
```

### 文生图

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OAI_API_KEY"],
    base_url="https://fxxkapi.top/v1",
    timeout=180.0,
)

result = client.images.generate(
    model="grok-imagine",
    prompt="一只穿着宇航服的橘猫漂浮在星空中，电影感光影",
    n=1,
)

print(result.data[0].url)
```

### 多图参考

```python
import os
import base64
from pathlib import Path
import requests

def to_data_url(path: str) -> str:
    p = Path(path)
    mime = "image/png" if p.suffix.lower() == ".png" else "image/jpeg"
    b64 = base64.b64encode(p.read_bytes()).decode()
    return f"data:{mime};base64,{b64}"

payload = {
    "model": "grok-imagine",
    "prompt": "把第一张人像和第二张场景融合，生成电影感海报",
    "images": [
        {"image_url": to_data_url("./person.jpg")},
        {"image_url": to_data_url("./background.png")},
    ],
}

resp = requests.post(
    "https://fxxkapi.top/v1/images/edits",
    headers={"Authorization": f"Bearer {os.environ['OAI_API_KEY']}"},
    json=payload,
    timeout=180,
)
data = resp.json()
print(data["data"][0]["url"])
```

### 单图 multipart 编辑

```python
import os
import requests

with open("./source.jpg", "rb") as f:
    resp = requests.post(
        "https://fxxkapi.top/v1/images/edits",
        headers={"Authorization": f"Bearer {os.environ['OAI_API_KEY']}"},
        data={
            "model": "grok-imagine",
            "prompt": "改成赛博朋克霓虹风格",
        },
        files={
            "image": ("source.jpg", f, "image/jpeg"),
        },
        timeout=180,
    )

print(resp.json()["data"][0]["url"])
```

## 9. 错误处理

错误响应可能类似：

```json
{
  "error": {
    "message": "xAI upstream returned status 400",
    "type": "invalid_request_error"
  }
}
```

常见状态码：

| 状态码 | 含义 | 建议处理 |
|---:|---|---|
| `400` | 参数不合法 / 多图格式不对 | 检查 `images[].image_url` 是否为完整 Data URL 或可访问 URL |
| `401` | Key 无效 | 检查 `Authorization: Bearer ...` |
| `404` | 模型或上游路径不存在 | 换 `grok-imagine`，不要用会 404 的模型名 |
| `415` | 内容类型不支持 | 文生图用 JSON；本地上传编辑用 multipart |
| `422` | 上游无法处理当前字段结构 | 改用本文推荐的 `images[].image_url` 格式 |
| `429` | 限流或额度问题 | 退避重试并检查余额 |
| `500/502/503/504` | 服务或上游异常 | 有限次指数退避重试 |

## 10. 服务端配置建议

```dotenv
OAI_BASE_URL=https://fxxkapi.top/v1
OAI_API_KEY=YOUR_API_KEY
GROK_IMAGE_MODEL=grok-imagine
OAI_TIMEOUT_MS=180000
```

生产环境建议：

1. API Key 只放在服务端
2. 拿到 `url` 后尽快转存到自己的 OSS
3. 多图场景统一封装「本地文件 → Data URL」工具函数
4. 对提示词做基础内容审查
5. 记录模型、耗时、状态码、业务请求 ID

## 11. 最小联调清单

- [ ] `GET /v1/models` 能看到 `grok-imagine`
- [ ] `POST /v1/images/generations` 返回 `data[0].url`
- [ ] （可选）`response_format=b64_json` 返回 `data[0].b64_json`
- [ ] 单图 `POST /v1/images/edits` multipart 成功
- [ ] 多图 JSON：`images[].image_url` 成功
- [ ] 超时、401、400、上游 5xx 已处理
- [ ] API Key 未暴露到前端 / Git

## 12. 快速排错

### 多图一直 400

1. 不要用 `multipart` 重复 `image[]`
2. 改用 JSON：

```json
{
  "model": "grok-imagine",
  "prompt": "...",
  "images": [
    { "image_url": "data:image/png;base64,...." },
    { "image_url": "data:image/png;base64,...." }
  ]
}
```

3. 确认 Data URL 里有逗号分隔的 `base64,` 部分

### 模型 404

不要使用 `grok-imagine-edit`（实测上游 404）。统一用：

```text
grok-imagine
```

### 拿到 URL 后打不开

- `imgen.x.ai` 临时链可能有时效，尽快下载转存
- 检查业务服务器是否可访问外网图片域名

## 相关

- [OAI 生图接口对接](/api/images)
- [OAI 对话接口对接](/api/overview)
- [Grok Build 配置](/guide/cli/grok-build)
- [ApiKey 管理](/guide/apikey)
