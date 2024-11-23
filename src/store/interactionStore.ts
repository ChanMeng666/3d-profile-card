import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { useAudio } from '@/hooks/useAudio'

interface PanelState {
  isExpanded: boolean
  activeContent: string | null
  transitionPhase: 'enter' | 'leave' | 'idle'
  lastInteraction: Date | null
}

interface InteractionState extends PanelState {
  // 面板控制
  expandPanel: () => void
  collapsePanel: () => void
  togglePanel: () => void
  
  // 内容控制
  showContent: (contentId: string) => void
  hideContent: () => void
  
  // 动画控制
  setTransitionPhase: (phase: PanelState['transitionPhase']) => void
  
  // 状态重置
  reset: () => void
}

const initialState: PanelState = {
  isExpanded: false,
  activeContent: null,
  transitionPhase: 'idle',
  lastInteraction: null,
}

export const useInteractionStore = create<InteractionState>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    expandPanel: () => {
      const { playExpandSound } = useAudio('/sounds/expand.mp3', { volume: 0.5 })
      set({
        isExpanded: true,
        transitionPhase: 'enter',
        lastInteraction: new Date(),
      })
      playExpandSound()
    },

    collapsePanel: () => {
      const { playCollapseSound } = useAudio('/sounds/collapse.mp3', { volume: 0.5 })
      set({
        isExpanded: false,
        activeContent: null,
        transitionPhase: 'leave',
        lastInteraction: new Date(),
      })
      playCollapseSound()
    },

    togglePanel: () => {
      const { isExpanded } = get()
      if (isExpanded) {
        get().collapsePanel()
      } else {
        get().expandPanel()
      }
    },

    showContent: (contentId: string) => {
      const { playShowSound } = useAudio('/sounds/show.mp3', { volume: 0.5 })
      set({
        activeContent: contentId,
        transitionPhase: 'enter',
        lastInteraction: new Date(),
      })
      playShowSound()
    },

    hideContent: () => {
      const { playHideSound } = useAudio('/sounds/hide.mp3', { volume: 0.5 })
      set({
        activeContent: null,
        transitionPhase: 'leave',
        lastInteraction: new Date(),
      })
      playHideSound()
    },

    setTransitionPhase: (phase) => {
      set({ transitionPhase: phase })
    },

    reset: () => {
      set(initialState)
    },
  }))
) 