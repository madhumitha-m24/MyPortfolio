/**
 * eceConfig.ts — Central Configuration for the ECE Living Electronic Background System.
 *
 * This configuration allows you to easily modify:
 *  - waveform speed, amplitude, and strand count
 *  - colors (dark navy, cyan, white core, electric blue, violet accent)
 *  - PCB trace density, node count, and packet speeds
 *  - interaction radii, deformation strengths, and pulse speeds
 *  - digital clock and RTL bus parameters
 *  - section-specific intensity multipliers
 */

export interface ECEConfig {
  colors: {
    bgDark: string
    bgNavy: string
    bgVignette: string
    traceBase: string
    traceGlow: string
    traceActive: string
    viaPad: string
    viaHole: string
    nodeDim: string
    nodeBright: string
    nodeGlow: string
    waveCore: string
    waveCyan: string
    waveCyanSoft: string
    waveGlow: string
    waveViolet: string
    digitalPulse: string
    digitalBus: string
    packetColor: string
    packetTrail: string
    shockwaveRing: string
  }
  waveform: {
    strandCount: number
    baseFrequency: number
    baseAmplitude: number
    speed: number
    verticalCenterRatio: number
    verticalSpread: number
    harmonics: {
      freqMult: number
      ampMult: number
    }[]
    spontaneousPulseInterval: number
    travelingPulseSpeed: number
  }
  traces: {
    gridSize: number
    nodeRadius: number
    packetCount: number
    packetSpeed: number
    packetLength: number
    branchProbability: number
  }
  digital: {
    busYRatio: number
    clockFrequency: number
    clockSpeed: number
    pulseHeight: number
    busLineWidth: number
    dataStreamBits: string
  }
  iot: {
    nodeCount: number
    packetSpeed: number
    wirelessArcInterval: number
  }
  interaction: {
    cursorRadius: number
    waveDeformStrength: number
    waveDeformSigma: number
    pulseSpawnSpeed: number
    idleTimeThreshold: number
    idleParticleCount: number
    clickShockwaveMaxRadius: number
    clickShockwaveSpeed: number
  }
  performance: {
    maxDpr: number
    mobileStrandCount: number
    mobilePacketCount: number
  }
  sections: {
    hero: number
    summary: number
    education: number
    skills: number
    projects: number
    publications: number
    certificates: number
    activities: number
    contact: number
  }
}

export const defaultECEConfig: ECEConfig = {
  colors: {
    bgDark: '#020610',
    bgNavy: '#040d1e',
    bgVignette: 'rgba(1, 4, 10, 0.85)',
    traceBase: 'rgba(6, 78, 110, 0.28)',
    traceGlow: 'rgba(8, 145, 178, 0.55)',
    traceActive: 'rgba(34, 211, 238, 0.95)',
    viaPad: 'rgba(14, 165, 233, 0.45)',
    viaHole: '#020610',
    nodeDim: 'rgba(6, 182, 212, 0.4)',
    nodeBright: '#00f5ff',
    nodeGlow: 'rgba(0, 245, 255, 0.6)',
    waveCore: '#ffffff',
    waveCyan: '#00f5ff',
    waveCyanSoft: 'rgba(56, 189, 248, 0.75)',
    waveGlow: 'rgba(6, 182, 212, 0.35)',
    waveViolet: 'rgba(168, 85, 247, 0.25)',
    digitalPulse: '#38bdf8',
    digitalBus: 'rgba(14, 116, 144, 0.35)',
    packetColor: '#00f5ff',
    packetTrail: 'rgba(0, 245, 255, 0.15)',
    shockwaveRing: 'rgba(34, 211, 238, 0.8)',
  },
  waveform: {
    strandCount: 44,
    baseFrequency: 0.0022,
    baseAmplitude: 48,
    speed: 0.016,
    verticalCenterRatio: 0.48,
    verticalSpread: 56,
    harmonics: [
      { freqMult: 2.1, ampMult: 0.35 },
      { freqMult: 0.45, ampMult: 0.55 },
      { freqMult: 5.2, ampMult: 0.12 },
    ],
    spontaneousPulseInterval: 280,
    travelingPulseSpeed: 7.0,
  },
  traces: {
    gridSize: 38,
    nodeRadius: 3.5,
    packetCount: 16,
    packetSpeed: 2.2,
    packetLength: 22,
    branchProbability: 0.45,
  },
  digital: {
    busYRatio: 0.78,
    clockFrequency: 0.04,
    clockSpeed: 2.4,
    pulseHeight: 14,
    busLineWidth: 1.2,
    dataStreamBits: '1011001011101001',
  },
  iot: {
    nodeCount: 7,
    packetSpeed: 1.8,
    wirelessArcInterval: 180,
  },
  interaction: {
    cursorRadius: 180,
    waveDeformStrength: 52,
    waveDeformSigma: 110,
    pulseSpawnSpeed: 7.5,
    idleTimeThreshold: 450,
    idleParticleCount: 18,
    clickShockwaveMaxRadius: 240,
    clickShockwaveSpeed: 5.5,
  },
  performance: {
    maxDpr: 2.0,
    mobileStrandCount: 22,
    mobilePacketCount: 8,
  },
  sections: {
    hero: 1.0,
    summary: 0.72,
    education: 0.75,
    skills: 0.9,
    projects: 0.95,
    publications: 0.75,
    certificates: 0.72,
    activities: 0.75,
    contact: 0.65,
  },
}
