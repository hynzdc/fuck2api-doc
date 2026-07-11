import { defineConfig } from 'vitepress'

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
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
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
          { text: '常见问题', link: '/faq/' },
          { text: '更新日志', link: '/changelog' },
          { text: '贡献指南', link: '/contributing' },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '🚀 快速开始',
          collapsed: false,
          items: [
            { text: '平台简介', link: '/guide/intro' },
            { text: '充值', link: '/guide/recharge' },
            { text: 'ApiKey 管理', link: '/guide/apikey' },
            { text: '通用步骤', link: '/guide/common-steps' },
          ],
        },
        {
          text: '⌨️ CLI 配置',
          collapsed: false,
          items: [
            { text: 'CC-Switch 配置', link: '/guide/cc-switch' },
            { text: 'Claude Code 配置', link: '/guide/cli/claude-code' },
            { text: 'Codex 配置', link: '/guide/cli/codex' },
            { text: 'Grok Build 配置', link: '/guide/cli/grok-build' },
            { text: 'Gemini 配置', link: '/guide/cli/gemini' },
            { text: 'WSL 配置', link: '/guide/cli/wsl' },
          ],
        },
      ],
      '/api/': [
        {
          text: '📡 API 接入',
          collapsed: false,
          items: [
            { text: 'OAI 对话接口对接', link: '/api/overview' },
            { text: '生图接口文档对接', link: '/api/images' },
          ],
        },
      ],
      '/faq/': [
        {
          text: '❓ 帮助中心',
          items: [
            { text: '常见问题', link: '/faq/' },
            { text: '故障排查', link: '/faq/troubleshooting' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/fuck2api/docs' },
    ],
    footer: {
      message: 'Released under the MIT License · Built with VitePress',
      copyright: 'Copyright © 2024-present Fuck2API',
    },
    editLink: {
      pattern: 'https://github.com/fuck2api/docs/edit/main/docs/:path',
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
      light: 'github-light',
      dark: 'one-dark-pro',
    },
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
