import { StateCreator } from 'zustand'
import type { GestureState } from './gesture'
import type { CameraConfig } from './camera'
import type { AnimationConfig } from './animation'

// 鼠标状态
export interface MouseState {
  position: [number, number]
  isDown: boolean
  isDragging: boolean
  lastClick: Date | null
  clickCount: number
}

// 视角状态
export interface ViewState {
  camera: CameraConfig
  target: [number, number, number]
  zoom: number
  isTransitioning: boolean
}

// 动画状态
export interface AnimationState {
  isPlaying: boolean
  currentTime: number
  duration: number
  progress: number
  queue: string[]
}

// 信息展示状态
export interface InfoState {
  isVisible: boolean
  content: string | null
  position: 'left' | 'right'
  theme: 'light' | 'dark'
}

// 调试状态
export interface DebugState {
  isEnabled: boolean
  showStats: boolean
  showHelpers: boolean
  logLevel: 'error' | 'warn' | 'info' | 'debug'
}

// 根状态
export interface RootState {
  mouse: MouseState
  view: ViewState
  animation: AnimationState
  info: InfoState
  debug: DebugState
  gesture: GestureState
  
  // 状态更新方法
  setMouse: (state: Partial<MouseState>) => void
  setView: (state: Partial<ViewState>) => void
  setAnimation: (state: Partial<AnimationState>) => void
  setInfo: (state: Partial<InfoState>) => void
  setDebug: (state: Partial<DebugState>) => void
  setGesture: (state: Partial<GestureState>) => void
  
  // 重置方法
  reset: () => void
}

// Store切片类型
export type MouseSlice = StateCreator<RootState, [], [], MouseState>
export type ViewSlice = StateCreator<RootState, [], [], ViewState>
export type AnimationSlice = StateCreator<RootState, [], [], AnimationState>
export type InfoSlice = StateCreator<RootState, [], [], InfoState>
export type DebugSlice = StateCreator<RootState, [], [], DebugState>
export type GestureSlice = StateCreator<RootState, [], [], GestureState> 