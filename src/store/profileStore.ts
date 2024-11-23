import { create } from 'zustand'
import { ProfileState } from '@/types'

export const useProfileStore = create<ProfileState>((set) => ({
  name: 'Your Name',
  title: 'Your Title',
  avatar: '/avatar.png',
  socialLinks: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com'
  },
  setProfile: (profile) => set(profile)
})) 