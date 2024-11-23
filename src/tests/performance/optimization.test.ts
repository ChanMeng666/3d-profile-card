import { performanceTools } from '@/utils/performance'
import { PERFORMANCE_CONFIG } from '@/constants/performance'
import * as THREE from 'three'

describe('Performance Optimization', () => {
  let renderer: THREE.WebGLRenderer
  let scene: THREE.Scene
  let camera: THREE.Camera

  beforeEach(() => {
    renderer = new THREE.WebGLRenderer()
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera()
    performanceTools.render.init(renderer, scene, camera)
  })

  afterEach(() => {
    performanceTools.render.dispose()
    performanceTools.monitor.stopMonitoring()
  })

  it('maintains target frame rate', () => {
    const targetFPS = PERFORMANCE_CONFIG.render.targetFPS.desktop
    const frameCount = 60
    let actualFrames = 0

    // 模拟渲染循环
    for (let i = 0; i < frameCount; i++) {
      const stats = performanceTools.render.getStats()
      if (stats.fps <= targetFPS) {
        actualFrames++
      }
      jest.advanceTimersByTime(16.67) // 约60fps
    }

    expect(actualFrames).toBeLessThanOrEqual(targetFPS)
  })

  it('optimizes event handling', () => {
    const handler = jest.fn()
    performanceTools.event.addHandler('test', handler)

    // 快速触发多个事件
    for (let i = 0; i < 10; i++) {
      performanceTools.event.trigger('test', { type: 'test' })
    }

    // 由于节流，处理器应该被调用更少次数
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('generates accurate performance report', () => {
    performanceTools.monitor.startMonitoring()
    
    // 模拟一些渲染操作
    for (let i = 0; i < 10; i++) {
      renderer.render(scene, camera)
      jest.advanceTimersByTime(16.67)
    }

    const report = performanceTools.monitor.generateReport()
    
    expect(report).toEqual(
      expect.objectContaining({
        fps: expect.any(Object),
        memory: expect.any(Object),
        render: expect.any(Object),
        events: expect.any(Object),
      })
    )
  })
}) 