/**
 * Theme switch: circular reveal from the top-right appearance button.
 *
 * Strategy:
 * 1. Prefer View Transitions API (Chrome / Edge / Safari 18+)
 * 2. Anchor the circle at the *visible* appearance switch the user clicked
 * 3. Disable page CSS transitions during the flip to avoid jank
 * 4. Fallback to a lightweight overlay circle when VT is unavailable
 *
 * First-click pitfall (hard refresh):
 * VitePress mounts multiple `.VPSwitchAppearance` nodes (desktop nav / extra
 * flyout / mobile screen). Hidden ones can still be querySelected and their
 * getBoundingClientRect may be wrong or centered. We only trust *visible*
 * switches, and prefer the real pointer coordinates from the click event.
 */

// Slower, cinematic wipe — ease-in-out so it breathes at both ends
const DURATION = 920
const EASING = 'cubic-bezier(0.65, 0, 0.35, 1)'

/** Last known-good origin — reused if a later call has no event */
let lastOrigin: { x: number; y: number } | null = null

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
  return Math.hypot(maxX, maxY) + 8
}

function isVisiblyRendered(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect()
  if (r.width < 2 || r.height < 2) return false
  // Off-screen counts as hidden
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
      style.opacity === '0'
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

/**
 * Pick the best visible switch control.
 * Prefer the rightmost one (desktop top-right), never a hidden flyout copy.
 */
function findVisibleSwitch(preferNear?: { x: number; y: number }): HTMLElement | null {
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>('.VPSwitchAppearance'),
  ).filter(isVisiblyRendered)

  if (!nodes.length) return null

  if (preferNear) {
    // Closest visible switch to the pointer
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

  // Rightmost = typical desktop nav appearance control
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

/**
 * Resolve the circle origin.
 *
 * Priority:
 *  1. Visible `.VPSwitchAppearance` that was actually clicked
 *  2. Visible switch nearest to pointer / rightmost on screen
 *  3. Raw pointer coordinates
 *  4. Last known-good origin
 *  5. Top-right fallback
 */
function resolveOrigin(event?: MouseEvent | KeyboardEvent | Event): {
  x: number
  y: number
} {
  const pointer = hasPointerCoords(event)
    ? { x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY }
    : null

  // 1) Switch that contains the click target (only if visible)
  const target = (event?.target as Element | null) || null
  if (target && typeof target.closest === 'function') {
    const clickedSwitch = target.closest('.VPSwitchAppearance') as HTMLElement | null
    if (clickedSwitch && isVisiblyRendered(clickedSwitch)) {
      const origin = centerOf(clickedSwitch)
      lastOrigin = origin
      return origin
    }
  }

  // 2) Best visible switch (near pointer, else rightmost)
  const visible = findVisibleSwitch(pointer ?? undefined)
  if (visible) {
    const origin = centerOf(visible)
    lastOrigin = origin
    return origin
  }

  // 3) Raw pointer — still better than a wrong element
  if (pointer && (pointer.x !== 0 || pointer.y !== 0)) {
    lastOrigin = pointer
    return pointer
  }

  // 4) Last good origin from a previous successful toggle
  if (lastOrigin) return lastOrigin

  // 5) Top-right fallback
  return {
    x: Math.max(24, window.innerWidth - 56),
    y: 28,
  }
}

function setAnimating(on: boolean) {
  document.documentElement.classList.toggle('f2-theme-animating', on)
}

/**
 * Lightweight fallback: expanding circle overlay (no full-page snapshot).
 */
function animateWithOverlay(
  nextIsDark: boolean,
  applyTheme: () => void,
  x: number,
  y: number,
): Promise<void> {
  return new Promise((resolve) => {
    const radius = coverRadius(x, y)
    const size = radius * 2
    const bg = nextIsDark ? '#0b0c0f' : '#ffffff'

    const circle = document.createElement('div')
    circle.className = 'f2-theme-circle'
    circle.setAttribute('aria-hidden', 'true')
    Object.assign(circle.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      width: '0px',
      height: '0px',
      margin: '0',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      background: bg,
      pointerEvents: 'none',
      zIndex: '2147483646',
      willChange: 'width, height',
      transition: `width ${DURATION}ms ${EASING}, height ${DURATION}ms ${EASING}`,
    } as CSSStyleDeclaration)

    document.documentElement.appendChild(circle)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        circle.style.width = `${size}px`
        circle.style.height = `${size}px`
      })
    })

    const flipAt = Math.round(DURATION * 0.48)
    window.setTimeout(() => {
      applyTheme()
    }, flipAt)

    let settled = false
    const done = () => {
      if (settled) return
      settled = true
      circle.removeEventListener('transitionend', onEnd)
      circle.remove()
      resolve()
    }

    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'width' || e.propertyName === 'height') done()
    }
    circle.addEventListener('transitionend', onEnd)
    window.setTimeout(done, DURATION + 100)
  })
}

function runCircleReveal(x: number, y: number): Animation {
  const radius = coverRadius(x, y)
  // Simple 2-keyframe wipe is more reliable than multi-stop on first VT
  return document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${radius}px at ${x}px ${y}px)`,
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
}

/**
 * Create a toggle handler for VitePress `provide('toggle-appearance', …)`.
 * @param isDark Vue ref from useData().isDark
 */
export function createThemeToggle(isDark: { value: boolean }) {
  let busy = false

  return async function toggleAppearance(event?: MouseEvent | KeyboardEvent | Event) {
    if (busy) return

    // Capture origin synchronously from the click — before any await / reflow
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
        // Force a layout read so first-ever VT has stable geometry
        void document.documentElement.getBoundingClientRect()

        // @ts-expect-error View Transitions API
        const transition = document.startViewTransition(() => {
          applyTheme()
        })

        await transition.ready

        // Re-resolve after theme class flip in case nav metrics changed,
        // but keep the pre-click x/y (switch shouldn't move).
        let animation: Animation
        try {
          animation = runCircleReveal(x, y)
        } catch {
          // Pseudo-element animate failed (rare first-run) → finish VT only
          await transition.finished.catch(() => undefined)
          return
        }

        await Promise.race([
          transition.finished.catch(() => undefined),
          animation.finished.catch(() => undefined),
          new Promise((r) => window.setTimeout(r, DURATION + 160)),
        ])
      } else {
        await animateWithOverlay(next, applyTheme, x, y)
      }
    } catch {
      applyTheme()
    } finally {
      setAnimating(false)
      busy = false
    }
  }
}
