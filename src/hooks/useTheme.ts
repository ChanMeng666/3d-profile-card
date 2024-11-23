'use client'

import { create } from 'zustand'

interface ThemeState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

export const useTheme = create<ThemeState>((set) => ({
  theme: typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light'
    : 'light',
  setTheme: (theme) => set({ theme }),
})) 