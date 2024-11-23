import { SpringValue } from '@react-spring/three'
import * as THREE from 'three'
import { MATERIAL_CONFIGS, FaceType } from '@/constants/materials'

export const createMaterialAnimation = (face: FaceType) => {
  const config = MATERIAL_CONFIGS[face]
  
  return {
    from: {
      color: config.baseColor,
      roughness: config.roughness,
      metalness: config.metalness,
      envMapIntensity: config.envMapIntensity,
    },
    to: async (next: (props: any) => Promise<void>) => {
      while (true) {
        await next({
          color: config.hoverColor,
          roughness: config.roughness * 0.8,
          metalness: config.metalness * 1.2,
          envMapIntensity: config.envMapIntensity * 1.2,
        })
        await next({
          color: config.baseColor,
          roughness: config.roughness,
          metalness: config.metalness,
          envMapIntensity: config.envMapIntensity,
        })
      }
    },
    config: {
      mass: 1,
      tension: 280,
      friction: 60,
    },
  }
}

export const interpolateColor = (
  color: SpringValue<THREE.Color>,
  from: THREE.Color,
  to: THREE.Color,
  t: number
) => {
  color.set(from.clone().lerp(to, t))
} 