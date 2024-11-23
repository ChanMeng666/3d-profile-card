'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { lerp } from '@/utils'
import type { RotationConfig, RotationState, UseRotationReturn } from '@/types/hooks'

const DEFAULT_CONFIG: Required<RotationConfig> = {
  enabled: true,
  speed: 0.01,
  direction: [1, 1, 0],
  damping: 0.95,
  maxSpeed: 0.1,
  minSpeed: 0.001,
}

export function useRotation(config: RotationConfig = {}): UseRotationReturn {
  // 合并配置
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  // 状态管理
  const [state, setState] = useState<RotationState>({
    isRotating: finalConfig.enabled,
    currentSpeed: finalConfig.speed,
    currentDirection: finalConfig.direction,
    targetRotation: [0, 0, 0],
  })

  // 引用值
  const rotationRef = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0))
  const lastTimeRef = useRef<number>(0)
  const frameCountRef = useRef<number>(0)

  // 动画更新
  useFrame((_, delta) => {
    if (!state.isRotating) return

    // 性能优化：限制帧率
    frameCountRef.current++
    if (frameCountRef.current % 2 !== 0) return

    const now = performance.now()
    const timeDelta = now - lastTimeRef.current
    lastTimeRef.current = now

    // 计算旋转增量
    const rotationDelta = state.currentSpeed * (timeDelta / 16.67) // 基于60fps标准化

    // 应用旋转
    rotationRef.current.x += rotationDelta * state.currentDirection[0]
    rotationRef.current.y += rotationDelta * state.currentDirection[1]
    rotationRef.current.z += rotationDelta * state.currentDirection[2]

    // 应用阻尼
    const dampedSpeed = state.currentSpeed * finalConfig.damping
    if (dampedSpeed > finalConfig.minSpeed) {
      setState(prev => ({
        ...prev,
        currentSpeed: dampedSpeed,
      }))
    }
  })

  // 控制函数
  const toggleRotation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRotating: !prev.isRotating,
    }))
  }, [])

  const setSpeed = useCallback((speed: number) => {
    const clampedSpeed = Math.min(Math.max(speed, finalConfig.minSpeed), finalConfig.maxSpeed)
    setState(prev => ({
      ...prev,
      currentSpeed: clampedSpeed,
    }))
  }, [finalConfig.maxSpeed, finalConfig.minSpeed])

  const setDirection = useCallback((direction: [number, number, number]) => {
    setState(prev => ({
      ...prev,
      currentDirection: direction,
    }))
  }, [])

  const reset = useCallback(() => {
    setState({
      isRotating: finalConfig.enabled,
      currentSpeed: finalConfig.speed,
      currentDirection: finalConfig.direction,
      targetRotation: [0, 0, 0],
    })
    rotationRef.current.set(0, 0, 0)
  }, [finalConfig])

  // 清理函数
  useEffect(() => {
    return () => {
      frameCountRef.current = 0
      lastTimeRef.current = 0
    }
  }, [])

  // 返回当前旋转状态和控制函数
  return {
    rotation: [
      rotationRef.current.x,
      rotationRef.current.y,
      rotationRef.current.z,
    ],
    isRotating: state.isRotating,
    speed: state.currentSpeed,
    toggleRotation,
    setSpeed,
    setDirection,
    reset,
  }
} 