import { StateCreator } from 'zustand'

export interface ProfileState {
  name: string
  title: string
  avatar: string
  socialLinks: {
    github?: string
    twitter?: string
    linkedin?: string
  }
  theme: 'light' | 'dark'
  setProfile: (profile: Partial<Omit<ProfileState, 'setProfile'>>) => void
  setTheme: (theme: 'light' | 'dark') => void
}

export interface SceneStore {
  loading: boolean
  progress: number
  error: Error | null
  setLoading: (loading: boolean) => void
  setProgress: (progress: number) => void
  setError: (error: Error | null) => void
}

export interface CubeState {
  // 旋转状态
  rotation: {
    isEnabled: boolean
    speed: number
    direction: [number, number, number]
    currentRotation: [number, number, number]
  }
  // 材质状态
  material: {
    color: string
    metalness: number
    roughness: number
    wireframe: boolean
    opacity: number
  }
  // 动画状态
  animation: {
    isPlaying: boolean
    currentFrame: number
    duration: number
    easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
  }
  // 交互状态
  interaction: {
    isHovered: boolean
    isSelected: boolean
    lastInteraction: Date | null
    clickCount: number
  }
  // 状态操作方法
  setRotation: (rotation: Partial<CubeState['rotation']>) => void
  setMaterial: (material: Partial<CubeState['material']>) => void
  setAnimation: (animation: Partial<CubeState['animation']>) => void
  setInteraction: (interaction: Partial<CubeState['interaction']>) => void
  reset: () => void
}

export type ProfileSlice = StateCreator<
  ProfileState,
  [],
  [],
  ProfileState
>

export type SceneSlice = StateCreator<
  SceneStore,
  [],
  [],
  SceneStore
> 