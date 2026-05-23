import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * CustomCursor — A custom follow-cursor that lives in the DOM layer.
 *
 * Features:
 *  - Smooth position interpolation (lerp)
 *  - Expands on hover over project cards
 *  - Changes color on hover over interactive elements
 *  - Hidden on mobile / touch devices
 */

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const mousePos = useRef({ x: -100, y: -100 })
  const dotPos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })

  // Check if touch device
  const isTouchDevice = typeof window !== 'undefined' && (
    'ontouchstart' in window || navigator.maxTouchPoints > 0
  )

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY }
    if (!isVisible) setIsVisible(true)
  }, [isVisible])

  const handleMouseDown = useCallback(() => setIsClicking(true), [])
  const handleMouseUp = useCallback(() => setIsClicking(false), [])

  const handleMouseEnter = useCallback(() => setIsVisible(true), [])
  const handleMouseLeave = useCallback(() => setIsVisible(false), [])

  useEffect(() => {
    if (isTouchDevice) return

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isTouchDevice, handleMouseMove, handleMouseDown, handleMouseUp, handleMouseEnter, handleMouseLeave])

  // Hover detection for project cards and interactive elements
  useEffect(() => {
    if (isTouchDevice) return

    const handleHoverDetection = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest(
        '.project-card, .publication-card, .cert-card, .navbar__link, .overlay-hero__link-pill, .overlay-contact__link, .navbar__resume, a, button'
      )
      setIsHovering(!!isInteractive)
    }

    document.addEventListener('mouseover', handleHoverDetection)
    return () => document.removeEventListener('mouseover', handleHoverDetection)
  }, [isTouchDevice])

  // Animation loop — lerp cursor positions
  useEffect(() => {
    if (isTouchDevice) return

    let animationId: number

    const animate = () => {
      const dotLerp = 0.35
      const ringLerp = 0.15

      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * dotLerp
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * dotLerp
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ringLerp
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ringLerp

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%) scale(${isClicking ? 0.6 : 1})`
      }

      if (ringRef.current) {
        const scale = isHovering ? 2 : isClicking ? 0.8 : 1
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${scale})`
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [isTouchDevice, isHovering, isClicking])

  if (isTouchDevice) return null

  return (
    <>
      <div
        ref={dotRef}
        className={`cursor-dot ${isVisible ? 'cursor-dot--visible' : ''} ${isHovering ? 'cursor-dot--hover' : ''}`}
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${isVisible ? 'cursor-ring--visible' : ''} ${isHovering ? 'cursor-ring--hover' : ''}`}
      />
    </>
  )
}
