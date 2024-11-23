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