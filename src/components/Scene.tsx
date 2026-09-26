import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  ScrollControls,
  Scroll,
  PerformanceMonitor,
} from '@react-three/drei'
import ContentOverlay from './ContentOverlay'
import ScrollCapture from './ScrollCapture'


export default function Scene() {
  const [dpr, setDpr] = useState(1.5)
  const [degraded, setDegraded] = useState(false)

  const handleIncline = useCallback(() => {
    setDpr(2)
    setDegraded(false)
  }, [])

  const handleDecline = useCallback(() => {
    setDpr(1)
    setDegraded(true)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
      }}
      gl={{ antialias: !degraded, alpha: true, powerPreference: 'high-performance' }}
      dpr={dpr}
    >
      {/* Auto-degrade quality on slow hardware */}
      <PerformanceMonitor
        onIncline={handleIncline}
        onDecline={handleDecline}
        flipflops={3}
        onFallback={() => setDegraded(true)}
      />

      {/* Scroll-driven content (9 pages of scroll distance) */}
      <ScrollControls pages={10} damping={0.25}>
        <ScrollCapture />
        {/* HTML content — rendered as native DOM inside the scroll container */}
        <Scroll html style={{ width: '100%' }}>
          <ContentOverlay />
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}

