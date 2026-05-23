import { Suspense, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  ScrollControls,
  Scroll,
  Stars,
  PerformanceMonitor,
} from '@react-three/drei'
import FloatingModel from './FloatingModel'
import ContentOverlay from './ContentOverlay'
import ScrollCapture from './ScrollCapture'

/**
 * Scene — The root 3D environment.
 *
 * Phase 5 enhancements:
 *  - PerformanceMonitor: auto-degrades DPR and particle count on slow hardware
 *  - Suspense: prevents flash of empty space while 3D assets load
 *  - Adaptive quality via degraded state
 */

function SceneFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#7c3aed" wireframe />
    </mesh>
  )
}

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
      }}
      gl={{ antialias: !degraded, alpha: false, powerPreference: 'high-performance' }}
      dpr={dpr}
    >
      {/* Auto-degrade quality on slow hardware */}
      <PerformanceMonitor
        onIncline={handleIncline}
        onDecline={handleDecline}
        flipflops={3}
        onFallback={() => setDegraded(true)}
      />

      {/* Background color */}
      <color attach="background" args={['#090e1a']} />

      {/* Fog for depth */}
      <fog attach="fog" args={['#090e1a', 8, 25]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#e0d4ff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#7c3aed" />
      <pointLight position={[0, 2, 4]} intensity={0.6} color="#a78bfa" distance={12} />

      {/* Star background — reduced count when degraded */}
      <Stars
        radius={50}
        depth={60}
        count={degraded ? 1000 : 2500}
        factor={4}
        saturation={0.5}
        fade
        speed={degraded ? 0.3 : 0.8}
      />

      {/* Scroll-driven content (9 pages of scroll distance) */}
      <ScrollControls pages={9} damping={0.25}>
        <ScrollCapture />
        <Suspense fallback={<SceneFallback />}>
          {/* 3D objects — pass degraded flag for adaptive quality */}
          <FloatingModel degraded={degraded} />
        </Suspense>
        {/* HTML content — rendered as native DOM inside the scroll container */}
        <Scroll html style={{ width: '100%' }}>
          <ContentOverlay />
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}
