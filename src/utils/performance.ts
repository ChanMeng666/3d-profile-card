import * as THREE from 'three'

// 材质缓存管理器
class MaterialCache {
  private static instance: MaterialCache
  private cache: Map<string, THREE.Material>
  private disposeQueue: Set<THREE.Material>

  private constructor() {
    this.cache = new Map()
    this.disposeQueue = new Set()
  }

  static getInstance() {
    if (!MaterialCache.instance) {
      MaterialCache.instance = new MaterialCache()
    }
    return MaterialCache.instance
  }

  getMaterial(key: string): THREE.Material | undefined {
    return this.cache.get(key)
  }

  addMaterial(key: string, material: THREE.Material) {
    if (!this.cache.has(key)) {
      this.cache.set(key, material)
    }
  }

  disposeMaterial(key: string) {
    const material = this.cache.get(key)
    if (material) {
      this.disposeQueue.add(material)
      this.cache.delete(key)
    }
  }

  flushDisposeQueue() {
    this.disposeQueue.forEach(material => {
      material.dispose()
    })
    this.disposeQueue.clear()
  }
}

// 几何体优化管理器
class GeometryOptimizer {
  static optimizeGeometry(geometry: THREE.BufferGeometry) {
    // 合并顶点
    geometry.mergeVertices()
    // 计算法线
    geometry.computeVertexNormals()
    // 计算边界
    geometry.computeBoundingSphere()
    geometry.computeBoundingBox()
    return geometry
  }

  static createInstancedGeometry(
    baseGeometry: THREE.BufferGeometry,
    count: number
  ): THREE.InstancedBufferGeometry {
    const instancedGeometry = new THREE.InstancedBufferGeometry()
    instancedGeometry.copy(baseGeometry)
    
    // 添加实例化属性
    const instanceMatrix = new Float32Array(count * 16)
    instancedGeometry.setAttribute(
      'instanceMatrix',
      new THREE.InstancedBufferAttribute(instanceMatrix, 16)
    )
    
    return instancedGeometry
  }
}

// 渲染优化管理器
class RenderOptimizer {
  private static instance: RenderOptimizer
  private renderer: THREE.WebGLRenderer | null = null
  private lastFrameTime: number = 0
  private frameCount: number = 0
  private fpsLimit: number = 60

  private constructor() {}

  static getInstance() {
    if (!RenderOptimizer.instance) {
      RenderOptimizer.instance = new RenderOptimizer()
    }
    return RenderOptimizer.instance
  }

  setRenderer(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer
    this.setupOptimizations()
  }

  private setupOptimizations() {
    if (!this.renderer) return

    // 设置像素比
    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.renderer.setPixelRatio(pixelRatio)

    // 启用阴影优化
    this.renderer.shadowMap.autoUpdate = false
    this.renderer.shadowMap.needsUpdate = true

    // 启用场景优化
    this.renderer.sortObjects = false
  }

  shouldRenderFrame(): boolean {
    const now = performance.now()
    const elapsed = now - this.lastFrameTime

    if (elapsed >= (1000 / this.fpsLimit)) {
      this.lastFrameTime = now
      this.frameCount++
      return true
    }
    return false
  }

  getFrameStats() {
    return {
      frameCount: this.frameCount,
      fps: Math.round(this.frameCount / (performance.now() - this.lastFrameTime) * 1000),
    }
  }
}

// 内存管理器
class MemoryManager {
  private static instance: MemoryManager
  private disposables: Set<{ dispose: () => void }>
  private textureLoader: THREE.TextureLoader
  private loadingTextures: Map<string, Promise<THREE.Texture>>

  private constructor() {
    this.disposables = new Set()
    this.textureLoader = new THREE.TextureLoader()
    this.loadingTextures = new Map()
  }

  static getInstance() {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager()
    }
    return MemoryManager.instance
  }

  track(disposable: { dispose: () => void }) {
    this.disposables.add(disposable)
  }

  untrack(disposable: { dispose: () => void }) {
    this.disposables.delete(disposable)
  }

  disposeAll() {
    this.disposables.forEach(disposable => {
      disposable.dispose()
    })
    this.disposables.clear()
  }

  async loadTexture(url: string): Promise<THREE.Texture> {
    if (this.loadingTextures.has(url)) {
      return this.loadingTextures.get(url)!
    }

    const texturePromise = new Promise<THREE.Texture>((resolve, reject) => {
      this.textureLoader.load(
        url,
        texture => {
          this.track(texture)
          resolve(texture)
        },
        undefined,
        reject
      )
    })

    this.loadingTextures.set(url, texturePromise)
    return texturePromise
  }
}

// 性能监控器
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: {
    fps: number
    memory: {
      geometries: number
      textures: number
    }
    drawCalls: number
    triangles: number
  }

  private constructor() {
    this.metrics = {
      fps: 0,
      memory: {
        geometries: 0,
        textures: 0,
      },
      drawCalls: 0,
      triangles: 0,
    }
  }

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  update(renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
    const info = renderer.info
    this.metrics = {
      fps: RenderOptimizer.getInstance().getFrameStats().fps,
      memory: {
        geometries: info.memory.geometries,
        textures: info.memory.textures,
      },
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
    }
  }

  getMetrics() {
    return this.metrics
  }
}

// 导出优化工具
export const optimizationTools = {
  MaterialCache: MaterialCache.getInstance(),
  GeometryOptimizer,
  RenderOptimizer: RenderOptimizer.getInstance(),
  MemoryManager: MemoryManager.getInstance(),
  PerformanceMonitor: PerformanceMonitor.getInstance(),
} 