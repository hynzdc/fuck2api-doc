/**
 * Fuck2API Docs — Image Preview
 * PhotoSwipe 5 — zoom / pinch / wheel / keyboard / swipe
 */
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import type { Router } from 'vitepress'
import 'photoswipe/style.css'

const GALLERY = '.vp-doc'
const CHILD = 'a.f2-image-preview'

const SKIP = [
  '.f2-no-preview',
  '.VPImage.logo',
  '.VPNavBar .logo',
  '.VPHero .VPImage',
  'img[data-no-preview]',
  'img.emoji',
  'img.icon',
].join(',')

let lightbox: PhotoSwipeLightbox | null = null
let bound = false
let routeTimer: ReturnType<typeof setTimeout> | null = null

function isSkippable(img: HTMLImageElement): boolean {
  if (img.matches(SKIP) || img.closest(SKIP)) return true
  if (img.naturalWidth > 0 && img.naturalWidth < 36 && img.naturalHeight < 36) return true
  return false
}

function syncDimensions(link: HTMLAnchorElement, img: HTMLImageElement) {
  const w = img.naturalWidth || 1920
  const h = img.naturalHeight || 1080
  link.setAttribute('data-pswp-width', String(w))
  link.setAttribute('data-pswp-height', String(h))
  const src = img.currentSrc || img.getAttribute('src') || ''
  if (src) {
    link.href = src
    link.setAttribute('data-pswp-src', src)
  }
}

function ensureWrapped(img: HTMLImageElement): void {
  if (isSkippable(img)) return

  const existing = img.closest('a.f2-image-preview') as HTMLAnchorElement | null
  if (existing) {
    syncDimensions(existing, img)
    return
  }

  // Don't hijack real navigation links that aren't image links
  const parentLink = img.closest('a')
  if (parentLink && !parentLink.classList.contains('f2-image-preview')) {
    const href = parentLink.getAttribute('href') || ''
    const src = img.currentSrc || img.getAttribute('src') || ''
    if (href && src && href !== src && !href.includes(src.split('/').pop() || '___')) {
      return
    }
    // Convert existing image link into preview link
    parentLink.classList.add('f2-image-preview')
    parentLink.setAttribute('aria-label', '点击预览大图')
    syncDimensions(parentLink, img)
    if (!img.complete) {
      img.addEventListener('load', () => syncDimensions(parentLink, img), { once: true })
    }
    return
  }

  const link = document.createElement('a')
  link.className = 'f2-image-preview'
  link.href = img.currentSrc || img.getAttribute('src') || '#'
  link.setAttribute('data-pswp-src', link.href)
  link.setAttribute('aria-label', '点击预览大图')
  link.tabIndex = 0

  const parent = img.parentNode
  if (!parent) return
  parent.insertBefore(link, img)
  link.appendChild(img)

  syncDimensions(link, img)
  if (!img.complete) {
    img.addEventListener('load', () => syncDimensions(link, img), { once: true })
  }
}

function enhanceDocumentImages() {
  const root = document.querySelector(GALLERY)
  if (!root) return
  root.querySelectorAll<HTMLImageElement>('img').forEach(ensureWrapped)
}

function destroyLightbox() {
  if (!lightbox) return
  try {
    lightbox.destroy()
  } catch {
    /* ignore */
  }
  lightbox = null
}

function createLightbox() {
  destroyLightbox()

  lightbox = new PhotoSwipeLightbox({
    gallery: GALLERY,
    children: CHILD,
    pswpModule: () => import('photoswipe'),
    wheelToZoom: true,
    initialZoomLevel: 'fit',
    secondaryZoomLevel: 2.5,
    maxZoomLevel: 6,
    bgOpacity: 0.92,
    showHideAnimationType: 'zoom',
    imageClickAction: 'zoom',
    tapAction: 'zoom',
    doubleTapAction: 'zoom',
    closeTitle: '关闭 (Esc)',
    zoomTitle: '缩放',
    arrowPrevTitle: '上一张',
    arrowNextTitle: '下一张',
    errorMsg: '图片加载失败',
    preload: [1, 2],
    paddingFn: (viewportSize) => {
      const mobile = viewportSize.x < 768
      return {
        top: mobile ? 20 : 40,
        bottom: mobile ? 20 : 40,
        left: mobile ? 10 : 28,
        right: mobile ? 10 : 28,
      }
    },
  })

  lightbox.addFilter('itemData', (itemData) => {
    const el = itemData.element as HTMLAnchorElement | undefined
    if (!el) return itemData
    const img = el.querySelector('img')
    const src =
      el.getAttribute('data-pswp-src') ||
      img?.currentSrc ||
      img?.getAttribute('src') ||
      el.getAttribute('href') ||
      itemData.src
    itemData.src = src
    itemData.msrc = img?.currentSrc || img?.getAttribute('src') || src
    itemData.width = Number(el.getAttribute('data-pswp-width')) || img?.naturalWidth || 1920
    itemData.height = Number(el.getAttribute('data-pswp-height')) || img?.naturalHeight || 1080
    itemData.alt = img?.getAttribute('alt') || ''
    return itemData
  })

  // Caption under image when alt exists
  lightbox.on('uiRegister', () => {
    // @ts-expect-error PhotoSwipe runtime UI API
    lightbox?.pswp?.ui?.registerElement({
      name: 'f2-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: '',
      onInit: (el: HTMLElement, pswp: any) => {
        const render = () => {
          const alt = pswp.currSlide?.data?.alt || ''
          el.textContent = alt
          el.className = alt ? 'pswp__f2-caption is-visible' : 'pswp__f2-caption'
        }
        pswp.on('change', render)
        render()
      },
    })
  })

  lightbox.init()
}

function refreshPreview() {
  enhanceDocumentImages()
  createLightbox()
}

function scheduleRefresh() {
  if (routeTimer) clearTimeout(routeTimer)
  routeTimer = setTimeout(() => {
    requestAnimationFrame(() => {
      refreshPreview()
      // Lazy images / late naturalWidth
      setTimeout(enhanceDocumentImages, 350)
      setTimeout(enhanceDocumentImages, 1200)
    })
  }, 50)
}

export function setupImagePreview(router: Router) {
  if (typeof window === 'undefined' || bound) return
  bound = true

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleRefresh, { once: true })
  } else {
    scheduleRefresh()
  }

  const prev = router.onAfterRouteChanged
  router.onAfterRouteChanged = (to) => {
    if (typeof prev === 'function') prev(to)
    scheduleRefresh()
  }

  const mo = new MutationObserver(() => {
    enhanceDocumentImages()
  })
  mo.observe(document.body, { childList: true, subtree: true })
}
