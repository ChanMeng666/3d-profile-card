import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CubeState } from '@/types/store'
import { subscribeWithSelector } from 'zustand/middleware'

const initialState = {
  rotation: {
    isEnabled: true,
    speed: 0.01,
    direction: [1, 1, 0] as [number, number, number],
    currentRotation: [0, 0, 0] as [number, number, number],
  },
  material: {
    color: '#4f46e5',
    metalness: 0.5,
    roughness: 0.5,
    wireframe: false,
    opacity: 1,
  },
  animation: {
    isPlaying: true,
    currentFrame: 0,
    duration: 1000,
    easing: 'easeInOut' as const,
  },
  interaction: {
    isHovered: false,
    isSelected: false,
    lastInteraction: null,
    clickCount: 0,
  },
}

export const useCubeStore = create<CubeState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,

        setRotation: (rotation) => {
          set((state) => ({
            rotation: { ...state.rotation, ...rotation },
          }))
        },

        setMaterial: (material) => {
          set((state) => ({
            material: { ...state.material, ...material },
          }))
        },

        setAnimation: (animation) => {
          set((state) => ({
            animation: { ...state.animation, ...animation },
          }))
        },

        setInteraction: (interaction) => {
          const currentState = get()
          set((state) => ({
            interaction: {
              ...state.interaction,
              ...interaction,
              lastInteraction: new Date(),
              clickCount: interaction.isSelected 
                ? currentState.interaction.clickCount + 1 
                : currentState.interaction.clickCount,
            },
          }))
        },

        reset: () => {
          set(initialState)
        },
      }),
      {
        name: 'cube-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          rotation: state.rotation,
          material: state.material,
          animation: {
            ...state.animation,
            currentFrame: 0, // 不持久化当前帧
          },
        }),
      }
    )
  )
)

// 状态变更订阅
useCubeStore.subscribe(
  (state) => state.rotation.isEnabled,
  (isEnabled) => {
    console.log('Rotation state changed:', isEnabled)
  }
)

useCubeStore.subscribe(
  (state) => state.material,
  (material) => {
    console.log('Material state changed:', material)
  }
)

// 选择器
export const selectRotation = (state: CubeState) => state.rotation
export const selectMaterial = (state: CubeState) => state.material
export const selectAnimation = (state: CubeState) => state.animation
export const selectInteraction = (state: CubeState) => state.interaction

// 动作创建器
export const cubeActions = {
  toggleRotation: () => {
    const { rotation } = useCubeStore.getState()
    useCubeStore.getState().setRotation({ isEnabled: !rotation.isEnabled })
  },
  
  updateColor: (color: string) => {
    useCubeStore.getState().setMaterial({ color })
  },
  
  toggleAnimation: () => {
    const { animation } = useCubeStore.getState()
    useCubeStore.getState().setAnimation({ isPlaying: !animation.isPlaying })
  },
  
  handleInteraction: (isHovered: boolean, isSelected: boolean) => {
    useCubeStore.getState().setInteraction({ isHovered, isSelected })
  },
} 