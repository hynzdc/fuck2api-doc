import { defineConfig } from 'vitepress'

/** Shared guide sidebar — includes FAQ group so it stays visible in left nav */
const guideSidebar = [
  {
    text: '<span class="f2-sb-ico f2-sb-ico--rocket" aria-hidden="true"></span>快速开始',
    collapsed: false,
    items: [
      {
        text: '<span class="f2-sb-ico f2-sb-ico--intro" aria-hidden="true"></span>Fuck2API简介',
        link: '/guide/intro',
      },
      {
        text: '<span class="f2-sb-ico f2-sb-ico--recharge" aria-hidden="true"></span>充值',
        link: '/guide/recharge',
      },
      {
        text: '<span class="f2-sb-ico f2-sb-ico--apikey" aria-hidden="true"></span>ApiKey 管理',
        link: '/guide/apikey',
      },
      {
        text: '<span class="f2-sb-ico f2-sb-ico--steps" aria-hidden="true"></span>通用步骤',
        link: '/guide/common-steps',
      },
    ],
  },
  {
    text: '<span class="f2-sb-ico f2-sb-ico--terminal" aria-hidden="true"></span>CLI 配置',
    collapsed: false,
    items: [
      {
        text: '<img class="f2-sb-icon" src="/icons/cc-switch.png" alt="" />CC-Switch 配置',
        link: '/guide/cc-switch',
      },
      {
        text: '<img class="f2-sb-icon f2-sb-icon--claude" src="/icons/claude.svg" alt="" />Claude Code 配置',
        link: '/guide/cli/claude-code',
      },
      {
        text: '<img class="f2-sb-icon" src="/icons/openai.png" alt="" />Codex 配置',
        link: '/guide/cli/codex',
      },
      {
        text: '<img class="f2-sb-icon" src="/icons/grok.png" alt="" />Grok Build 配置',
        link: '/guide/cli/grok-build',
      },
      {
        text: '<img class="f2-sb-icon" src="/icons/gemini.svg" alt="" />Gemini 配置',
        link: '/guide/cli/gemini',
      },
      {
        text: '<img class="f2-sb-icon" src="/icons/microsoft.png" alt="" />WSL 配置',
        link: '/guide/cli/wsl',
      },
    ],
  },
  {
    text: '<span class="f2-sb-ico f2-sb-ico--faq" aria-hidden="true"></span>常见问题',
    collapsed: false,
    items: [
      {
        // Explicit <br> so long FAQ titles always wrap in the narrow sidebar
        text: '<img class="f2-sb-icon" src="/icons/openai.png" alt="" /><span class="f2-sb-label">Codex App<br>不显示 GPT-5.6（Mac / Win）</span>',
        link: '/faq/codex-gpt-56-mac-win',
      },
      {
        text: '<img class="f2-sb-icon" src="/icons/openai.png" alt="" /><span class="f2-sb-label">Codex App<br>不显示 GPT-5.6（Windows）</span>',
        link: '/faq/codex-gpt-56-windows',
      },
    ],
  },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Fuck2API',
  description: 'Fuck2API 官方文档 — 统一、稳定、极致性能的 AI API 中转平台使用教程',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  appearance: 'dark',

  // 默认进入快速开始
  rewrites: {},

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#ff3b30' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'Fuck2API Docs' }],
    ['meta', { name: 'og:description', content: '高端 AI API 中转 · 统一接入 · 极致体验' }],
    ['meta', { name: 'og:image', content: '/logo.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  themeConfig: {
    logo: {
      light: '/logo.svg',
      dark: '/logo.svg',
    },
    // Rendered via custom nav-bar-title-text slot (NavBrandTitle)
    siteTitle: 'Fuck2API',
    outline: {
      level: [2, 3],
      label: '本页目录',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    nav: [
      {
        text: '快速开始',
        link: '/guide/intro',
        activeMatch: '/guide/',
      },
      {
        text: 'API 接入',
        link: '/api/overview',
        activeMatch: '/api/',
      },
      {
        text: '控制台',
        link: 'https://fxxkapi.top',
      },
      {
        text: '更多',
        items: [
          { text: '贡献指南', link: '/contributing' },
        ],
      },
    ],
    sidebar: {
      '/guide/': guideSidebar,
      '/faq/': guideSidebar,
      '/api/': [
        {
          text: '<span class="f2-sb-ico f2-sb-ico--api" aria-hidden="true"></span>API 接入',
          collapsed: false,
          items: [
            {
              text: '<span class="f2-sb-ico f2-sb-ico--chat" aria-hidden="true"></span>OAI 对话接口对接',
              link: '/api/overview',
            },
            {
              text: '<span class="f2-sb-ico f2-sb-ico--image" aria-hidden="true"></span>OAI 生图接口对接',
              link: '/api/images',
            },
            {
              text: '<img class="f2-sb-icon" src="/icons/grok.png" alt="" />Grok 生图接口对接',
              link: '/api/grok-images',
            },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hynzdc/fuck2api-doc' },
    ],
    footer: {
      message: 'Released under the MIT License · Built with VitePress',
      copyright: 'Copyright © 2024-present Fuck2API',
    },
    editLink: {
      pattern: 'https://github.com/hynzdc/fuck2api-doc/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },

  markdown: {
    theme: {
      // Dual Shiki themes — must pair with CSS that does NOT force color on spans
      light: 'github-light',
      dark: 'github-dark',
    },
    // Slightly tighter code for docs density
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '警告',
      infoLabel: '信息',
      detailsLabel: '详细信息',
    },
  },

  vite: {
    server: {
      host: true,
      port: 5173,
    },
  },
})
