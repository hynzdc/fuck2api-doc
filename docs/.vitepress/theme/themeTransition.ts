/**
 * Theme switch: circular reveal from the click point.
 * Uses View Transitions API when available (Chrome / Edge / Safari 18+).
 * Falls back to an instant toggle elsewhere.
 */

const DURATION = 520
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function supportsViewTransition(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document
}

/** Radius large enough to cover the viewport from (x, y) */
function coverRadius(x: number, y: number): number {
  const maxX = Math.max(x, window.innerWidth - x)
  const maxY = Math.max(y, window.innerHeight - y)
  return Math.hypot(maxX, maxY)
}

function resolveClickPoint(event?: MouseEvent | KeyboardEvent | Event): {
  x: number
  y: number
} {
  if (event && 'clientX' in event && typeof (event as MouseEvent).clientX === 'number') {
    const e = event as MouseEvent
    // Ignore (0,0) from synthetic events — fall back to switch center
    if (e.clientX !== 0 || e.clientY !== 0) {
      return { x: e.clientX, y: e.clientY }
    }
  }

  // Prefer the appearance switch control as origin
  const el =
    document.querySelector('.VPSwitchAppearance') ||
    document.querySelector('.VPNavBarAppearance') ||
    document.querySelector('[class*="SwitchAppearance"]')

  if (el) {
    const r = el.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }

  return { x: window.innerWidth - 48, y: 32 }
}

/**
 * Create a toggle handler for VitePress `provide('toggle-appearance', …)`.
 * @param isDark Vue ref from useData().isDark
 */
export function createThemeToggle(isDark: { value: boolean }) {
  let busy = false

  return async function toggleAppearance(event?: MouseEvent | KeyboardEvent | Event) {
    if (busy) return

    const next = !isDark.value

    // Instant path: reduced motion or no View Transitions
    if (prefersReducedMotion() || !supportsViewTransition()) {
      isDark.value = next
      return
    }

    const { x, y } = resolveClickPoint(event)
    const radius = coverRadius(x, y)

    busy = true
    document.documentElement.classList.add('f2-theme-animating')

    try {
      // @ts-expect-error View Transitions API
      const transition = document.startViewTransition(() => {
        isDark.value = next
      })

      await transition.ready

      // New theme expands as a circle from the click point
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: DURATION,
          easing: EASING,
          // @ts-expect-error pseudoElement for view transition
          pseudoElement: '::view-transition-new(root)',
        },
      )

      await transition.finished
    } catch {
      // If VT fails mid-way, still apply theme
      isDark.value = next
    } finally {
      document.documentElement.classList.remove('f2-theme-animating')
      busy = false
    }
  }
}
