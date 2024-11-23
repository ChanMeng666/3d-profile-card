import * as THREE from 'three'

export interface CameraConfig {
  position: [number, number, number]
  target: [number, number, number]
  zoom: number
  minDistance: number
  maxDistance: number
  dampingFactor: number
  autoRotateSpeed: number
}

export interface CameraControls {
  enableDamping: boolean
  enableZoom: boolean
  enableRotate: boolean
  enablePan: boolean
  autoRotate: boolean
}

export interface CameraViewport {
  width: number
  height: number
  aspect: number
  distance: number
}

export interface CameraTransition {
  duration: number
  easing: (t: number) => number
  onUpdate?: (camera: THREE.Camera) => void
  onComplete?: () => void
} 