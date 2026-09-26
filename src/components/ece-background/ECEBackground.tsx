import { useEffect, useRef } from 'react'
import { ECEEngine } from './eceEngine'
import { defaultECEConfig } from './eceConfig'
import { getScrollElement } from '../../utils/scrollStore'

/**
 * ECEBackground — Interactive, Living Electronic System Background.
 *
 * Renders an ECE engineering environment behind the portfolio:
 *  - Deep dark navy PCB matrix
 *  - Procedural PCB traces, 45° routing, copper vias & logic gates
 *  - Flowing multi-strand cyan oscilloscope signal waveform
 *  - Interactive probe cursor (bends waves, spawns traveling pulses, idle orbiting particles, click shockwaves)
 *  - Digital RTL clock/data bus and IoT mesh network
 *  - Non-blocking: pointer-events: none on the canvas layer ensures all portfolio buttons, links, and cards remain 100% interactive.
 */
export default function ECEBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<ECEEngine | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 1. Initialize ECE Animation Engine
    const engine = new ECEEngine(canvas, defaultECEConfig)
    engineRef.current = engine
    engine.start()

    // 2. Global Event Listeners for Interaction (Window level so canvas doesn't need pointer events)
    const handleMouseMove = (e: MouseEvent) => {
      engine.handleMouseMove(e.clientX, e.clientY)
    }

    const handleMouseLeave = () => {
      engine.handleMouseLeave()
    }

    const handleClick = (e: MouseEvent) => {
      engine.handleClick(e.clientX, e.clientY)
    }

    // Touch support for tablets and mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        engine.handleMouseMove(touch.clientX, touch.clientY)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        engine.handleMouseMove(touch.clientX, touch.clientY)
        engine.handleClick(touch.clientX, touch.clientY)
      }
    }

    const handleTouchEnd = () => {
      engine.handleMouseLeave()
    }

    // Window Resize
    let resizeTimeout: number
    const handleResize = () => {
      cancelAnimationFrame(resizeTimeout)
      resizeTimeout = requestAnimationFrame(() => {
        engine.resize()
      })
    }

    // Scroll Tracking synchronized with Drei's ScrollControls
    const updateScrollOffset = () => {
      const scrollEl = getScrollElement()
      if (scrollEl && scrollEl.scrollHeight > scrollEl.clientHeight) {
        const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight
        const offset = scrollEl.scrollTop / maxScroll
        engine.setScrollOffset(offset)
      } else {
        const winMax = document.documentElement.scrollHeight - window.innerHeight
        if (winMax > 0) {
          const offset = window.scrollY / winMax
          engine.setScrollOffset(offset)
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('click', handleClick, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', updateScrollOffset, { passive: true })

    // Poll scroll element until Drei ScrollControls registers it
    const scrollPollInterval = setInterval(() => {
      const scrollEl = getScrollElement()
      if (scrollEl) {
        scrollEl.addEventListener('scroll', updateScrollOffset, { passive: true })
        clearInterval(scrollPollInterval)
      }
    }, 200)

    return () => {
      clearInterval(scrollPollInterval)
      cancelAnimationFrame(resizeTimeout)

      const scrollEl = getScrollElement()
      if (scrollEl) {
        scrollEl.removeEventListener('scroll', updateScrollOffset)
      }

      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', updateScrollOffset)

      engine.destroy()
      engineRef.current = null
    }
  }, [])

  return (
    <div
      id="ece-background-container"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#020610',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
