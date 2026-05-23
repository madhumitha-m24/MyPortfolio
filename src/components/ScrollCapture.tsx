import { useEffect } from 'react'
import { useScroll } from '@react-three/drei'
import { setScrollElement } from '../utils/scrollStore'

/**
 * ScrollCapture — A tiny invisible component placed inside
 * <ScrollControls> that captures the scroll container DOM element
 * and stores it in scrollStore so DOM components (Navbar) can
 * programmatically scroll to specific offsets.
 */
export default function ScrollCapture() {
  const scroll = useScroll()

  useEffect(() => {
    setScrollElement(scroll.el)
    return () => setScrollElement(null)
  }, [scroll.el])

  return null
}
