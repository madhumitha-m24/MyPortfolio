import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, Float } from '@react-three/drei'
import * as THREE from 'three'

/**
 * FloatingModel — A 3D composition that reacts to scroll offset.
 *
 * Phase 5: Accepts `degraded` prop from PerformanceMonitor to
 * automatically reduce particle count and geometry complexity
 * on low-end hardware.
 */

interface FloatingModelProps {
  degraded?: boolean
}

/* ---------- Orbiting Spheres ---------- */
function OrbitingSpheres({ count = 8, degraded = false }: { count?: number; degraded?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const scroll = useScroll()
  const actualCount = degraded ? Math.floor(count / 2) : count

  const sphereData = useMemo(() => {
    return Array.from({ length: actualCount }, (_, i) => {
      const angle = (i / actualCount) * Math.PI * 2
      const radius = 2.4 + Math.random() * 0.6
      return {
        angle,
        radius,
        speed: 0.3 + Math.random() * 0.4,
        size: 0.06 + Math.random() * 0.08,
        yOffset: (Math.random() - 0.5) * 1.5,
        color: new THREE.Color().setHSL(0.5 + Math.random() * 0.18, 0.85, 0.55),
      }
    })
  }, [actualCount])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const offset = scroll.offset

    sphereData.forEach((s, i) => {
      const child = groupRef.current.children[i] as THREE.Mesh
      if (!child) return

      const currentAngle = s.angle + t * s.speed + offset * Math.PI * 4
      child.position.x = Math.cos(currentAngle) * s.radius
      child.position.z = Math.sin(currentAngle) * s.radius
      child.position.y = s.yOffset + Math.sin(t * 0.5 + i) * 0.3

      const pulse = 1 + Math.sin(t * 2 + i * 0.8) * 0.3
      child.scale.setScalar(pulse)
    })
  })

  return (
    <group ref={groupRef}>
      {sphereData.map((s, i) => (
        <mesh key={i}>
          <sphereGeometry args={[s.size, degraded ? 8 : 16, degraded ? 8 : 16]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- Floating Particles ---------- */
function Particles({ count = 120, degraded = false }: { count?: number; degraded?: boolean }) {
  const actualCount = degraded ? Math.floor(count / 3) : count
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const scroll = useScroll()

  const particleData = useMemo(() => {
    const temp = new THREE.Object3D()
    const data = Array.from({ length: actualCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14,
      ),
      speed: 0.1 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }))
    return { temp, data }
  }, [actualCount])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const offset = scroll.offset

    particleData.data.forEach((p, i) => {
      particleData.temp.position.set(
        p.position.x + Math.sin(t * p.speed + p.phase) * 0.5,
        p.position.y + Math.cos(t * p.speed * 0.7 + p.phase) * 0.5 - offset * 8,
        p.position.z + Math.sin(t * p.speed * 0.5) * 0.3,
      )
      const s = 0.02 + Math.sin(t * 1.5 + i) * 0.01
      particleData.temp.scale.setScalar(s)
      particleData.temp.updateMatrix()
      meshRef.current.setMatrixAt(i, particleData.temp.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, actualCount]}>
      <sphereGeometry args={[1, degraded ? 4 : 8, degraded ? 4 : 8]} />
      <meshStandardMaterial
        color="#67e8f9"
        emissive="#0891b2"
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  )
}

/* ---------- Main Torus Knot ---------- */
function MainModel({ degraded = false }: { degraded?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const scroll = useScroll()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const offset = scroll.offset

    // Scroll-driven rotation
    meshRef.current.rotation.x = offset * Math.PI * 2 + t * 0.1
    meshRef.current.rotation.y = offset * Math.PI * 3 + t * 0.15
    meshRef.current.rotation.z = Math.sin(offset * Math.PI) * 0.5

    // Scroll-driven scale
    const scaleWave = 1 + Math.sin(offset * Math.PI) * 0.3
    meshRef.current.scale.setScalar(scaleWave)

    // Vertical drift
    meshRef.current.position.y = Math.sin(offset * Math.PI * 2) * 0.8
    meshRef.current.position.x = Math.cos(offset * Math.PI * 2) * 0.4
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.35, degraded ? 100 : 200, degraded ? 16 : 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#0284c7"
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.9}
          wireframe
        />
      </mesh>
    </Float>
  )
}

/* ---------- Composed Export ---------- */
export default function FloatingModel({ degraded = false }: FloatingModelProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const scroll = useScroll()
  const { viewport } = useThree()

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const offset = scroll.offset
    const isMobile = viewport.width < 7

    let targetX = 0
    let targetScale = 1.0

    if (isMobile) {
      // Center and scale down on mobile so it stays nicely in the background
      targetX = 0
      targetScale = 0.65
    } else {
      // Desktop responsive side-to-side shifting
      targetScale = 1.0
      
      // Determine base desktop shift distance proportional to screen size
      const shiftDist = viewport.width * 0.16
      targetX = -shiftDist // Start on left (Hero)

      if (offset >= 0.0 && offset < 1.0) {
        const keyframes = [
          { offset: 0.0, x: -shiftDist },
          { offset: 1 / 9, x: shiftDist },
          { offset: 2 / 9, x: -shiftDist },
          { offset: 3 / 9, x: shiftDist },
          { offset: 4 / 9, x: -shiftDist },
          { offset: 5 / 9, x: -shiftDist },
          { offset: 6 / 9, x: shiftDist },
          { offset: 7 / 9, x: -shiftDist },
          { offset: 8 / 9, x: shiftDist },
          { offset: 1.0, x: -shiftDist }
        ]
        for (let i = 0; i < keyframes.length - 1; i++) {
          const k1 = keyframes[i]
          const k2 = keyframes[i+1]
          if (offset >= k1.offset && offset <= k2.offset) {
            const t = (offset - k1.offset) / (k2.offset - k1.offset)
            const smoothT = t * t * (3 - 2 * t)
            targetX = THREE.MathUtils.lerp(k1.x, k2.x, smoothT)
            break
          }
        }
      } else if (offset >= 1.0) {
        targetX = -shiftDist
      }
    }

    // Smoothly interpolate position and scale
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      6 * delta
    )

    const currentScale = groupRef.current.scale.x
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 4 * delta)
    groupRef.current.scale.set(newScale, newScale, newScale)
  })

  return (
    <group ref={groupRef}>
      <MainModel degraded={degraded} />
      <OrbitingSpheres degraded={degraded} />
      <Particles degraded={degraded} />
    </group>
  )
}
