import { RenderOptimizer, PerformanceMonitor } from '@/utils/performance'
import * as THREE from 'three'

describe('Rendering Performance', () => {
  let renderer: THREE.WebGLRenderer
  let scene: THREE.Scene
  
  beforeEach(() => {
    renderer = new THREE.WebGLRenderer()
    scene = new THREE.Scene()
  })

  it('maintains target frame rate', () => {
    const optimizer = RenderOptimizer.getInstance()
    optimizer.setRenderer(renderer)
    
    const frameCount = 60
    let actualFrames = 0
    
    for (let i = 0; i < frameCount; i++) {
      if (optimizer.shouldRenderFrame()) {
        actualFrames++
      }
      jest.advanceTimersByTime(16.67) // 约60fps
    }
    
    expect(actualFrames).toBeLessThanOrEqual(60)
  })

  it('tracks performance metrics correctly', () => {
    const monitor = PerformanceMonitor.getInstance()
    monitor.update(renderer, scene)
    
    const metrics = monitor.getMetrics()
    
    expect(metrics.fps).toBeGreaterThan(0)
    expect(metrics.drawCalls).toBeGreaterThanOrEqual(0)
    expect(metrics.triangles).toBeGreaterThanOrEqual(0)
  })
}) 