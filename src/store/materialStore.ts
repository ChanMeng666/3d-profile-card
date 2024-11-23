import { create } from 'zustand'
import { FaceType, FACE_TYPES, MATERIAL_CONFIGS } from '@/constants/materials'
import * as THREE from 'three'

interface MaterialState {
  activeFace: FaceType | null
  hoveredFace: FaceType | null
  materials: Map<FaceType, THREE.MeshStandardMaterial>
  setActiveFace: (face: FaceType | null) => void
  setHoveredFace: (face: FaceType | null) => void
  updateMaterial: (face: FaceType, updates: Partial<THREE.MaterialParameters>) => void
}

export const useMaterialStore = create<MaterialState>((set, get) => ({
  activeFace: null,
  hoveredFace: null,
  materials: new Map(),
  
  setActiveFace: (face) => set({ activeFace: face }),
  
  setHoveredFace: (face) => set({ hoveredFace: face }),
  
  updateMaterial: (face, updates) => {
    const { materials } = get()
    const material = materials.get(face)
    if (material) {
      Object.assign(material, updates)
      material.needsUpdate = true
      set({ materials: new Map(materials) })
    }
  },
})) 