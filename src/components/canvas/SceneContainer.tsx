'use client'

import { useThree, useFrame } from '@react-three/fiber'
import { useEffect, type PropsWithChildren } from 'react'

export function SceneContainer({ children }: PropsWithChildren) {
  const { gl, camera } = useThree()

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      gl.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [camera, gl])

  // 性能优化：限制帧率
  useFrame((_, delta) => {
    // 限制最大帧率为60fps
    if (delta < 1 / 60) return
  })

  return <>{children}</>
} 