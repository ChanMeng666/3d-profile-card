import * as THREE from 'three'

export interface GestureState {
  // 基础状态
  active: boolean
  initial: boolean
  touches: Touch[]
  event: TouchEvent | null
  
  // 位置信息
  xy: [number, number]
  initial_xy: [number, number]
  delta: [number, number]
  movement: [number, number]
  offset: [number, number]
  
  // 缩放信息
  scale: number
  initial_scale: number
  da: [number, number] // 距离和角度
  
  // 旋转信息
  rotation: number
  initial_rotation: number
  
  // 速度信息
  velocity: [number, number]
  direction: [number, number]
  distance: number
  
  // 时间信息
  timeStamp: number
  startTime: number
  elapsedTime: number
}

export interface GestureConfig {
  // 启用配置
  enablePinch?: boolean
  enableRotate?: boolean
  enablePan?: boolean
  enableLongPress?: boolean
  
  // 阈值配置
  minDistance?: number
  minScale?: number
  minRotation?: number
  longPressDelay?: number
  
  // 边界配置
  bounds?: {
    min: THREE.Vector3
    max: THREE.Vector3
  }
  
  // 惯性配置
  momentum?: boolean
  momentumFactor?: number
  momentumDecay?: number
}

export interface GestureHandlers {
  onStart?: (state: GestureState) => void
  onMove?: (state: GestureState) => void
  onEnd?: (state: GestureState) => void
  onPinch?: (scale: number, event: TouchEvent) => void
  onRotate?: (rotation: number, event: TouchEvent) => void
  onPan?: (delta: [number, number], event: TouchEvent) => void
  onLongPress?: (position: [number, number], event: TouchEvent) => void
} 