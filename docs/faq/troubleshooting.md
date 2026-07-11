# 故障排查

按顺序执行，多数问题 10 分钟内可定位。

## 1. 最小复现

```bash
export F2_API_KEY="你的key"
export F2_BASE_URL="https://fxxkapi.top/v1"

curl -sS -D - "$F2_BASE_URL/models" \
  -H "Authorization: Bearer $F2_API_KEY" -o /tmp/f2-models.json

head -n 20 /tmp/f2-models.json
```

| 结果 | 结论 |
| --- | --- |
| 200 + 模型列表 | 网关与 Key 正常，问题在客户端配置 |
| 401 | Key / Header 问题 |
| 超时 | 网络 / DNS / 防火墙 |
| 5xx | 服务端或上游，看状态页与日志 |

## 2. 检查网络

```bash
# DNS
dig fxxkapi.top +short

# TLS / 连通
curl -vI https://fxxkapi.top/v1/models
```

## 3. 检查客户端实际发出的请求

在代理工具（如 Proxyman / mitmproxy）或应用调试日志中确认：

- URL
- Authorization
- model
- body 是否合法 JSON

## 4. 对照错误码

见 [故障排查](/faq/troubleshooting)。

## 5. 隔离变量

一次只改一个因素：

1. 换 cURL 验证
2. 换模型
3. 换 Key
4. 换网络（关代理 / 开代理）
5. 换客户端

## 6. 收集信息提工单

请提供：

- 请求时间（UTC）
- `request_id`（若有）
- HTTP 状态码与错误 JSON
- 模型名
- 客户端名称与版本
- 是否流式

**不要** 发送完整 API Key。

## 快速自检表

- [ ] cURL `/v1/models` 成功
- [ ] cURL chat 成功
- [ ] 余额 > 0
- [ ] 模型在列表中
- [ ] 客户端 Base URL 正确
- [ ] 无公司 SSL 解密异常
