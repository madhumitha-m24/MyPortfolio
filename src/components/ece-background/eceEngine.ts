/**
 * eceEngine.ts — High-Performance Living Electronic Canvas Engine
 *
 * Implements:
 *  - Layer 1: Dark Electronic Environment (deep navy, radial glow, vignette)
 *  - Layer 2: PCB Circuit Traces (45° routing, vias, IC packages, RTL logic symbols, sensor radar arcs)
 *  - Layer 3: Main Flowing Multi-Strand Waveform (cyan/white filaments, harmonics, additive glow)
 *  - Digital / RTL Signal Layer (clock square wave, CMOS data pulses, ADC conversion)
 *  - IoT Network Layer (mesh nodes, packet hopping, wireless broadcast arcs)
 *  - Interactive Cursor System (approach deformation, intersection dual pulses, idle orbiting probe particles, click shockwaves)
 *  - Scroll Parallax & Section Adaptation
 */

import type { ECEConfig } from './eceConfig'

/* ---------- Types & Interfaces ---------- */

interface Point {
  x: number
  y: number
}


interface PCBTrace {
  id: number
  points: Point[]
  totalLength: number
  vias: Point[]
}

interface TracePacket {
  traceId: number
  progress: number // 0 to 1
  speed: number
  length: number
  active: boolean
}

interface ViaNode {
  x: number
  y: number
  radius: number
  glow: number
  pulsePhase: number
  connectedTraceIds: number[]
}

interface WavePulse {
  x: number
  direction: -1 | 1 // -1 = left, 1 = right
  speed: number
  life: number // 1.0 down to 0
  decay: number
  intensity: number
}

interface WaveParticle {
  xRatio: number // 0 to 1
  strandIndex: number
  speed: number
  size: number
  alpha: number
  jitterY: number
}

interface IdleProbeParticle {
  angle: number
  distance: number
  targetDistance: number
  speed: number
  size: number
  alpha: number
}

interface ClickShockwave {
  x: number
  y: number
  radius: number
  maxRadius: number
  speed: number
  alpha: number
}

interface WirelessArc {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
}

interface IoTNode {
  x: number
  y: number
  radius: number
  glow: number
  connectedTo: number[]
}

interface IoTPacket {
  fromNode: number
  toNode: number
  progress: number
  speed: number
}

/* ==========================================================================
   ECEEngine Class
   ========================================================================== */

export class ECEEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private config: ECEConfig

  // Dimensions
  private width = 0
  private height = 0
  private dpr = 1

  // Animation Loop
  private animId = 0
  private lastTime = 0
  private time = 0

  // Scroll
  private scrollOffset = 0
  private targetScrollOffset = 0

  // Mouse State
  private mouse = {
    x: -1000,
    y: -1000,
    prevX: -1000,
    prevY: -1000,
    speed: 0,
    isInside: false,
    isDown: false,
    idleDuration: 0,
    isIdle: false,
  }

  // Waveform State
  private wavePulses: WavePulse[] = []
  private waveParticles: WaveParticle[] = []
  private spontaneousPulseTimer = 0
  private waveDeformLerp = 0

  // PCB Traces State
  private traces: PCBTrace[] = []
  private viaNodes: ViaNode[] = []
  private tracePackets: TracePacket[] = []

  // Digital RTL State
  private digitalClockOffset = 0
  private adcConversionGlow = 0

  // IoT Network State
  private iotNodes: IoTNode[] = []
  private iotPackets: IoTPacket[] = []
  private wirelessArcs: WirelessArc[] = []
  private wirelessTimer = 0

  // Interactive Effects
  private idleParticles: IdleProbeParticle[] = []
  private shockwaves: ClickShockwave[] = []

  // Device & Motion Preferences
  private isMobile = false
  private reducedMotion = false

  constructor(canvas: HTMLCanvasElement, config: ECEConfig) {
    this.canvas = canvas
    const context = canvas.getContext('2d', { alpha: false, desynchronized: true })
    if (!context) throw new Error('Could not get 2D canvas context')
    this.ctx = context
    this.config = config

    this.checkPreferences()
    this.resize()
    this.initWorld()
  }

  /* ---------- Initialization & Setup ---------- */

  private checkPreferences() {
    this.reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0)
  }

  public updateConfig(newConfig: Partial<ECEConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  public resize() {
    const parent = this.canvas.parentElement || document.body
    this.width = parent.clientWidth || window.innerWidth
    this.height = parent.clientHeight || window.innerHeight

    this.dpr = Math.min(
      window.devicePixelRatio || 1,
      this.isMobile ? 1.5 : this.config.performance.maxDpr
    )

    this.canvas.width = Math.floor(this.width * this.dpr)
    this.canvas.height = Math.floor(this.height * this.dpr)
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`

    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.scale(this.dpr, this.dpr)

    this.initWorld()
  }

  private initWorld() {
    this.initTracesAndVias()
    this.initWaveParticles()
    this.initIdleParticles()
    this.initIoTNetwork()
  }

  /* ---------- Procedural PCB Generation ---------- */

  private initTracesAndVias() {
    this.traces = []
    this.viaNodes = []
    this.tracePackets = []

    const W = this.width
    const H = this.height
    const grid = this.config.traces.gridSize

    // Helper to snap to grid
    const snap = (v: number) => Math.round(v / grid) * grid

    let traceId = 0

    // 1. Generate Authentic PCB Bus Tracks (Parallel lines with 45° chamfers)
    const busY1 = snap(H * 0.22)
    const busY2 = snap(H * 0.76)

    // Bus track generator
    const makeBus = (startY: number, dirY: number, lineCount = 3) => {
      const spacing = 10
      const cornerX1 = snap(W * 0.25)
      const cornerX2 = snap(W * 0.65)
      const dy = 60 * dirY

      for (let l = 0; l < lineCount; l++) {
        const yOffset = (l - (lineCount - 1) / 2) * spacing
        const p0 = { x: 0, y: startY + yOffset }
        const p1 = { x: cornerX1 - yOffset, y: startY + yOffset }
        // 45 degree bend
        const p2 = { x: cornerX1 + Math.abs(dy) - yOffset, y: startY + yOffset + dy }
        const p3 = { x: cornerX2 - yOffset, y: startY + yOffset + dy }
        // 45 degree return
        const p4 = { x: cornerX2 + Math.abs(dy) - yOffset, y: startY + yOffset }
        const p5 = { x: W, y: startY + yOffset }

        const points = [p0, p1, p2, p3, p4, p5]
        const len = this.calcPolylineLength(points)
        const vias: Point[] = [p1, p2, p3, p4]

        this.traces.push({
          id: traceId++,
          points,
          totalLength: len,
          vias,
        })
      }
    }

    makeBus(busY1, 1, 3)
    makeBus(busY2, -1, 3)

    // 2. Generate Secondary Branching Traces with 45° angles
    const branches = [
      // Top Left IC area
      [
        { x: snap(W * 0.08), y: snap(H * 0.08) },
        { x: snap(W * 0.16), y: snap(H * 0.08) },
        { x: snap(W * 0.20), y: snap(H * 0.12) },
        { x: snap(W * 0.20), y: snap(H * 0.28) },
      ],
      // Top Center Branch
      [
        { x: snap(W * 0.42), y: 0 },
        { x: snap(W * 0.42), y: snap(H * 0.15) },
        { x: snap(W * 0.48), y: snap(H * 0.21) },
        { x: snap(W * 0.58), y: snap(H * 0.21) },
      ],
      // Bottom Right FPGA/MCU Routing Channel
      [
        { x: snap(W * 0.72), y: snap(H * 0.88) },
        { x: snap(W * 0.80), y: snap(H * 0.88) },
        { x: snap(W * 0.86), y: snap(H * 0.82) },
        { x: snap(W * 0.86), y: snap(H * 0.62) },
        { x: snap(W * 0.94), y: snap(H * 0.54) },
      ],
      // Bottom Left Sensor Branch
      [
        { x: snap(W * 0.12), y: H },
        { x: snap(W * 0.12), y: snap(H * 0.84) },
        { x: snap(W * 0.18), y: snap(H * 0.78) },
        { x: snap(W * 0.28), y: snap(H * 0.78) },
      ],
      // Right Midground IC Branch
      [
        { x: W, y: snap(H * 0.38) },
        { x: snap(W * 0.85), y: snap(H * 0.38) },
        { x: snap(W * 0.78), y: snap(H * 0.45) },
        { x: snap(W * 0.70), y: snap(H * 0.45) },
      ],
    ]

    branches.forEach((pts) => {
      const len = this.calcPolylineLength(pts)
      const vias = [pts[1], pts[pts.length - 1]]
      this.traces.push({
        id: traceId++,
        points: pts,
        totalLength: len,
        vias,
      })
    })

    // Extract Unique Via Nodes
    const viaMap = new Map<string, ViaNode>()
    this.traces.forEach((t) => {
      t.vias.forEach((v) => {
        const key = `${Math.round(v.x)},${Math.round(v.y)}`
        if (!viaMap.has(key)) {
          viaMap.set(key, {
            x: v.x,
            y: v.y,
            radius: this.config.traces.nodeRadius,
            glow: 0,
            pulsePhase: Math.random() * Math.PI * 2,
            connectedTraceIds: [t.id],
          })
        } else {
          viaMap.get(key)!.connectedTraceIds.push(t.id)
        }
      })
    })
    this.viaNodes = Array.from(viaMap.values())

    // 3. Initialize Trace Packets
    const packetCount = this.isMobile
      ? this.config.performance.mobilePacketCount
      : this.config.traces.packetCount

    for (let i = 0; i < packetCount; i++) {
      const assignedTrace = this.traces[i % this.traces.length]
      this.tracePackets.push({
        traceId: assignedTrace.id,
        progress: Math.random(),
        speed: (this.config.traces.packetSpeed * (0.8 + Math.random() * 0.5)) / assignedTrace.totalLength,
        length: this.config.traces.packetLength,
        active: true,
      })
    }
  }

  private calcPolylineLength(points: Point[]): number {
    let len = 0
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1].x - points[i].x
      const dy = points[i + 1].y - points[i].y
      len += Math.sqrt(dx * dx + dy * dy)
    }
    return Math.max(len, 1)
  }

  private getPointOnTrace(trace: PCBTrace, progress: number): Point {
    const targetDist = progress * trace.totalLength
    let accumulated = 0

    for (let i = 0; i < trace.points.length - 1; i++) {
      const p1 = trace.points[i]
      const p2 = trace.points[i + 1]
      const segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y)

      if (accumulated + segLen >= targetDist) {
        const t = (targetDist - accumulated) / segLen
        return {
          x: p1.x + (p2.x - p1.x) * t,
          y: p1.y + (p2.y - p1.y) * t,
        }
      }
      accumulated += segLen
    }
    return trace.points[trace.points.length - 1]
  }

  /* ---------- Wave Particles & Idle Probe Initialization ---------- */

  private initWaveParticles() {
    const count = this.isMobile ? 35 : 85
    const strandCount = this.isMobile
      ? this.config.performance.mobileStrandCount
      : this.config.waveform.strandCount

    this.waveParticles = []
    for (let i = 0; i < count; i++) {
      this.waveParticles.push({
        xRatio: Math.random(),
        strandIndex: Math.floor(Math.random() * strandCount),
        speed: 0.0008 + Math.random() * 0.0016,
        size: 0.8 + Math.random() * 1.8,
        alpha: 0.4 + Math.random() * 0.6,
        jitterY: (Math.random() - 0.5) * 6,
      })
    }
  }

  private initIdleParticles() {
    this.idleParticles = []
    for (let i = 0; i < this.config.interaction.idleParticleCount; i++) {
      this.idleParticles.push({
        angle: (i / this.config.interaction.idleParticleCount) * Math.PI * 2,
        distance: 25 + Math.random() * 35,
        targetDistance: 25 + Math.random() * 35,
        speed: 0.02 + Math.random() * 0.03,
        size: 1.0 + Math.random() * 1.5,
        alpha: 0,
      })
    }
  }

  /* ---------- IoT Network Initialization ---------- */

  private initIoTNetwork() {
    this.iotNodes = []
    this.iotPackets = []
    this.wirelessArcs = []

    const W = this.width
    const H = this.height

    // Position IoT constellation in bottom-left to mid-left region
    const baseCoords: Point[] = [
      { x: W * 0.08, y: H * 0.68 },
      { x: W * 0.15, y: H * 0.62 },
      { x: W * 0.22, y: H * 0.70 },
      { x: W * 0.18, y: H * 0.78 },
      { x: W * 0.10, y: H * 0.80 },
      { x: W * 0.26, y: H * 0.60 },
      { x: W * 0.32, y: H * 0.68 },
    ]

    this.iotNodes = baseCoords.map((pt, i) => {
      // Connect to 2-3 nearby nodes
      const connectedTo: number[] = []
      if (i > 0) connectedTo.push(i - 1)
      if (i < baseCoords.length - 1) connectedTo.push(i + 1)
      if (i === 0) connectedTo.push(4)
      if (i === 2) connectedTo.push(5)

      return {
        x: pt.x,
        y: pt.y,
        radius: 3.5,
        glow: 0.2,
        connectedTo,
      }
    })

    // Create 3 initial packets
    for (let i = 0; i < 3; i++) {
      const fromNode = i
      const toNode = this.iotNodes[fromNode].connectedTo[0] ?? 0
      this.iotPackets.push({
        fromNode,
        toNode,
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.006,
      })
    }
  }

  /* ---------- Event Handlers ---------- */

  public handleMouseMove(clientX: number, clientY: number) {
    if (this.reducedMotion) return

    const rect = this.canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    this.mouse.prevX = this.mouse.x
    this.mouse.prevY = this.mouse.y
    this.mouse.x = x
    this.mouse.y = y
    this.mouse.isInside = true

    const dx = this.mouse.x - this.mouse.prevX
    const dy = this.mouse.y - this.mouse.prevY
    this.mouse.speed = Math.hypot(dx, dy)

    if (this.mouse.speed > 1.2) {
      this.mouse.idleDuration = 0
      this.mouse.isIdle = false
    }

    // STATE 3: Check if cursor crossed waveform center line
    this.checkWaveformIntersection(this.mouse.prevX, this.mouse.prevY, x, y)
  }

  public handleMouseLeave() {
    this.mouse.isInside = false
    this.mouse.isIdle = false
    this.mouse.idleDuration = 0
  }

  public handleClick(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    // STATE 6: Click creates an electrical shockwave & activates nodes
    this.spawnClickShockwave(x, y)
  }

  public setScrollOffset(offset: number) {
    this.targetScrollOffset = Math.max(0, Math.min(1, offset))
  }

  /* ---------- Interactivity Logic ---------- */

  private checkWaveformIntersection(x1: number, y1: number, x2: number, y2: number) {
    if (x1 < 0 || x2 < 0) return

    const midX = (x1 + x2) * 0.5
    const waveY = this.getWaveformCenterY(midX)

    // Segment intersects wave if y1 and y2 span across waveY
    const crossed = (y1 - waveY) * (y2 - waveY) <= 0 && Math.abs(y1 - y2) < 120

    if (crossed) {
      // Spawn Left and Right Traveling Pulses along the wave
      this.spawnDualWavePulses(midX)

      // Light up nearby PCB nodes
      this.viaNodes.forEach((node) => {
        const d = Math.hypot(node.x - midX, node.y - waveY)
        if (d < 180) {
          node.glow = Math.max(node.glow, 1.0 - d / 180)
        }
      })
    }
  }

  private spawnDualWavePulses(x: number) {
    // Left Pulse
    this.wavePulses.push({
      x,
      direction: -1,
      speed: this.config.waveform.travelingPulseSpeed,
      life: 1.0,
      decay: 0.006,
      intensity: 1.0,
    })

    // Right Pulse
    this.wavePulses.push({
      x,
      direction: 1,
      speed: this.config.waveform.travelingPulseSpeed,
      life: 1.0,
      decay: 0.006,
      intensity: 1.0,
    })
  }

  private spawnClickShockwave(x: number, y: number) {
    // 1. Shockwave Ripple
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: this.config.interaction.clickShockwaveMaxRadius,
      speed: this.config.interaction.clickShockwaveSpeed,
      alpha: 1.0,
    })

    // 2. Excite Nearby PCB Nodes
    this.viaNodes.forEach((node) => {
      const d = Math.hypot(node.x - x, node.y - y)
      if (d < this.config.interaction.clickShockwaveMaxRadius) {
        node.glow = 1.0

        // Launch an active pulse down connected traces
        node.connectedTraceIds.forEach((tId) => {
          this.tracePackets.push({
            traceId: tId,
            progress: 0,
            speed: this.config.traces.packetSpeed * 1.8 / (this.traces.find((t) => t.id === tId)?.totalLength || 100),
            length: this.config.traces.packetLength * 1.5,
            active: true,
          })
        })
      }
    })

    // 3. Inoculate waveform if click is near wave
    const waveY = this.getWaveformCenterY(x)
    if (Math.abs(y - waveY) < 160) {
      this.spawnDualWavePulses(x)
    }
  }

  /* ---------- Waveform Math ---------- */

  private getSectionIntensityMultiplier(): number {
    const s = this.config.sections
    const o = this.scrollOffset

    // 9 sections corresponding to offsets 0/9 to 9/9
    if (o < 0.06) return s.hero
    if (o < 0.17) return s.summary
    if (o < 0.28) return s.education
    if (o < 0.39) return s.skills
    if (o < 0.55) return s.projects
    if (o < 0.72) return s.publications
    if (o < 0.83) return s.certificates
    if (o < 0.94) return s.activities
    return s.contact
  }

  /**
   * Computes central reference height of the flowing wave at position x
   */
  public getWaveformCenterY(x: number): number {
    const H = this.height
    const centerY = H * this.config.waveform.verticalCenterRatio
    const baseAmp = this.config.waveform.baseAmplitude * this.getSectionIntensityMultiplier()
    const freq = this.config.waveform.baseFrequency
    const t = this.time * this.config.waveform.speed

    // Multi-harmonic analog synthesis
    let y = centerY
    y += baseAmp * Math.sin(x * freq - t)
    y += baseAmp * 0.35 * Math.sin(x * freq * 2.1 + t * 1.2)
    y += baseAmp * 0.55 * Math.cos(x * freq * 0.45 - t * 0.7)
    y += baseAmp * 0.12 * Math.sin(x * freq * 5.2 - t * 2.0)

    // Parallax vertical drift from scroll
    const parallaxY = -this.scrollOffset * (H * 0.18)
    y += parallaxY

    // STATE 2: Electromagnetic cursor deformation (smooth Gaussian pull/push)
    if (!this.reducedMotion && this.mouse.isInside) {
      const dx = x - this.mouse.x
      const sigma = this.config.interaction.waveDeformSigma
      const gaussian = Math.exp(-(dx * dx) / (2 * sigma * sigma))

      const distY = this.mouse.y - y
      const maxDef = this.config.interaction.waveDeformStrength
      const clampedDef = Math.max(-maxDef, Math.min(maxDef, distY * 0.45))

      y += clampedDef * gaussian * this.waveDeformLerp
    }

    return y
  }

  /* ==========================================================================
     Main Render Loop
     ========================================================================== */

  public start() {
    this.lastTime = performance.now()
    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05)
      this.lastTime = currentTime

      this.update(dt)
      this.render()

      this.animId = requestAnimationFrame(loop)
    }
    this.animId = requestAnimationFrame(loop)
  }

  public stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId)
      this.animId = 0
    }
  }

  /* ---------- Update Step ---------- */

  private update(dt: number) {
    this.time += dt

    // Smooth scroll interpolation
    this.scrollOffset += (this.targetScrollOffset - this.scrollOffset) * 0.1

    // Cursor proximity deformation easing
    if (this.mouse.isInside && !this.reducedMotion) {
      const waveY = this.getWaveformCenterY(this.mouse.x)
      const distToWave = Math.abs(this.mouse.y - waveY)
      const targetDeform = distToWave < this.config.interaction.cursorRadius ? 1.0 : 0.0
      this.waveDeformLerp += (targetDeform - this.waveDeformLerp) * 0.1
    } else {
      this.waveDeformLerp *= 0.9
    }

    // STATE 4: Cursor Idle Detection
    if (this.mouse.isInside && !this.reducedMotion) {
      this.mouse.idleDuration += dt * 1000
      if (this.mouse.idleDuration > this.config.interaction.idleTimeThreshold) {
        this.mouse.isIdle = true
      }
    }

    // Update Idle Probe Particles
    this.idleParticles.forEach((p) => {
      if (this.mouse.isIdle) {
        p.alpha += (0.8 - p.alpha) * 0.08
        p.angle += p.speed
      } else {
        p.alpha *= 0.92
      }
    })

    // Spontaneous Wave Pulses
    this.spontaneousPulseTimer += dt * 60
    if (this.spontaneousPulseTimer > this.config.waveform.spontaneousPulseInterval) {
      this.spontaneousPulseTimer = 0
      this.wavePulses.push({
        x: 0,
        direction: 1,
        speed: this.config.waveform.travelingPulseSpeed * 0.7,
        life: 1.0,
        decay: 0.004,
        intensity: 0.7,
      })
    }

    // Update Wave Pulses
    for (let i = this.wavePulses.length - 1; i >= 0; i--) {
      const p = this.wavePulses[i]
      p.x += p.direction * p.speed
      p.life -= p.decay

      if (p.life <= 0 || p.x < -100 || p.x > this.width + 100) {
        this.wavePulses.splice(i, 1)
      }
    }

    // Update Wave Particles
    this.waveParticles.forEach((wp) => {
      wp.xRatio += wp.speed * (this.reducedMotion ? 0.3 : 1.0)
      if (wp.xRatio > 1.0) wp.xRatio = 0
    })

    // Update Trace Packets
    this.tracePackets.forEach((tp) => {
      tp.progress += tp.speed * (this.reducedMotion ? 0.4 : 1.0)
      if (tp.progress > 1.0) {
        tp.progress = 0
        // Trigger via flare at end of trace
        const trace = this.traces.find((t) => t.id === tp.traceId)
        if (trace && trace.vias.length > 0) {
          const v = trace.vias[trace.vias.length - 1]
          const node = this.viaNodes.find((vn) => Math.hypot(vn.x - v.x, vn.y - v.y) < 10)
          if (node) node.glow = 1.0
        }
      }
    })

    // Fade via node glow
    this.viaNodes.forEach((node) => {
      node.glow *= 0.94
      node.pulsePhase += dt * 2.0
    })

    // Digital RTL Clock
    this.digitalClockOffset += dt * 45 * this.config.digital.clockSpeed
    this.adcConversionGlow = 0.5 + 0.5 * Math.sin(this.time * 3)

    // Update IoT Network
    this.iotPackets.forEach((pkt) => {
      pkt.progress += pkt.speed
      if (pkt.progress >= 1.0) {
        pkt.progress = 0
        pkt.fromNode = pkt.toNode
        const connected = this.iotNodes[pkt.fromNode].connectedTo
        if (connected.length > 0) {
          pkt.toNode = connected[Math.floor(Math.random() * connected.length)]
        }
        this.iotNodes[pkt.fromNode].glow = 1.0
      }
    })
    this.iotNodes.forEach((n) => {
      n.glow *= 0.95
    })

    // Periodic Wireless Arcs
    this.wirelessTimer += dt * 60
    if (this.wirelessTimer > this.config.iot.wirelessArcInterval) {
      this.wirelessTimer = 0
      const node = this.iotNodes[2] || this.iotNodes[0]
      if (node) {
        this.wirelessArcs.push({
          x: node.x,
          y: node.y,
          radius: 6,
          maxRadius: 75,
          alpha: 0.9,
        })
      }
    }
    for (let i = this.wirelessArcs.length - 1; i >= 0; i--) {
      const arc = this.wirelessArcs[i]
      arc.radius += 1.2
      arc.alpha = Math.max(0, 1.0 - arc.radius / arc.maxRadius)
      if (arc.radius >= arc.maxRadius) {
        this.wirelessArcs.splice(i, 1)
      }
    }

    // Update Click Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i]
      sw.radius += sw.speed
      sw.alpha = Math.max(0, 1.0 - sw.radius / sw.maxRadius)
      if (sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1)
      }
    }
  }

  /* ---------- Render Step ---------- */

  private render() {
    const ctx = this.ctx
    const W = this.width
    const H = this.height

    ctx.clearRect(0, 0, W, H)

    // LAYER 1: Dark Electronic Environment
    this.renderEnvironment(ctx, W, H)

    // LAYER 2: PCB Circuit Traces, Vias, IC Modules & Robotics/Sensor Elements
    this.renderPCBTraces(ctx)

    // DIGITAL / RTL SIGNAL LAYER
    this.renderDigitalRTLLayer(ctx)

    // IoT NETWORK LAYER
    this.renderIoTNetwork(ctx)

    // LAYER 3: Main Flowing Signal Waves (Crown Jewel)
    this.renderFlowingWaveform(ctx, W)

    // INTERACTIVE EFFECTS: Probe idle field, click shockwaves, cursor electromagnetic aura
    this.renderInteractiveEffects(ctx)
  }

  /* ---------- Layer 1: Dark Electronic Environment ---------- */

  private renderEnvironment(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const c = this.config.colors

    // Deep gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, c.bgDark)
    grad.addColorStop(0.5, c.bgNavy)
    grad.addColorStop(1, c.bgDark)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Subtle Radial Glow behind active hero area
    const radial = ctx.createRadialGradient(
      W * 0.5,
      H * this.config.waveform.verticalCenterRatio,
      20,
      W * 0.5,
      H * this.config.waveform.verticalCenterRatio,
      Math.max(W, H) * 0.65
    )
    radial.addColorStop(0, 'rgba(6, 78, 110, 0.12)')
    radial.addColorStop(0.5, 'rgba(4, 30, 60, 0.06)')
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = radial
    ctx.fillRect(0, 0, W, H)

    // Peripheral Vignette
    const vignette = ctx.createRadialGradient(
      W * 0.5,
      H * 0.5,
      Math.min(W, H) * 0.45,
      W * 0.5,
      H * 0.5,
      Math.max(W, H) * 0.75
    )
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
    vignette.addColorStop(1, c.bgVignette)
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, W, H)
  }

  /* ---------- Layer 2: PCB Traces & Vias ---------- */

  private renderPCBTraces(ctx: CanvasRenderingContext2D) {
    const c = this.config.colors
    const parallaxY = -this.scrollOffset * (this.height * 0.08)

    ctx.save()
    ctx.translate(0, parallaxY)

    // 1. Draw Static Traces
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    this.traces.forEach((trace) => {
      if (trace.points.length < 2) return

      // Outer Glow
      ctx.lineWidth = 2.4
      ctx.strokeStyle = c.traceBase
      ctx.beginPath()
      ctx.moveTo(trace.points[0].x, trace.points[0].y)
      for (let i = 1; i < trace.points.length; i++) {
        ctx.lineTo(trace.points[i].x, trace.points[i].y)
      }
      ctx.stroke()

      // Inner Core Line
      ctx.lineWidth = 0.8
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)'
      ctx.stroke()
    })

    // 2. Draw Trace Data Packets
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'

    this.tracePackets.forEach((pkt) => {
      const trace = this.traces.find((t) => t.id === pkt.traceId)
      if (!trace) return

      const head = this.getPointOnTrace(trace, pkt.progress)
      const tailProgress = Math.max(0, pkt.progress - pkt.length / trace.totalLength)
      const tail = this.getPointOnTrace(trace, tailProgress)

      // Gradient Trail
      const trailGrad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y)
      trailGrad.addColorStop(0, 'rgba(0, 245, 255, 0)')
      trailGrad.addColorStop(0.7, c.packetTrail)
      trailGrad.addColorStop(1, c.packetColor)

      ctx.lineWidth = 2.0
      ctx.strokeStyle = trailGrad
      ctx.beginPath()
      ctx.moveTo(tail.x, tail.y)
      ctx.lineTo(head.x, head.y)
      ctx.stroke()

      // Bright packet head bead
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(head.x, head.y, 1.8, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.restore()

    // 3. Draw Via Nodes
    this.viaNodes.forEach((node) => {
      const isGlowing = node.glow > 0.05
      const pulse = 0.3 + 0.15 * Math.sin(node.pulsePhase)

      // Outer Copper Ring
      ctx.lineWidth = 1.4
      ctx.strokeStyle = isGlowing ? c.nodeBright : c.viaPad
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius + (isGlowing ? 2 : 0), 0, Math.PI * 2)
      ctx.stroke()

      // Inner Hole
      ctx.fillStyle = c.viaHole
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius * 0.45, 0, Math.PI * 2)
      ctx.fill()

      // Luminous Flare when excited
      if (isGlowing) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        const flare = ctx.createRadialGradient(node.x, node.y, 1, node.x, node.y, node.radius * 4.5)
        flare.addColorStop(0, `rgba(0, 245, 255, ${node.glow * 0.9})`)
        flare.addColorStop(1, 'rgba(0, 245, 255, 0)')
        ctx.fillStyle = flare
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 4.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      } else {
        // Dim ambient center dot
        ctx.fillStyle = `rgba(6, 182, 212, ${pulse})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 0.45, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // 4. Draw Hardware VLSI / Embedded & Robotics Symbols
    this.renderAbstractHardwareModules(ctx)

    ctx.restore()
  }

  /**
   * Subtle abstract hardware elements: IC package pinout, logic gate, sensor radar arcs
   */
  private renderAbstractHardwareModules(ctx: CanvasRenderingContext2D) {
    const W = this.width
    const H = this.height

    // (A) Top-Left IC Package Outline (STM32 / FPGA footprint)
    const icX = W * 0.1
    const icY = H * 0.12
    const icSize = 48

    ctx.save()
    ctx.lineWidth = 1.0
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)'
    ctx.strokeRect(icX, icY, icSize, icSize)

    // Corner pin-1 notch
    ctx.fillStyle = 'rgba(0, 245, 255, 0.5)'
    ctx.beginPath()
    ctx.arc(icX + 8, icY + 8, 2, 0, Math.PI * 2)
    ctx.fill()

    // IC Pins
    const pinLen = 5
    for (let p = 8; p < icSize; p += 8) {
      // Top pins
      ctx.beginPath()
      ctx.moveTo(icX + p, icY)
      ctx.lineTo(icX + p, icY - pinLen)
      ctx.stroke()
      // Bottom pins
      ctx.beginPath()
      ctx.moveTo(icX + p, icY + icSize)
      ctx.lineTo(icX + p, icY + icSize + pinLen)
      ctx.stroke()
    }
    ctx.restore()

    // (B) Sensor Node with Concentric Radar Arcs (Robotics/Sensors)
    const sensorX = W * 0.28
    const sensorY = H * 0.78
    const radarTime = this.time * 1.5

    ctx.save()
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.22)'
    ctx.lineWidth = 1.0

    for (let r = 1; r <= 3; r++) {
      const radius = ((radarTime * 20 + r * 22) % 65) + 6
      const alpha = Math.max(0, 1.0 - radius / 70) * 0.4
      ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`
      ctx.beginPath()
      ctx.arc(sensorX, sensorY, radius, -Math.PI * 0.4, Math.PI * 0.4)
      ctx.stroke()
    }
    ctx.restore()

    // (C) Faint D Flip-Flop Vector Outline (VLSI / RTL)
    const ffX = W * 0.82
    const ffY = H * 0.28
    const ffW = 32
    const ffH = 42

    ctx.save()
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.4)'
    ctx.lineWidth = 1.0
    ctx.strokeRect(ffX, ffY, ffW, ffH)

    // Dynamic Clock Input Wedge '>'
    ctx.beginPath()
    ctx.moveTo(ffX, ffY + ffH * 0.7 - 4)
    ctx.lineTo(ffX + 6, ffY + ffH * 0.7)
    ctx.lineTo(ffX, ffY + ffH * 0.7 + 4)
    ctx.stroke()
    ctx.restore()
  }

  /* ---------- Digital / RTL Signal Layer ---------- */

  private renderDigitalRTLLayer(ctx: CanvasRenderingContext2D) {
    const W = this.width
    const H = this.height
    const c = this.config.colors

    const busY = H * this.config.digital.busYRatio - this.scrollOffset * (H * 0.12)
    const busWidth = W * 0.45
    const busStartX = W * 0.45

    ctx.save()
    // Bus Guide Lines
    ctx.lineWidth = 0.8
    ctx.strokeStyle = c.digitalBus
    ctx.beginPath()
    ctx.moveTo(busStartX, busY)
    ctx.lineTo(busStartX + busWidth, busY)
    ctx.moveTo(busStartX, busY + 22)
    ctx.lineTo(busStartX + busWidth, busY + 22)
    ctx.stroke()

    // Digital Square Wave (Clock & Data Train)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = c.digitalPulse
    ctx.lineWidth = 1.4

    ctx.beginPath()
    const period = 38
    const halfPeriod = period * 0.5
    const amp = this.config.digital.pulseHeight
    const offset = this.digitalClockOffset % period

    let started = false
    for (let x = busStartX; x <= busStartX + busWidth; x += 2) {
      const relX = x - busStartX + offset
      const isHigh = (relX % period) < halfPeriod
      const targetY = isHigh ? busY - amp : busY

      if (!started) {
        ctx.moveTo(x, targetY)
        started = true
      } else {
        ctx.lineTo(x, targetY)
      }
    }
    ctx.stroke()
    ctx.restore()

    // Analog-to-Digital Converter (ADC) Intersection Node
    const adcX = busStartX
    const adcY = busY
    ctx.fillStyle = `rgba(0, 245, 255, ${this.adcConversionGlow * 0.6})`
    ctx.beginPath()
    ctx.arc(adcX, adcY, 3.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  /* ---------- IoT Network Layer ---------- */

  private renderIoTNetwork(ctx: CanvasRenderingContext2D) {
    const c = this.config.colors
    const parallaxY = -this.scrollOffset * (this.height * 0.14)

    ctx.save()
    ctx.translate(0, parallaxY)

    // 1. Draw Mesh Links
    ctx.lineWidth = 0.9
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)'
    this.iotNodes.forEach((node, i) => {
      node.connectedTo.forEach((tgtIdx) => {
        if (tgtIdx > i) {
          const tgt = this.iotNodes[tgtIdx]
          if (tgt) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(tgt.x, tgt.y)
            ctx.stroke()
          }
        }
      })
    })

    // 2. Draw IoT Packets
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    this.iotPackets.forEach((pkt) => {
      const from = this.iotNodes[pkt.fromNode]
      const to = this.iotNodes[pkt.toNode]
      if (!from || !to) return

      const px = from.x + (to.x - from.x) * pkt.progress
      const py = from.y + (to.y - from.y) * pkt.progress

      ctx.fillStyle = c.packetColor
      ctx.beginPath()
      ctx.arc(px, py, 2.2, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.restore()

    // 3. Draw Wireless Signal Arcs
    this.wirelessArcs.forEach((arc) => {
      ctx.save()
      ctx.strokeStyle = `rgba(34, 211, 238, ${arc.alpha * 0.45})`
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(arc.x, arc.y, arc.radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    })

    // 4. Draw IoT Nodes
    this.iotNodes.forEach((n) => {
      ctx.fillStyle = n.glow > 0.1 ? c.nodeBright : c.nodeDim
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()
  }

  /* ---------- Layer 3: Main Flowing Waveform (Crown Jewel) ---------- */

  private renderFlowingWaveform(ctx: CanvasRenderingContext2D, W: number) {
    const strandCount = this.isMobile
      ? this.config.performance.mobileStrandCount
      : this.config.waveform.strandCount

    const spreadY = this.config.waveform.verticalSpread
    const step = this.isMobile ? 14 : 7 // Step in pixels for smooth spline curve

    ctx.save()
    ctx.globalCompositeOperation = 'lighter'

    // Intensity scaling by section
    const intensity = this.getSectionIntensityMultiplier()

    // Render Each Delicate Strand
    for (let i = 0; i < strandCount; i++) {
      const relIdx = (i - strandCount / 2) / (strandCount / 2) // -1 to +1
      const isCore = Math.abs(relIdx) < 0.25
      const isVioletAccent = i % 7 === 0

      // Compute strand-specific parameters
      const strandFreq = 0.0035 + (i % 5) * 0.0006
      const strandPhase = i * 0.18 + this.time * 0.8
      const strandAmp = 3.5 + Math.sin(i * 0.8) * 2.0

      // Color selection
      let strokeColor: string
      if (isCore) {
        strokeColor = `rgba(255, 255, 255, ${0.45 * intensity})`
      } else if (isVioletAccent) {
        strokeColor = `rgba(168, 85, 247, ${0.28 * intensity})`
      } else {
        strokeColor = `rgba(0, 245, 255, ${(0.18 + 0.25 * (1 - Math.abs(relIdx))) * intensity})`
      }

      ctx.strokeStyle = strokeColor
      ctx.lineWidth = isCore ? 1.4 : 0.85

      ctx.beginPath()
      let isFirst = true

      for (let x = -20; x <= W + 20; x += step) {
        const centerY = this.getWaveformCenterY(x)

        // Strand offset with harmonic breathing
        const envelope = 1.0 + 0.35 * Math.sin(x * 0.0018 + this.time * 0.4)
        const strandY =
          centerY +
          relIdx * spreadY * envelope +
          strandAmp * Math.sin(x * strandFreq + strandPhase)

        if (isFirst) {
          ctx.moveTo(x, strandY)
          isFirst = false
        } else {
          ctx.lineTo(x, strandY)
        }
      }
      ctx.stroke()
    }

    // 2. Render Core Luminous Wave Ribbon
    ctx.lineWidth = 2.2
    ctx.strokeStyle = `rgba(0, 245, 255, ${0.5 * intensity})`
    ctx.beginPath()
    let first = true
    for (let x = -20; x <= W + 20; x += step) {
      const y = this.getWaveformCenterY(x)
      if (first) {
        ctx.moveTo(x, y)
        first = false
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // 3. Render Traveling Pulses (STATE 3 & Spontaneous)
    this.wavePulses.forEach((pulse) => {
      const py = this.getWaveformCenterY(pulse.x)
      const pulseAlpha = pulse.life * pulse.intensity

      // Glowing Bead
      const glow = ctx.createRadialGradient(pulse.x, py, 1, pulse.x, py, 26)
      glow.addColorStop(0, '#ffffff')
      glow.addColorStop(0.3, `rgba(0, 245, 255, ${0.9 * pulseAlpha})`)
      glow.addColorStop(1, 'rgba(0, 245, 255, 0)')

      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(pulse.x, py, 26, 0, Math.PI * 2)
      ctx.fill()

      // Bright white central kernel
      ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`
      ctx.beginPath()
      ctx.arc(pulse.x, py, 3.2, 0, Math.PI * 2)
      ctx.fill()
    })

    // 4. Render Wave Micro-Particles
    this.waveParticles.forEach((wp) => {
      const px = wp.xRatio * W
      const centerY = this.getWaveformCenterY(px)
      const relIdx = (wp.strandIndex - strandCount / 2) / (strandCount / 2)
      const py = centerY + relIdx * spreadY + wp.jitterY

      ctx.fillStyle = `rgba(224, 247, 250, ${wp.alpha * intensity})`
      ctx.beginPath()
      ctx.arc(px, py, wp.size, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()
  }

  /* ---------- Interactive Probe & Click Shockwave Effects ---------- */

  private renderInteractiveEffects(ctx: CanvasRenderingContext2D) {
    if (this.reducedMotion) return

    ctx.save()
    ctx.globalCompositeOperation = 'lighter'

    // 1. Click Shockwaves (STATE 6)
    this.shockwaves.forEach((sw) => {
      ctx.lineWidth = 2.0
      ctx.strokeStyle = `rgba(0, 245, 255, ${sw.alpha * 0.85})`
      ctx.beginPath()
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2)
      ctx.stroke()

      // 45-degree shocklines
      const crossSize = sw.radius * 0.45
      ctx.lineWidth = 1.0
      ctx.strokeStyle = `rgba(255, 255, 255, ${sw.alpha * 0.6})`
      ctx.beginPath()
      ctx.moveTo(sw.x - crossSize, sw.y - crossSize)
      ctx.lineTo(sw.x + crossSize, sw.y + crossSize)
      ctx.moveTo(sw.x - crossSize, sw.y + crossSize)
      ctx.lineTo(sw.x + crossSize, sw.y - crossSize)
      ctx.stroke()
    })

    // 2. STATE 4: Idle Probe Field (Orbiting Particles & Micro-Arc)
    if (this.mouse.isInside && this.mouse.isIdle) {
      const mx = this.mouse.x
      const my = this.mouse.y

      // Ambient probe glow
      const probeGlow = ctx.createRadialGradient(mx, my, 2, mx, my, 45)
      probeGlow.addColorStop(0, 'rgba(0, 245, 255, 0.45)')
      probeGlow.addColorStop(1, 'rgba(0, 245, 255, 0)')
      ctx.fillStyle = probeGlow
      ctx.beginPath()
      ctx.arc(mx, my, 45, 0, Math.PI * 2)
      ctx.fill()

      // Orbiting probe particles
      this.idleParticles.forEach((p) => {
        if (p.alpha <= 0.02) return

        const px = mx + Math.cos(p.angle) * p.distance
        const py = my + Math.sin(p.angle) * p.distance

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Occasional electronic spark to nearest node or wave
      const waveY = this.getWaveformCenterY(mx)
      if (Math.abs(my - waveY) < 140) {
        ctx.lineWidth = 1.0
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.35)'
        ctx.beginPath()
        ctx.moveTo(mx, my)
        ctx.lineTo(mx + (Math.random() - 0.5) * 12, (my + waveY) * 0.5)
        ctx.lineTo(mx, waveY)
        ctx.stroke()
      }
    }

    ctx.restore()
  }

  /* ---------- Destroy / Clean Up ---------- */

  public destroy() {
    this.stop()
  }
}
