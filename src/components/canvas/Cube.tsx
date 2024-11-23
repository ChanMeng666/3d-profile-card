'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCubeStore, cubeActions, selectRotation, selectMaterial } from '@/store/cubeStore'
import type { CubeProps } from '@/types'

export function Cube({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  ...props
}: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // 使用状态选择器
  const rotation = useCubeStore(selectRotation)
  const material = useCubeStore(selectMaterial)
  
  // 动画更新
  useFrame((_, delta) => {
    if (!meshRef.current || !rotation.isEnabled) return
    
    meshRef.current.rotation.x += rotation.speed * rotation.direction[0] * delta
    meshRef.current.rotation.y += rotation.speed * rotation.direction[1] * delta
    meshRef.current.rotation.z += rotation.speed * rotation.direction[2] * delta
  })

  // 事件处理
  const handlePointerOver = () => {
    cubeActions.handleInteraction(true, false)
  }

  const handlePointerOut = () => {
    cubeActions.handleInteraction(false, false)
  }

  const handleClick = () => {
    cubeActions.handleInteraction(false, true)
  }

  // 清理
  useEffect(() => {
    return () => {
      useCubeStore.getState().reset()
    }
  }, [])

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      {...props}
    >
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial
        color={material.color}
        metalness={material.metalness}
        roughness={material.roughness}
        wireframe={material.wireframe}
        transparent
        opacity={material.opacity}
      />
    </mesh>
  )
} 