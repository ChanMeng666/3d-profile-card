'use client'

import { useEffect } from 'react'
import { useStore, storeUtils } from '@/store'

export function InteractiveScene() {
  const debug = useStore((state) => state.debug)
  const setDebug = useStore((state) => state.setDebug)
  
  // 启用调试工具
  useEffect(() => {
    if (debug.isEnabled) {
      // 跟踪视角变化
      storeUtils.debug.trackChanges('view')
      
      // 跟踪动画状态
      storeUtils.debug.trackChanges('animation')
      
      // 启用性能监控
      const stopTracking = storeUtils.debug.enablePerformanceTracking()
      return () => stopTracking()
    }
  }, [debug.isEnabled])

  // 状态同步
  useEffect(() => {
    // 监听其他标签页的状态变化
    const unsubscribe = storeUtils.sync.listen((event, data) => {
      if (event === 'stateChange') {
        // 更新本地状态
        useStore.setState(data)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div>
      {/* 调试面板 */}
      {debug.isEnabled && debug.showStats && (
        <div className="fixed top-0 left-0 p-4 bg-black/50 text-white">
          <pre>{JSON.stringify(useStore.getState(), null, 2)}</pre>
        </div>
      )}
      
      {/* 场景内容 */}
      {/* ... */}
    </div>
  )
} 