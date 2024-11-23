import * as THREE from 'three'

export interface CameraControllerOptions {
  damping?: number
  maxDistance?: number
  minDistance?: number
  enableZoom?: boolean
  enablePan?: boolean
  enableRotate?: boolean
}

export interface PerformanceMetrics {
  fps: number
  memory: {
    geometries: number
    textures: number
  }
  render: {
    calls: number
    triangles: number
    points: number
    lines: number
  }
}

export interface ResponsiveConfig {
  breakpoints: {
    mobile: number
    tablet: number
    desktop: number
  }
  scales: {
    mobile: number
    tablet: number
    desktop: number
  }
}

export interface LightSetup {
  ambient: {
    color: THREE.ColorRepresentation
    intensity: number
  }
  directional: {
    color: THREE.ColorRepresentation
    intensity: number
    position: [number, number, number]
    castShadow?: boolean
    shadowMapSize?: number
  }
} 