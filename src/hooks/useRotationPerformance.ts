'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

interface PerformanceMetrics {
  fps: number
  frameTime: number
  rotationUpdates: number
}

export function useRotationPerformance() {
  const metricsRef = useRef<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    rotationUpdates: 0,
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const updateCountRef = useRef(0)

  useFrame(() => {
    frameCountRef.current++
    updateCountRef.current++

    const now = performance.now()
    const elapsed = now - lastTimeRef.current

    if (elapsed >= 1000) {
      metricsRef.current = {
        fps: Math.round((frameCountRef.current * 1000) / elapsed),
        frameTime: elapsed / frameCountRef.current,
        rotationUpdates: updateCountRef.current,
      }

      frameCountRef.current = 0
      updateCountRef.current = 0
      lastTimeRef.current = now
    }
  })

  useEffect(() => {
    return () => {
      frameCountRef.current = 0
      updateCountRef.current = 0
    }
  }, [])

  return metricsRef.current
} 