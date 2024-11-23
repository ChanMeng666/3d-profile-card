import { useThree, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { getOptimalDPR } from '@/utils/three'

// 相机控制hook
export const useCamera = (initialPosition?: [number, number, number]) => {
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3(...(initialPosition || [0, 0, 5])))

  useFrame(() => {
    camera.position.lerp(targetPosition.current, 0.1)
  })

  return {
    setTargetPosition: (position: [number, number, number]) => {
      targetPosition.current.set(...position)
    },
    resetPosition: () => {
      targetPosition.current.set(...(initialPosition || [0, 0, 5]))
    }
  }
}

// 性能监控hook
export const usePerformanceMonitor = () => {
  const [fps, setFps] = useState(0)
  const frames = useRef(0)
  const prevTime = useRef(performance.now())

  useFrame(() => {
    frames.current++
    const time = performance.now()
    
    if (time >= prevTime.current + 1000) {
      setFps(Math.round((frames.current * 1000) / (time - prevTime.current)))
      frames.current = 0
      prevTime.current = time
    }
  })

  return { fps }
}

// 响应式尺寸hook
export const useResponsiveSize = () => {
  const { size, viewport } = useThree()
  const [dpr, setDpr] = useState(getOptimalDPR())

  useEffect(() => {
    const handleResize = () => {
      setDpr(getOptimalDPR())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    size,
    viewport,
    dpr,
    aspect: size.width / size.height
  }
} 