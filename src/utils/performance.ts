import * as THREE from 'three'
import { isMobile } from '@/utils/device'

// 事件优化管理器
class EventOptimizer {
  private static instance: EventOptimizer
  private eventQueue: Map<string, Set<Function>>
  private isProcessing: boolean
  private rafId: number | null

  private constructor() {
    this.eventQueue = new Map()
    this.isProcessing = false
    this.rafId = null
  }

  static getInstance() {
    if (!EventOptimizer.instance) {
      EventOptimizer.instance = new EventOptimizer()
    }
    return EventOptimizer.instance
  }

  // 添加事件处理器
  addHandler(eventType: string, handler: Function) {
    if (!this.eventQueue.has(eventType)) {
      this.eventQueue.set(eventType, new Set())
    }
    this.eventQueue.get(eventType)!.add(handler)
  }

  // 移除事件处理器
  removeHandler(eventType: string, handler: Function) {
    const handlers = this.eventQueue.get(eventType)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  // 触发事件
  trigger(eventType: string, event: any) {
    const handlers = this.eventQueue.get(eventType)
    if (!handlers) return

    if (!this.isProcessing) {
      this.isProcessing = true
      this.rafId = requestAnimationFrame(() => {
        handlers.forEach(handler => handler(event))
        this.isProcessing = false
        this.rafId = null
      })
    }
  }

  // 清理
  dispose() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
    this.eventQueue.clear()
  }
}

// 渲染优化管理器
class RenderOptimizer {
  private static instance: RenderOptimizer
  private renderer: THREE.WebGLRenderer | null
  private scene: THREE.Scene | null
  private camera: THREE.Camera | null
  private renderQueue: Set<THREE.Object3D>
  private isRendering: boolean
  private rafId: number | null
  private lastFrameTime: number
  private frameCount: number
  private targetFPS: number

  private constructor() {
    this.renderer = null
    this.scene = null
    this.camera = null
    this.renderQueue = new Set()
    this.isRendering = false
    this.rafId = null
    this.lastFrameTime = 0
    this.frameCount = 0
    this.targetFPS = isMobile() ? 30 : 60
  }

  static getInstance() {
    if (!RenderOptimizer.instance) {
      RenderOptimizer.instance = new RenderOptimizer()
    }
    return RenderOptimizer.instance
  }

  // 初始化
  init(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
    this.setupOptimizations()
  }

  // 设置优化
  private setupOptimizations() {
    if (!this.renderer) return

    // 基础优化
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.autoUpdate = false
    this.renderer.shadowMap.needsUpdate = true
    this.renderer.sortObjects = false

    // 移动端优化
    if (isMobile()) {
      this.renderer.setSize(
        window.innerWidth * 0.8,
        window.innerHeight * 0.8,
        false
      )
      this.renderer.shadowMap.enabled = false
    }
  }

  // 添加到渲染队列
  addToRenderQueue(object: THREE.Object3D) {
    this.renderQueue.add(object)
    if (!this.isRendering) {
      this.startRenderLoop()
    }
  }

  // 从渲染队列移除
  removeFromRenderQueue(object: THREE.Object3D) {
    this.renderQueue.delete(object)
    if (this.renderQueue.size === 0) {
      this.stopRenderLoop()
    }
  }

  // 开始渲染循环
  private startRenderLoop() {
    if (!this.renderer || !this.scene || !this.camera) return

    this.isRendering = true
    const animate = () => {
      const now = performance.now()
      const elapsed = now - this.lastFrameTime

      if (elapsed >= (1000 / this.targetFPS)) {
        this.frameCount++
        this.lastFrameTime = now

        this.renderQueue.forEach(object => {
          if (object.visible) {
            object.updateMatrixWorld()
          }
        })

        this.renderer!.render(this.scene!, this.camera!)
      }

      this.rafId = requestAnimationFrame(animate)
    }

    this.rafId = requestAnimationFrame(animate)
  }

  // 停止渲染循环
  private stopRenderLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.isRendering = false
  }

  // 获取性能统计
  getStats() {
    return {
      fps: Math.round(this.frameCount / ((performance.now() - this.lastFrameTime) / 1000)),
      objectCount: this.renderQueue.size,
      isRendering: this.isRendering,
    }
  }

  // 清理
  dispose() {
    this.stopRenderLoop()
    this.renderQueue.clear()
  }
}

// 性能监控器
class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: {
    fps: number[]
    memory: {
      geometries: number[]
      textures: number[]
    }
    render: {
      calls: number[]
      triangles: number[]
    }
    events: {
      count: number[]
      latency: number[]
    }
  }
  private maxSamples: number
  private sampleInterval: number
  private intervalId: NodeJS.Timeout | null

  private constructor() {
    this.metrics = {
      fps: [],
      memory: {
        geometries: [],
        textures: [],
      },
      render: {
        calls: [],
        triangles: [],
      },
      events: {
        count: [],
        latency: [],
      },
    }
    this.maxSamples = 60
    this.sampleInterval = 1000
    this.intervalId = null
  }

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // 开始监控
  startMonitoring() {
    if (this.intervalId) return

    this.intervalId = setInterval(() => {
      this.collectMetrics()
    }, this.sampleInterval)
  }

  // 停止监控
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  // 收集指标
  private collectMetrics() {
    const renderStats = RenderOptimizer.getInstance().getStats()
    const renderer = RenderOptimizer.getInstance().renderer

    if (!renderer) return

    // 更新FPS
    this.updateMetric('fps', renderStats.fps)

    // 更新内存指标
    this.updateMetric('memory.geometries', renderer.info.memory.geometries)
    this.updateMetric('memory.textures', renderer.info.memory.textures)

    // 更新渲染指标
    this.updateMetric('render.calls', renderer.info.render.calls)
    this.updateMetric('render.triangles', renderer.info.render.triangles)

    // 更新事件指标
    const eventQueue = EventOptimizer.getInstance().eventQueue
    this.updateMetric('events.count', Array.from(eventQueue.values()).reduce((acc, set) => acc + set.size, 0))
  }

  // 更新指标
  private updateMetric(path: string, value: number) {
    const parts = path.split('.')
    let current: any = this.metrics
    
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]]
    }
    
    const array = current[parts[parts.length - 1]]
    array.push(value)
    
    if (array.length > this.maxSamples) {
      array.shift()
    }
  }

  // 生成报告
  generateReport() {
    return {
      fps: {
        average: this.calculateAverage(this.metrics.fps),
        min: Math.min(...this.metrics.fps),
        max: Math.max(...this.metrics.fps),
      },
      memory: {
        geometries: this.calculateAverage(this.metrics.memory.geometries),
        textures: this.calculateAverage(this.metrics.memory.textures),
      },
      render: {
        calls: this.calculateAverage(this.metrics.render.calls),
        triangles: this.calculateAverage(this.metrics.render.triangles),
      },
      events: {
        count: this.calculateAverage(this.metrics.events.count),
        latency: this.calculateAverage(this.metrics.events.latency),
      },
    }
  }

  private calculateAverage(array: number[]) {
    return array.length > 0
      ? array.reduce((a, b) => a + b, 0) / array.length
      : 0
  }
}

// 导出优化工具
export const performanceTools = {
  event: EventOptimizer.getInstance(),
  render: RenderOptimizer.getInstance(),
  monitor: PerformanceMonitor.getInstance(),
} 