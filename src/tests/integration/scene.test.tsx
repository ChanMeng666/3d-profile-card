import { render, act } from '@testing-library/react'
import { Scene } from '@/components/canvas/Scene'
import { useCubeStore } from '@/store/cubeStore'
import { optimizationTools } from '@/utils/performance'

describe('Scene Integration', () => {
  beforeEach(() => {
    useCubeStore.getState().reset()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('initializes scene with all components', () => {
    const { container } = render(<Scene />)
    
    expect(container.querySelector('canvas')).toBeTruthy()
    expect(container.querySelector('mesh')).toBeTruthy()
    expect(container.querySelector('ambientLight')).toBeTruthy()
  })

  it('handles state changes correctly', () => {
    render(<Scene />)
    
    act(() => {
      useCubeStore.getState().setRotation({ isEnabled: false })
    })
    
    expect(useCubeStore.getState().rotation.isEnabled).toBe(false)
  })

  it('manages resources efficiently', () => {
    const { unmount } = render(<Scene />)
    
    // 模拟资源加载
    const materialCache = optimizationTools.MaterialCache
    const memoryManager = optimizationTools.MemoryManager
    
    act(() => {
      unmount()
    })
    
    // 验证资源清理
    expect(materialCache.getMaterial('test')).toBeUndefined()
    // 验证内存管理
    const metrics = optimizationTools.PerformanceMonitor.getMetrics()
    expect(metrics.memory.geometries).toBe(0)
  })
}) 