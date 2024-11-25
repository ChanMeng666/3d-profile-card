export const PERFORMANCE_CONFIG = {
  // 渲染配置
  render: {
    maxFps: 60,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    batchSize: 1000,
    frustumCulling: true,
  },
  
  // 几何体优化
  geometry: {
    mergeVertices: true,
    computeNormals: true,
    computeBoundingSphere: true,
    instanceThreshold: 10,
  },
  
  // 材质优化
  material: {
    enableCache: true,
    disposeUnused: true,
    maxCacheSize: 100,
  },
  
  // 内存管理
  memory: {
    textureDisposal: true,
    geometryDisposal: true,
    materialDisposal: true,
    autoDispose: true,
  },
  
  // 监控配置
  monitoring: {
    enabled: true,
    sampleInterval: 1000,
    logToConsole: process.env.NODE_ENV === 'development',
  },
} as const 