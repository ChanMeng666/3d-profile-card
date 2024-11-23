import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface CameraState {
  position: [number, number, number]
  target: [number, number, number]
  zoom: number
  setPosition: (position: [number, number, number]) => void
  setTarget: (target: [number, number, number]) => void
  setZoom: (zoom: number) => void
  reset: () => void
}

const initialState = {
  position: [0, 0, 5] as [number, number, number],
  target: [0, 0, 0] as [number, number, number],
  zoom: 1,
}

export const useCameraStore = create<CameraState>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    setPosition: (position) => set({ position }),
    setTarget: (target) => set({ target }),
    setZoom: (zoom) => set({ zoom }),
    reset: () => set(initialState),
  }))
)

// 相机动作
export const cameraActions = {
  focusOnObject: (position: [number, number, number], target: [number, number, number]) => {
    useCameraStore.getState().setPosition(position)
    useCameraStore.getState().setTarget(target)
  },

  zoomTo: (zoom: number) => {
    useCameraStore.getState().setZoom(zoom)
  },

  resetView: () => {
    useCameraStore.getState().reset()
  },
} 