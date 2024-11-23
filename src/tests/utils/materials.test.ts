import { MaterialCache } from '@/utils/performance'
import * as THREE from 'three'

describe('Material System', () => {
  let materialCache: typeof MaterialCache

  beforeEach(() => {
    materialCache = MaterialCache.getInstance()
  })

  it('caches materials correctly', () => {
    const material = new THREE.MeshStandardMaterial()
    const key = 'test-material'
    
    materialCache.addMaterial(key, material)
    const cachedMaterial = materialCache.getMaterial(key)
    
    expect(cachedMaterial).toBe(material)
  })

  it('disposes materials properly', () => {
    const material = new THREE.MeshStandardMaterial()
    const key = 'dispose-test'
    
    materialCache.addMaterial(key, material)
    materialCache.disposeMaterial(key)
    
    const cachedMaterial = materialCache.getMaterial(key)
    expect(cachedMaterial).toBeUndefined()
  })

  it('handles duplicate materials', () => {
    const material = new THREE.MeshStandardMaterial()
    const key = 'duplicate-test'
    
    materialCache.addMaterial(key, material)
    const duplicateMaterial = new THREE.MeshStandardMaterial()
    materialCache.addMaterial(key, duplicateMaterial)
    
    const cachedMaterial = materialCache.getMaterial(key)
    expect(cachedMaterial).toBe(material) // 应该保留第一个材质
  })
}) 