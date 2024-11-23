'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { optimizationTools } from '@/utils/performance'
import { PERFORMANCE_CONFIG } from '@/constants/performance'

interface OptimizedMeshProps {
  geometry: THREE.BufferGeometry
  material: THREE.Material
  count?: number
  position?: [number, number, number]
}

export function OptimizedMesh({
  geometry,
  material,
  count = 1,
  position = [0, 0, 0],
}: OptimizedMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (!meshRef.current) return

    // 优化几何体
    const optimizedGeometry = count > PERFORMANCE_CONFIG.geometry.instanceThreshold
      ? optimizationTools.GeometryOptimizer.createInstancedGeometry(geometry, count)
      : optimizationTools.GeometryOptimizer.optimizeGeometry(geometry)

    // 缓存材质
    const materialKey = material.uuid
    let optimizedMaterial = optimizationTools.MaterialCache.getMaterial(materialKey)
    if (!optimizedMaterial) {
      optimizedMaterial = material
      optimizationTools.MaterialCache.addMaterial(materialKey, material)
    }

    // 跟踪资源
    optimizationTools.MemoryManager.track(optimizedGeometry)
    optimizationTools.MemoryManager.track(optimizedMaterial)

    // 清理函数
    return () => {
      optimizationTools.MemoryManager.untrack(optimizedGeometry)
      optimizationTools.MemoryManager.untrack(optimizedMaterial)
    }
  }, [geometry, material, count])

  return (
    <mesh
      ref={meshRef}
      position={position}
    >
      <primitive object={geometry} />
      <primitive object={material} />
    </mesh>
  )
} 