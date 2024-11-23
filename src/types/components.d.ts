import { ReactNode } from 'react'
import { SpringValue } from '@react-spring/three'
import * as THREE from 'three'

export interface ProfileCardProps {
  scale?: SpringValue<number[]>
  position?: [number, number, number]
  rotation?: [number, number, number]
  onClick?: (event: THREE.Event) => void
  onHover?: (event: THREE.Event) => void
}

export interface CanvasContainerProps {
  children: ReactNode
  className?: string
  fallback?: ReactNode
}

export interface LoaderProps {
  progress?: number
  message?: string
}

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode | ((error: Error) => ReactNode)
}

export interface ControlsProps {
  enableZoom?: boolean
  enablePan?: boolean
  enableRotate?: boolean
  maxDistance?: number
  minDistance?: number
}

export interface CubeProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  color?: string
  wireframe?: boolean
  metalness?: number
  roughness?: number
  autoRotate?: boolean
  rotationSpeed?: number
  castShadow?: boolean
  receiveShadow?: boolean
  onClick?: (event: THREE.Event) => void
  onHover?: (event: THREE.Event) => void
} 