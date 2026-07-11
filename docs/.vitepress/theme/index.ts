import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import './style.css'
import './fonts.css'
import HomeHero from './components/HomeHero.vue'
import FeatureGrid from './components/FeatureGrid.vue'
import StatBar from './components/StatBar.vue'
import CodeTabs from './components/CodeTabs.vue'
import Callout from './components/Callout.vue'
import Badge from './components/Badge.vue'
import CardLink from './components/CardLink.vue'
import Steps from './components/Steps.vue'
import ApiEndpoint from './components/ApiEndpoint.vue'
import NavBrandTitle from './components/NavBrandTitle.vue'
import DocMeta from './components/DocMeta.vue'
import { setupImagePreview } from './imagePreview'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Replace plain site title text with official Fuck2API brand styling
      'nav-bar-title-text': () => h(NavBrandTitle),
      // Doc meta bar (author / date / reading time) — relocates under h1
      'doc-before': () => h(DocMeta),
    })
  },
  enhanceApp({ app, router }) {
    app.component('HomeHero', HomeHero)
    app.component('FeatureGrid', FeatureGrid)
    app.component('StatBar', StatBar)
    app.component('CodeTabs', CodeTabs)
    app.component('Callout', Callout)
    app.component('Badge', Badge)
    app.component('CardLink', CardLink)
    app.component('Steps', Steps)
    app.component('ApiEndpoint', ApiEndpoint)
    app.component('NavBrandTitle', NavBrandTitle)
    app.component('DocMeta', DocMeta)

    // World-class lightbox for all doc images (PhotoSwipe 5)
    if (typeof window !== 'undefined') {
      setupImagePreview(router)
    }
  },
} satisfies Theme
