import * as THREE from 'three'
import { ReactThreeFiber } from '@react-three/fiber'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      perspectiveCamera: ReactThreeFiber.Object3DNode<
        THREE.PerspectiveCamera,
        typeof THREE.PerspectiveCamera
      >
      directionalLight: ReactThreeFiber.Object3DNode<
        THREE.DirectionalLight,
        typeof THREE.DirectionalLight
      >
      ambientLight: ReactThreeFiber.Object3DNode<
        THREE.AmbientLight,
        typeof THREE.AmbientLight
      >
    }
  }
}

export interface ThreeContext {
  gl: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.Camera
  size: { width: number; height: number }
  viewport: { width: number; height: number; factor: number }
}

export interface ThreePerformanceMetrics {
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