/**
 * Theme switch: circular reveal of the *real* page content from the
 * top-right appearance button.
 *
 * Key points:
 *  - Origin is captured on pointerdown (before Vue click) so the first
 *    hard-refresh toggle still starts at the switch, not page center.
 *  - Visual wipe uses View Transitions + clip-path so you see actual
 *    content, NOT a solid white/black overlay.
 *  - No solid color circle (that made the page look "all white/black").
 */

const DURATION = 920
const EASING = 'cubic-bezier(0.65, 0, 0.35, 1)'

let lastOrigin: { x: number; y: number } | null = null
/** Captured on pointerdown before click — most reliable for first toggle */
let pendingOrigin: { x: number; y: number } | null = null
let pointerHookInstalled = false

function installPointerHook() {
  if (pointerHookInstalled || typeof document === 'undefined') return
  pointerHookInstalled = true

  document.addEventListener(
    'pointerdown',
    (e: PointerEvent) => {
      const target = e.target as Element | null
      if (!target || typeof target.closest !== 'function') return

      const sw = target.closest('.VPSwitchAppearance') as HTMLElement | null
      if (!sw || !isVisiblyRendered(sw)) return

      pendingOrigin = centerOf(sw)
      lastOrigin = pendingOrigin
    },
    true,
  )
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function supportsViewTransition(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document
}

function coverRadius(x: number, y: number): number {
  const maxX = Math.max(x, window.innerWidth - x)
  const maxY = Math.max(y, window.innerHeight - y)
  return Math.hypot(maxX, maxY) + 16
}

function isVisiblyRendered(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect()
  if (r.width < 2 || r.height < 2) return false
  if (
    r.bottom < 0 ||
    r.top > window.innerHeight ||
    r.right < 0 ||
    r.left > window.innerWidth
  ) {
    return false
  }

  let cur: HTMLElement | null = el
  while (cur && cur !== document.documentElement) {
    const style = window.getComputedStyle(cur)
    if (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      Number(style.opacity) === 0
    ) {
      return false
    }
    cur = cur.parentElement
  }
  return true
}

function centerOf(el: HTMLElement): { x: number; y: number } {
  const r = el.getBoundingClientRect()
  return {
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
  }
}

function findVisibleSwitch(preferNear?: { x: number; y: number }): HTMLElement | null {
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>('.VPSwitchAppearance'),
  ).filter(isVisiblyRendered)

  if (!nodes.length) return null

  if (preferNear) {
    let best = nodes[0]
    let bestDist = Infinity
    for (const n of nodes) {
      const c = centerOf(n)
      const d = Math.hypot(c.x - preferNear.x, c.y - preferNear.y)
      if (d < bestDist) {
        bestDist = d
        best = n
      }
    }
    return best
  }

  nodes.sort(
    (a, b) => b.getBoundingClientRect().right - a.getBoundingClientRect().right,
  )
  return nodes[0]
}

function hasPointerCoords(event?: Event): event is MouseEvent | PointerEvent {
  if (!event || !('clientX' in event)) return false
  const e = event as MouseEvent
  return (
    typeof e.clientX === 'number' &&
    typeof e.clientY === 'number' &&
    Number.isFinite(e.clientX) &&
    Number.isFinite(e.clientY)
  )
}

function resolveOrigin(event?: MouseEvent | KeyboardEvent | Event): {
  x: number
  y: number
} {
  // 0) pointerdown hook (first click after hard refresh)
  if (pendingOrigin) {
    const o = pendingOrigin
    pendingOrigin = null
    lastOrigin = o
    return o
  }

  const pointer = hasPointerCoords(event)
    ? { x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY }
    : null

  // 1) Clicked switch
  const target = (event?.target as Element | null) || null
  if (target && typeof target.closest === 'function') {
    const clicked = target.closest('.VPSwitchAppearance') as HTMLElement | null
    if (clicked && isVisiblyRendered(clicked)) {
      const o = centerOf(clicked)
      lastOrigin = o
      return o
    }
  }

  // 2) Nearest / rightmost visible switch
  const visible = findVisibleSwitch(pointer ?? undefined)
  if (visible) {
    const o = centerOf(visible)
    lastOrigin = o
    return o
  }

  // 3) Raw pointer
  if (pointer && (pointer.x !== 0 || pointer.y !== 0)) {
    lastOrigin = pointer
    return pointer
  }

  if (lastOrigin) return lastOrigin
  return {
    x: Math.max(24, window.innerWidth - 56),
    y: 28,
  }
}

function setAnimating(on: boolean) {
  document.documentElement.classList.toggle('f2-theme-animating', on)
}

/** Remove any leftover solid overlay from older builds */
function cleanupLegacyOverlay() {
  if (typeof document === 'undefined') return
  document.querySelectorAll('.f2-theme-circle').forEach((n) => n.remove())
}

/**
 * View Transition: expand the NEW theme snapshot as a circle from (x, y).
 * User sees real page content, not a solid color fill.
 */
async function animateWithViewTransition(
  applyTheme: () => void,
  x: number,
  y: number,
): Promise<void> {
  void document.documentElement.getBoundingClientRect()

  // Prefer % positions so clip-path stays correct even if the VT
  // snapshot box differs slightly from the viewport on first run.
  const xPct = (x / Math.max(window.innerWidth, 1)) * 100
  const yPct = (y / Math.max(window.innerHeight, 1)) * 100
  // circle() % radius resolves against sqrt((w^2+h^2)/2) — 150% is always enough
  const endRadiusPct = 150

  // @ts-expect-error View Transitions API
  const transition = document.startViewTransition(() => {
    applyTheme()
  })

  await transition.ready

  const animation = document.documentElement.animate(
    {
      clipPath: [
        `circle(0% at ${xPct}% ${yPct}%)`,
        `circle(${endRadiusPct}% at ${xPct}% ${yPct}%)`,
      ],
    },
    {
      duration: DURATION,
      easing: EASING,
      fill: 'both',
      // @ts-expect-error pseudoElement for view transition
      pseudoElement: '::view-transition-new(root)',
    },
  )

  await Promise.race([
    transition.finished.catch(() => undefined),
    animation.finished.catch(() => undefined),
    new Promise((r) => window.setTimeout(r, DURATION + 160)),
  ])
}

/**
 * Create a toggle handler for VitePress `provide('toggle-appearance', …)`.
 */
export function createThemeToggle(isDark: { value: boolean }) {
  // Browser-only side effects (SSR build has no document)
  if (typeof window !== 'undefined') {
    installPointerHook()
    cleanupLegacyOverlay()
  }

  let busy = false

  return async function toggleAppearance(event?: MouseEvent | KeyboardEvent | Event) {
    if (busy) return
    if (typeof window === 'undefined') {
      isDark.value = !isDark.value
      return
    }

    cleanupLegacyOverlay()

    const { x, y } = resolveOrigin(event)
    const next = !isDark.value
    const applyTheme = () => {
      isDark.value = next
    }

    if (prefersReducedMotion()) {
      applyTheme()
      return
    }

    busy = true
    setAnimating(true)

    try {
      if (supportsViewTransition()) {
        await animateWithViewTransition(applyTheme, x, y)
      } else {
        // No VT: instant flip (better than a solid white/black blob)
        applyTheme()
      }
    } catch {
      applyTheme()
    } finally {
      setAnimating(false)
      busy = false
      cleanupLegacyOverlay()
    }
  }
}
