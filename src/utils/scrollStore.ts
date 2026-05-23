/**
 * scrollStore.ts — Lightweight module-level store to bridge the
 * drei ScrollControls (inside Canvas) with DOM-level components
 * (Navbar, etc.) that live outside the Canvas.
 *
 * Components inside <ScrollControls> call `setScrollElement()`.
 * DOM components call `scrollToOffset()` to navigate.
 */

let scrollElement: HTMLDivElement | null = null

export function setScrollElement(el: HTMLDivElement | null) {
  scrollElement = el
}

/**
 * Smoothly scroll to a normalized offset (0–1).
 * Uses the drei ScrollControls' internal scroll container.
 */
export function scrollToOffset(offset: number) {
  if (!scrollElement) return
  const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight
  const target = offset * maxScroll

  scrollElement.scrollTo({
    top: target,
    behavior: 'smooth',
  })
}

/** Returns the current scroll element for direct access if needed. */
export function getScrollElement() {
  return scrollElement
}
