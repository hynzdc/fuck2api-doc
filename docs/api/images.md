---
date: 2026-07-24
---

# OAI 生图接口对接文档

## 1. 接口概览

fuck2api 提供 **OpenAI 兼容** 的图片生成接口。直接发送 HTTP 请求时，请使用带 `/v1` 的 API Base URL：

```text
https://fxxkapi.top/v1
```

常用接口：

| 功能 | 方法 | 接口地址 |
|---|---:|---|
| 查询可用模型 | GET | `https://fxxkapi.top/v1/models` |
| 文生图 | POST | `https://fxxkapi.top/v1/images/generations` |
| 图生图 / 编辑 | POST | `https://fxxkapi.top/v1/images/edits` |

> **Base URL 容易混淆的地方**
>
> - 如果软件要求填写“站点域名”，并由软件自动拼接 `/v1`，填写：`https://fxxkapi.top`
> - 如果软件或 SDK 要求填写 OpenAI `baseURL` / `base_url`，通常填写：`https://fxxkapi.top/v1`
> - 不要把 Base URL 填成 `.../images/generations`，接口路径应由 SDK 自动拼接。

::: tip 提示
先在 [ApiKey 管理](/guide/apikey) 创建密钥，并确认余额充足。  
`model` 请填写控制台或 `/v1/models` 中真实存在的生图模型 ID，不同账号可见模型可能不同。
:::

## 2. 鉴权方式

推荐使用 Bearer Token：

```http
Authorization: Bearer YOUR_API_KEY
```

fuck2api 同时支持以下请求头形式，但建议统一使用 `Authorization`：

```http
x-api-key: YOUR_API_KEY
```

JSON 请求均应携带：

```http
Content-Type: application/json
```

完整请求头示例：

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

> API Key 必须仅保存在服务端或安全的环境变量中，不要写入浏览器前端代码、公开仓库或客户端安装包。

## 3. 查询可用模型

接入前建议先查询模型列表，确认当前密钥可用的生图模型 ID。

### 请求

```bash
curl --request GET 'https://fxxkapi.top/v1/models' \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

### 响应示例

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

后续请求中的 `model` 应填写 `data[].id` 返回的实际模型 ID。当前站内常见的生图模型（以你账号实际返回为准）：

- `gpt-image-1`
- `gpt-image-1.5`
- `gpt-image-2`

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
| `model` | string | 是 | 生图模型 ID，建议从 `/v1/models` 获取，例如 `gpt-image-1` |
| `n` | integer | 否 | 生成张数，默认 `1`；是否支持多图取决于模型 |
| `size` | string | 否 | 输出尺寸，常见如 `1024x1024`；以模型支持为准 |
| `quality` | string | 否 | 清晰度档位，常见如 `standard` / `hd`，或模型自定义档位；以渠道为准 |
| `response_format` | string | 否 | `b64_json` 或 `url`。**当前默认更常见返回 `b64_json`** |
| `style` | string | 否 | 风格参数（部分模型支持，如 `vivid` / `natural`） |
| `user` | string | 否 | 业务侧用户标识，不要传手机号等敏感明文 |

### cURL 示例

```bash
curl --request POST 'https://fxxkapi.top/v1/images/generations' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "model": "gpt-image-1",
    "prompt": "一只穿着宇航服的橘猫漂浮在星空中，电影感光影，超清细节",
    "n": 1,
    "size": "1024x1024"
  }'
```

### 响应示例（推荐读取 Base64）

当前站实测：多数情况下会直接返回 `b64_json`（即使未显式指定 `response_format`）：

```json
{
  "created": 1783760000,
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAA...",
      "revised_prompt": "A cinematic orange cat in a spacesuit floating in space..."
    }
  ]
}
```

### 响应示例（`response_format: "url"`）

当显式传入 `"response_format": "url"` 时，字段名是 `url`，但内容**可能是 `data:image/png;base64,...` 形式的 Data URL**，不一定是可公网访问的 `https://...` 临时链接：

```json
{
  "created": 1783760000,
  "data": [
    {
      "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "revised_prompt": "..."
    }
  ]
}
```

业务侧推荐读取顺序：

```text
data[0].b64_json   # 优先
data[0].url        # 其次；若以 data:image 开头，按 Data URL 解码保存
```

把 Base64 落盘示例（Python）：

```python
import base64
from pathlib import Path

b64 = result["data"][0]["b64_json"]
Path("out.png").write_bytes(base64.b64decode(b64))
```

::: tip 提示
- 部分模型会改写提示词，响应中常包含 `revised_prompt`
- **优先按 `b64_json` 对接**，业务侧自行上传到你自己的 OSS / CDN
- 若拿到 `url` 且以 `data:image` 开头，不要当普通 HTTP 链接去 `GET`
- 生图耗时通常比对话更长，建议超时时间设到 **120～300 秒**
:::

## 5. 图生图 / 编辑

### 接口

```http
POST /v1/images/edits
```

完整地址：

```text
https://fxxkapi.top/v1/images/edits
```

该接口用于基于已有图片做编辑、局部重绘、风格迁移或**多参考图融合**。请求使用 `multipart/form-data`（不要用纯 JSON 直接塞二进制文件）。

### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| `image` / `image[]` | file / file[] | 是 | 参考图。单张用 `image`；**多张参考图请重复传 `image[]`（推荐）或重复传 `image`** |
| `prompt` | string | 是 | 希望如何修改 / 融合画面 |
| `model` | string | 是 | 支持编辑 / 多图参考能力的模型 ID |
| `mask` | file | 否 | 蒙版图；透明区域表示需要重绘的部分（通常只配合**单张**主图使用） |
| `n` | integer | 否 | 生成张数，默认 `1` |
| `size` | string | 否 | 输出尺寸 |
| `response_format` | string | 否 | `url` 或 `b64_json` |
| `user` | string | 否 | 业务侧用户标识 |

### 单张参考图

```bash
curl --request POST 'https://fxxkapi.top/v1/images/edits' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --form 'model=MODEL_ID' \
  --form 'prompt=把这张人像改成赛博朋克风格，霓虹灯夜景' \
  --form 'image=@./portrait.png' \
  --form 'n=1' \
  --form 'size=1024x1024' \
  --form 'response_format=url'
```

### 上传多张参考图（重点）

需要多张图时，在同一个 `multipart/form-data` 请求里**重复提交文件字段**即可。推荐写法与 OpenAI 官方一致，使用 `image[]`：

```bash
curl --request POST 'https://fxxkapi.top/v1/images/edits' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --form 'model=MODEL_ID' \
  --form 'prompt=把第一张人像和第二张场景融合，生成电影感海报' \
  --form 'image[]=@./person.png' \
  --form 'image[]=@./background.jpg' \
  --form 'image[]=@./style-ref.png' \
  --form 'n=1' \
  --form 'size=1024x1024' \
  --form 'response_format=url'
```

也兼容重复字段名 `image`（部分客户端 / 网关更习惯这种写法）：

```bash
curl --request POST 'https://fxxkapi.top/v1/images/edits' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --form 'model=MODEL_ID' \
  --form 'prompt=参考这几张图，生成统一风格的产品图' \
  --form 'image=@./ref1.png' \
  --form 'image=@./ref2.png' \
  --form 'image=@./ref3.png'
```

::: tip 多图对接约定（已实测）
1. **Content-Type 必须是 `multipart/form-data`**，由客户端自动生成 boundary，不要手写假 boundary。
2. **`image[]` 与重复 `image` 两种写法均可用**（站内已实测返回 `200` + `b64_json`）。
3. 多张图的顺序通常有意义：第一张常被当作主体 / 构图参考，后续为风格、背景或细节参考；在 `prompt` 里写清楚「第 1 张 / 第 2 张」更稳。
4. 单张大小、总张数上限取决于具体模型与渠道。超限会返回 `400`。
5. 支持格式一般以 `image/png`、`image/jpeg`、`image/webp` 为主。
6. `mask` 主要用于单图局部重绘，多参考图场景通常不必同时传 `mask`。
7. 响应读取方式与文生图一致：优先 `data[0].b64_json`。
:::

### 蒙版局部重绘（单图）

```bash
curl --request POST 'https://fxxkapi.top/v1/images/edits' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --form 'model=MODEL_ID' \
  --form 'prompt=把蒙版区域换成蓝天白云' \
  --form 'image=@./photo.png' \
  --form 'mask=@./mask.png'
```

### 响应示例

与文生图一致，读取 `data[0].url` 或 `data[0].b64_json` 即可。
## 6. JavaScript / Node.js 对接

### 安装 SDK

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
  model: process.env.OAI_IMAGE_MODEL || "gpt-image-1",
  prompt: "一只穿着宇航服的橘猫漂浮在星空中，电影感光影",
  n: 1,
  size: "1024x1024",
});

// 当前站优先返回 b64_json
const item = result.data[0] || {};
if (item.b64_json) {
  fs.writeFileSync("out.png", Buffer.from(item.b64_json, "base64"));
  console.log("saved out.png");
} else {
  console.log(item.url ?? "");
}
```

### 图生图 / 编辑（单张）

```js
import OpenAI from "openai";
import fs from "node:fs";

const client = new OpenAI({
  apiKey: process.env.OAI_API_KEY,
  baseURL: "https://fxxkapi.top/v1",
  timeout: 180_000,
});

const result = await client.images.edit({
  model: process.env.OAI_IMAGE_MODEL || "gpt-image-1",
  image: fs.createReadStream("./portrait.png"),
  prompt: "把这张人像改成赛博朋克风格，霓虹灯夜景",
  n: 1,
  size: "1024x1024",
});

const item = result.data[0] || {};
if (item.b64_json) {
  fs.writeFileSync("edited.png", Buffer.from(item.b64_json, "base64"));
} else {
  console.log(item.url ?? "");
}
```

### 图生图 / 编辑（多张参考图）

若所用 OpenAI SDK 版本支持把 `image` 传成数组，可直接：

```js
import OpenAI from "openai";
import fs from "node:fs";

const client = new OpenAI({
  apiKey: process.env.OAI_API_KEY,
  baseURL: "https://fxxkapi.top/v1",
  timeout: 180_000,
});

const result = await client.images.edit({
  model: process.env.OAI_IMAGE_MODEL || "gpt-image-1",
  // 多张参考图：按数组传入
  image: [
    fs.createReadStream("./person.png"),
    fs.createReadStream("./background.jpg"),
    fs.createReadStream("./style-ref.png"),
  ],
  prompt: "把第一张人像和第二张场景融合，风格参考第三张，生成电影感海报",
  n: 1,
  size: "1024x1024",
});

const item = result.data[0] || {};
if (item.b64_json) {
  fs.writeFileSync("merged.png", Buffer.from(item.b64_json, "base64"));
} else {
  console.log(item.url ?? "");
}
```

若当前 SDK 不方便传多文件数组，可用原生 `FormData` / `fetch` 重复追加 `image[]`：

```js
const form = new FormData();
form.append("model", process.env.OAI_IMAGE_MODEL);
form.append("prompt", "参考这几张图，生成统一风格的产品图");
form.append("n", "1");
form.append("size", "1024x1024");

// 关键：多次 append 同一个字段名
for (const file of ["./ref1.png", "./ref2.png", "./ref3.png"]) {
  form.append("image[]", fs.createReadStream(file));
  // 若上游不认 image[]，改成 form.append("image", ...)
}

const res = await fetch("https://fxxkapi.top/v1/images/edits", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.OAI_API_KEY}`,
    // 不要手动设置 Content-Type，fetch 会自动带 multipart boundary
  },
  body: form,
});

const data = await res.json();
const item = data.data?.[0] || {};
if (item.b64_json) {
  fs.writeFileSync("merged.png", Buffer.from(item.b64_json, "base64"));
} else {
  console.log(item.url ?? data);
}
```
### `.env` 示例

```dotenv
OAI_API_KEY=YOUR_API_KEY
OAI_IMAGE_MODEL=MODEL_ID
OAI_BASE_URL=https://fxxkapi.top/v1
```

## 7. Python 对接

### 安装 SDK

```bash
pip install openai
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
    model=os.environ.get("OAI_IMAGE_MODEL", "gpt-image-1"),
    prompt="一只穿着宇航服的橘猫漂浮在星空中，电影感光影",
    n=1,
    size="1024x1024",
)

item = result.data[0]
if item.b64_json:
    from pathlib import Path
    import base64

    Path("out.png").write_bytes(base64.b64decode(item.b64_json))
    print("saved out.png")
else:
    print(item.url)
```

### 图生图 / 编辑（单张）

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OAI_API_KEY"],
    base_url="https://fxxkapi.top/v1",
    timeout=180.0,
)

with open("./portrait.png", "rb") as image_file:
    result = client.images.edit(
        model=os.environ.get("OAI_IMAGE_MODEL", "gpt-image-1"),
        image=image_file,
        prompt="把这张人像改成赛博朋克风格，霓虹灯夜景",
        n=1,
        size="1024x1024",
    )

item = result.data[0]
if item.b64_json:
    from pathlib import Path
    import base64

    Path("edited.png").write_bytes(base64.b64decode(item.b64_json))
else:
    print(item.url)
```

### 图生图 / 编辑（多张参考图）

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OAI_API_KEY"],
    base_url="https://fxxkapi.top/v1",
    timeout=180.0,
)

paths = ["./person.png", "./background.jpg", "./style-ref.png"]
files = [open(p, "rb") for p in paths]

try:
    result = client.images.edit(
        model=os.environ.get("OAI_IMAGE_MODEL", "gpt-image-1"),
        # 多张参考图：传文件对象列表
        image=files,
        prompt="把第一张人像和第二张场景融合，风格参考第三张，生成电影感海报",
        n=1,
        size="1024x1024",
    )
    item = result.data[0]
    if item.b64_json:
        from pathlib import Path
        import base64

        Path("merged.png").write_bytes(base64.b64decode(item.b64_json))
    else:
        print(item.url)
finally:
    for f in files:
        f.close()
```

若 SDK 版本不支持 `image` 传列表，可用 `requests` 直接上传多个文件字段：

```python
import os
import requests

files = [
    ("image[]", ("person.png", open("./person.png", "rb"), "image/png")),
    ("image[]", ("background.jpg", open("./background.jpg", "rb"), "image/jpeg")),
    ("image[]", ("style-ref.png", open("./style-ref.png", "rb"), "image/png")),
]
data = {
    "model": os.environ.get("OAI_IMAGE_MODEL", "gpt-image-1"),
    "prompt": "把第一张人像和第二张场景融合，风格参考第三张",
    "n": "1",
    "size": "1024x1024",
}

try:
    resp = requests.post(
        "https://fxxkapi.top/v1/images/edits",
        headers={"Authorization": f"Bearer {os.environ['OAI_API_KEY']}"},
        data=data,
        files=files,
        timeout=180,
    )
    payload = resp.json()
    item = (payload.get("data") or [{}])[0]
    if item.get("b64_json"):
        from pathlib import Path
        import base64

        Path("merged.png").write_bytes(base64.b64decode(item["b64_json"]))
        print("saved merged.png")
    else:
        print(payload)
finally:
    for _, file_tuple in files:
        file_tuple[1].close()
```
## 8. 错误处理

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
  "code": "INVALID_API_KEY",
  "message": "Invalid API key"
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
| `400` | 参数错误、尺寸不支持、图片格式不对 | 检查 `prompt` / `size` / 文件字段，不要盲目重试 |
| `401` | 未携带 Key 或 Key 无效 | 检查 `Authorization: Bearer ...` |
| `403` | Key 无权限、渠道限制或账号受限 | 查询密钥权限及账号状态 |
| `404` | 路径或模型不存在 | 检查 `/v1`、接口路径及模型 ID |
| `429` | 请求过快、并发限制或额度不足 | 指数退避；同时检查余额与限额 |
| `500` | fuck2api 内部异常 | 短暂退避后重试并记录请求 ID |
| `502/503/504` | 上游异常、繁忙或超时 | 指数退避重试，限制最大次数 |

推荐重试策略：

- 仅对 `429`、`500`、`502`、`503`、`504` 和网络超时进行有限重试。
- 首次等待约 1～2 秒，随后使用指数退避并加入随机抖动。
- 最大重试次数建议 2～3 次。
- 对同一个用户操作设置业务请求 ID，避免网络重试导致重复扣费。
- 生图成本较高，失败重试前先确认是否已生成成功（例如是否已拿到 `url`）。

## 9. 服务端配置建议

```dotenv
OAI_BASE_URL=https://fxxkapi.top/v1
OAI_API_KEY=YOUR_API_KEY
OAI_IMAGE_MODEL=MODEL_ID
OAI_TIMEOUT_MS=180000
```

生产环境建议：

1. API Key 只保存在服务端密钥管理系统或环境变量中。
2. 在自己的服务端封装一层接口，浏览器不要直连 fuck2api。
3. 生图超时建议设置为 **120～300 秒**，并限制单用户并发。
4. 拿到图片 URL 后尽快下载并转存到你自己的 OSS / CDN。
5. 记录模型、耗时、状态码、张数和业务请求 ID。
6. 对提示词做基础内容审查，避免违规内容导致请求失败且可能扣费。
7. 日志中的 API Key、用户隐私及完整提示词应脱敏。

## 10. 最小联调清单

- [ ] `GET /v1/models` 能看到可用的生图模型 ID（如 `gpt-image-1`）
- [ ] `POST /v1/images/generations` 能返回 `data[0].b64_json`（或 `url`）
- [ ] 能把 `b64_json` 正确解码并保存为图片文件
- [ ] 中文 prompt 生成正常
- [ ] （如需）`POST /v1/images/edits` 单张图编辑成功
- [ ] （如需）多张参考图：重复传 `image[]` / `image` 成功
- [ ] 超时、401、429、上游 5xx 已正确处理
- [ ] API Key 未暴露到前端、日志和 Git 仓库
- [ ] 已配置合理超时、并发与重试上限

## 11. 快速排错

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
https://fxxkapi.top/v1/images/generations
```

### 提示模型不存在

先调用：

```http
GET https://fxxkapi.top/v1/models
```

然后使用返回的准确 `model` ID。不要写死未开通的模型名。

### 请求超时

生图比对话慢，请提高客户端超时：

- cURL：`--max-time 180`
- OpenAI Node SDK：`timeout: 180_000`
- OpenAI Python SDK：`timeout=180.0`

### SDK 请求出现双重 `/v1`

如果实际地址变成 `/v1/v1/images/generations`，说明调用框架已经自动添加 `/v1`。此时将该框架中的站点地址改为：

```text
https://fxxkapi.top
```

具体以抓包得到的最终请求地址为准。

### 拿到 URL 后图片打不开

- 确认是否使用了临时 URL，需尽快下载转存
- 检查业务服务器是否能访问图片域名
- 若使用 `b64_json`，按 Base64 解码后保存为图片文件

### 多图上传只生效一张 / 报参数错误

1. 确认使用的是 `multipart/form-data`，而不是 JSON body。
2. 多张图应**重复字段**上传，例如多次 `--form 'image[]=@file.png'`，而不是把多张图塞进一个字段。
3. 先试 `image[]`；若客户端不支持 `[]` 字段名，再改用重复的 `image`。
4. 检查单张大小、总张数是否超过模型限制。
5. 在 `prompt` 中明确写出「第 1 张 / 第 2 张」各自作用，减少模型误用参考图。

## 相关

- [OAI 对话接口对接](/api/overview)
- [ApiKey 管理](/guide/apikey)
- [充值](/guide/recharge)
