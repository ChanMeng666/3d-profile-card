import * as THREE from 'three'

export interface AnimationConfig {
  duration?: number
  delay?: number
  easing?: (t: number) => number
  onStart?: () => void
  onUpdate?: (progress: number) => void
  onComplete?: () => void
}

export interface TransitionConfig extends AnimationConfig {
  from: any
  to: any
  interpolate?: (from: any, to: any, t: number) => any
}

export interface AnimationQueue {
  id: string
  animations: Animation[]
  isPlaying: boolean
  currentIndex: number
}

export interface Animation {
  id: string
  config: AnimationConfig
  startTime: number | null
  isComplete: boolean
  update: (deltaTime: number) => void
}

export type EasingFunction = (t: number) => number

export interface Vector3Animation extends AnimationConfig {
  from: THREE.Vector3 | [number, number, number]
  to: THREE.Vector3 | [number, number, number]
}

export interface ColorAnimation extends AnimationConfig {
  from: THREE.Color | string
  to: THREE.Color | string
} 