<template>
  <section class="f2-hero">
    <div class="f2-hero__glow" aria-hidden="true" />
    <div class="f2-hero__inner">
      <div class="f2-badge-row">
        <span class="f2-pill f2-pill--live">服务在线</span>
        <span class="f2-pill">OpenAI 兼容</span>
        <span class="f2-pill">Claude · GPT · Gemini</span>
        <span class="f2-pill">99.9% SLA</span>
      </div>

      <h1>
        统一接入顶级 AI<br />
        <span class="grad">从 fuck2api 开始</span>
      </h1>

      <p class="f2-hero__sub">
        极简 API · 极致性能 · 企业级稳定性。一份文档学会 Claude Code、Codex、Gemini CLI
        与任意 OpenAI 兼容客户端的完整接入。
      </p>

      <div class="f2-hero__actions">
        <a class="f2-btn f2-btn--primary" href="/guide/intro">🚀 快速开始</a>
        <a class="f2-btn f2-btn--ghost" href="/api/overview">📡 API 参考</a>
        <a class="f2-btn f2-btn--ghost" href="/guide/clients/overview">🧩 客户端接入</a>
      </div>

      <div class="f2-stats">
        <div class="f2-stat">
          <div class="f2-stat__value">20+</div>
          <div class="f2-stat__label">主流模型</div>
        </div>
        <div class="f2-stat">
          <div class="f2-stat__value">&lt;50ms</div>
          <div class="f2-stat__label">网关延迟</div>
        </div>
        <div class="f2-stat">
          <div class="f2-stat__value">1 Key</div>
          <div class="f2-stat__label">统一鉴权</div>
        </div>
        <div class="f2-stat">
          <div class="f2-stat__value">99.9%</div>
          <div class="f2-stat__label">可用性</div>
        </div>
      </div>

      <div class="f2-terminal">
        <div class="f2-terminal__bar">
          <span class="f2-terminal__dot f2-terminal__dot--r" />
          <span class="f2-terminal__dot f2-terminal__dot--y" />
          <span class="f2-terminal__dot f2-terminal__dot--g" />
          <span class="f2-terminal__title">~ curl chat.completions</span>
        </div>
        <pre class="f2-terminal__body"><span class="cm"># 一行命令验证接入</span>
curl https://fxxkapi.top/v1/chat/completions \
  -H <span class="str">"Authorization: Bearer sk-xxx"</span> \
  -H <span class="str">"Content-Type: application/json"</span> \
  -d <span class="str">'{
    "model": "gpt-4o",
    "messages": [{"role":"user","content":"你好"}]
  }'</span>

<span class="ok">✓ 200 OK</span>  <span class="kw">latency</span>=<span class="num">42ms</span>  <span class="kw">tokens</span>=<span class="num">128</span></pre>
      </div>
    </div>
  </section>
</template>
