'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { animationManager, AnimationFactory, Easing } from '@/utils/animations'

interface AnimatedMeshProps {
  position?: [number, number, number]
  color?: string
  targetPosition?: [number, number, number]
  targetColor?: string
}

export function AnimatedMesh({
  position = [0, 0, 0],
  color = '#4f46e5',
  targetPosition,
  targetColor,
}: AnimatedMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const queueId = useRef(`mesh-${Math.random()}`)

  useEffect(() => {
    if (!meshRef.current || !targetPosition || !targetColor) return

    // 创建动画队列
    const queue = animationManager.createQueue(queueId.current)

    // 创建位置动画
    const positionAnimation = AnimationFactory.createVector3Animation({
      from: position,
      to: targetPosition,
      duration: 1000,
      easing: Easing.easeInOut,
      onUpdate: (value) => {
        if (meshRef.current) {
          meshRef.current.position.copy(value)
        }
      }
    })

    // 创建颜色动画
    const colorAnimation = AnimationFactory.createColorAnimation({
      from: color,
      to: targetColor,
      duration: 1000,
      easing: Easing.easeInOut,
      onUpdate: (value) => {
        if (meshRef.current) {
          (meshRef.current.material as THREE.MeshStandardMaterial).color.copy(value)
        }
      }
    })

    // 添加动画到队列
    animationManager.addToQueue(queueId.current, positionAnimation)
    animationManager.addToQueue(queueId.current, colorAnimation)

    // 开始动画
    animationManager.start(queueId.current)

    return () => {
      animationManager.stop(queueId.current)
    }
  }, [position, color, targetPosition, targetColor])

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
} 