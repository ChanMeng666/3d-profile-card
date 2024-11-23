import { useInteractionStore } from '@/store/interactionStore'
import * as THREE from 'three'

export class InteractionEventHandler {
  private static isProcessing = false
  private static debounceTimeout: NodeJS.Timeout | null = null

  // 点击事件处理
  static handleClick(event: THREE.Event, contentId?: string) {
    event.stopPropagation()
    
    if (this.isProcessing) return
    this.isProcessing = true

    const store = useInteractionStore.getState()
    
    if (contentId) {
      if (store.activeContent === contentId) {
        store.hideContent()
      } else {
        store.showContent(contentId)
      }
    } else {
      store.togglePanel()
    }

    // 防抖处理
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
    }
    
    this.debounceTimeout = setTimeout(() => {
      this.isProcessing = false
    }, 300)
  }

  // 悬停事件处理
  static handleHover(event: THREE.Event, isEnter: boolean) {
    event.stopPropagation()
    
    const store = useInteractionStore.getState()
    
    if (isEnter) {
      store.setTransitionPhase('enter')
    } else {
      store.setTransitionPhase('leave')
    }
  }
} 