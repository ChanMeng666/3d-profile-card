import { ReactNode } from 'react'
import * as THREE from 'three'

export interface SceneProps {
  children?: ReactNode
  className?: string
  camera?: THREE.Camera
  controls?: boolean
  lights?: boolean
  performance?: boolean
}

export interface SceneState {
  ready: boolean
  loading: boolean
  error: Error | null
}

export interface SceneContextValue {
  state: SceneState
  setReady: (ready: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
}

export interface SceneEnvironment {
  preset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby'
  background?: boolean
  blur?: number
  files?: string | string[]
} 