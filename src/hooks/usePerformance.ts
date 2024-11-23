'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { optimizationTools } from '@/utils/performance'
import { PERFORMANCE_CONFIG } from '@/constants/performance'

export function usePerformance() {
  const { gl, scene } = useThree()
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useEffect(() => {
    // 设置渲染器优化
    optimizationTools.RenderOptimizer.setRenderer(gl)

    // 清理函数
    return () => {
      optimizationTools.MemoryManager.disposeAll()
      optimizationTools.MaterialCache.flushDisposeQueue()
    }
  }, [gl])

  useFrame(() => {
    frameCount.current++
    const now = performance.now()
    
    // 性能监控更新
    if (now - lastTime.current >= PERFORMANCE_CONFIG.monitoring.sampleInterval) {
      optimizationTools.PerformanceMonitor.update(gl, scene)
      
      if (PERFORMANCE_CONFIG.monitoring.logToConsole) {
        console.log('Performance Metrics:', optimizationTools.PerformanceMonitor.getMetrics())
      }
      
      frameCount.current = 0
      lastTime.current = now
    }
  })

  return optimizationTools.PerformanceMonitor.getMetrics()
} 