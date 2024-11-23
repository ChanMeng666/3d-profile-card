export * from './three'
export * from './scene'
export * from './components'
export * from './store'
export * from './utils'

// 全局通用类型
export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface Euler {
  x: number
  y: number
  z: number
  order?: 'XYZ' | 'YXZ' | 'ZXY' | 'ZYX' | 'YZX' | 'XZY'
}

export interface Size {
  width: number
  height: number
}

export interface Viewport extends Size {
  factor: number
  distance: number
  aspect: number
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Nullable<T> = T | null

export type Optional<T> = T | undefined 