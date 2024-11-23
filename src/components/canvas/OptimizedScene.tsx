'use client'

import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { performanceTools } from '@/utils/performance'
import { PERFORMANCE_CONFIG } from '@/constants/performance'

export function OptimizedScene() {
  const { gl, scene, camera } = useThree()
  const statsRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    // 初始化渲染优化
    performanceTools.render.init(gl, scene, camera)
    
    // 开始性能监控
    performanceTools.monitor.startMonitoring()
    
    // 定期更新性能统计
    const intervalId = setInterval(() => {
      if (statsRef.current) {
        const report = performanceTools.monitor.generateReport()
        statsRef.current.textContent = JSON.stringify(report, null, 2)
      }
    }, 1000)
    
    return () => {
      clearInterval(intervalId)
      performanceTools.monitor.stopMonitoring()
      performanceTools.render.dispose()
    }
  }, [gl, scene, camera])

  return (
    <>
      {/* 性能统计面板 */}
      {process.env.NODE_ENV === 'development' && (
        <pre
          ref={statsRef}
          className="fixed top-0 left-0 p-4 bg-black/50 text-white text-xs"
        />
      )}
      
      {/* 场景内容 */}
      {/* ... */}
    </>
  )
} 