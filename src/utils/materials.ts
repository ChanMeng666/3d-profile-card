import * as THREE from 'three'
import { MATERIAL_CONFIGS, FaceType } from '@/constants/materials'

export class MaterialLoader {
  private materials: Map<FaceType, THREE.MeshStandardMaterial>
  private textures: Map<FaceType, THREE.Texture>
  private textureLoader: THREE.TextureLoader

  constructor() {
    this.materials = new Map()
    this.textures = new Map()
    this.textureLoader = new THREE.TextureLoader()
  }

  async loadTexture(face: FaceType, url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          this.textures.set(face, texture)
          resolve(texture)
        },
        undefined,
        reject
      )
    })
  }

  createMaterial(face: FaceType): THREE.MeshStandardMaterial {
    const config = MATERIAL_CONFIGS[face]
    const material = new THREE.MeshStandardMaterial({
      color: config.baseColor,
      roughness: config.roughness,
      metalness: config.metalness,
      envMapIntensity: config.envMapIntensity,
    })
    
    this.materials.set(face, material)
    return material
  }

  getMaterial(face: FaceType): THREE.MeshStandardMaterial {
    return this.materials.get(face) || this.createMaterial(face)
  }

  updateMaterial(face: FaceType, updates: Partial<THREE.MaterialParameters>) {
    const material = this.getMaterial(face)
    Object.assign(material, updates)
    material.needsUpdate = true
  }
} 