import { Vector3Tuple } from 'three'

export interface RotationConfig {
  enabled?: boolean
  speed?: number
  direction?: Vector3Tuple
  damping?: number
  maxSpeed?: number
  minSpeed?: number
}

export interface RotationState {
  isRotating: boolean
  currentSpeed: number
  currentDirection: Vector3Tuple
  targetRotation: Vector3Tuple
}

export interface UseRotationReturn {
  rotation: Vector3Tuple
  isRotating: boolean
  speed: number
  toggleRotation: () => void
  setSpeed: (speed: number) => void
  setDirection: (direction: Vector3Tuple) => void
  reset: () => void
} 