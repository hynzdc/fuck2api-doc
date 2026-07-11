<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const { frontmatter, page } = useData()
const route = useRoute()

const root = ref<HTMLElement | null>(null)
const visible = ref(false)
const readingLabel = ref('小于 1 分钟')

const author = computed(() => {
  const a = frontmatter.value.author
  return typeof a === 'string' && a.trim() ? a.trim() : 'Fuck2API'
})

/** Format like 2026/7/10 (no zero-pad — matches reference site) */
function formatDate(input: Date | number | string): string {
  const d = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

const dateLabel = computed(() => {
  const fm = frontmatter.value
  if (fm.date) return formatDate(fm.date as string | number | Date)
  if (typeof fm.lastUpdated === 'string' || typeof fm.lastUpdated === 'number') {
    return formatDate(fm.lastUpdated)
  }
  const lu = page.value.lastUpdated
  if (lu) return formatDate(lu)
  // Stable fallback when git timestamp unavailable (dev / new files)
  return formatDate('2026-07-11')
})

function estimateReadingTime(text: string): string {
  // Chinese ~400 chars/min · Latin ~200 words/min
  const cn = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const enWords = (text.replace(/[\u4e00-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length
  const minutes = Math.ceil(cn / 400 + enWords / 200)
  if (!minutes || minutes <= 1) return '小于 1 分钟'
  return `约 ${minutes} 分钟`
}

function shouldShow(): boolean {
  if (frontmatter.value.layout && frontmatter.value.layout !== 'doc') return false
  if (frontmatter.value.docMeta === false) return false
  const path = route.path.replace(/\.html$/, '').replace(/\/$/, '') || '/'
  if (path === '/' || path === '/index') return false
  return true
}

function placeUnderTitle() {
  const el = root.value
  if (!el) return

  if (!shouldShow()) {
    visible.value = false
    return
  }

  const h1 = document.querySelector('.VPDoc .vp-doc h1') as HTMLElement | null
  if (!h1) {
    visible.value = false
    return
  }

  if (h1.nextElementSibling !== el) {
    h1.insertAdjacentElement('afterend', el)
  }

  const doc = document.querySelector('.VPDoc .vp-doc') as HTMLElement | null
  if (doc) {
    const clone = doc.cloneNode(true) as HTMLElement
    clone.querySelectorAll('pre, .f2-doc-meta, script, style, .header-anchor').forEach((n) => n.remove())
    readingLabel.value = estimateReadingTime(clone.textContent || '')
  }

  if (typeof frontmatter.value.readingTime === 'string') {
    readingLabel.value = frontmatter.value.readingTime
  } else if (typeof frontmatter.value.readingMinutes === 'number') {
    const m = frontmatter.value.readingMinutes as number
    readingLabel.value = m <= 1 ? '小于 1 分钟' : `约 ${m} 分钟`
  }

  visible.value = true
}

function refresh() {
  nextTick(() => {
    requestAnimationFrame(() => placeUnderTitle())
  })
}

onMounted(() => {
  refresh()
  setTimeout(refresh, 60)
  setTimeout(refresh, 200)
})

watch(
  () => route.path,
  () => {
    visible.value = false
    refresh()
    setTimeout(refresh, 100)
  },
)

onBeforeUnmount(() => {
  root.value?.remove()
})
</script>

<template>
  <div
    ref="root"
    class="f2-doc-meta"
    :class="{ 'is-visible': visible }"
    :hidden="!visible"
    aria-label="文档信息"
  >
    <span class="f2-doc-meta__item" title="作者">
      <!-- user / author -->
      <svg class="f2-doc-meta__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="f2-doc-meta__text">{{ author }}</span>
    </span>

    <span class="f2-doc-meta__sep" aria-hidden="true" />

    <span class="f2-doc-meta__item" title="写作日期">
      <!-- calendar -->
      <svg class="f2-doc-meta__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="3.5"
          y="5"
          width="17"
          height="15.5"
          rx="2.5"
          stroke="currentColor"
          stroke-width="1.75"
        />
        <path d="M3.5 10h17" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
        <path d="M8 3.5v3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
        <path d="M16 3.5v3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
      </svg>
      <span class="f2-doc-meta__text">{{ dateLabel }}</span>
    </span>

    <span class="f2-doc-meta__sep" aria-hidden="true" />

    <span class="f2-doc-meta__item" title="阅读时间">
      <!-- hourglass -->
      <svg class="f2-doc-meta__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 3.5h12M6 20.5h12M7.5 3.5c0 3.5 2 5.5 4.5 7.5-2.5 2-4.5 4-4.5 7.5M16.5 3.5c0 3.5-2 5.5-4.5 7.5 2.5 2 4.5 4 4.5 7.5"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="f2-doc-meta__text">{{ readingLabel }}</span>
    </span>
  </div>
</template>
