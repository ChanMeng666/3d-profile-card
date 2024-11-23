export const PERFORMANCE_CONFIG = {
  // 渲染配置
  render: {
    targetFPS: {
      mobile: 30,
      desktop: 60,
    },
    pixelRatio: {
      min: 1,
      max: 2,
    },
    batchSize: 1000,
    culling: true,
  },
  
  // 事件配置
  event: {
    throttleDelay: 16,
    maxQueueSize: 100,
    batchProcessing: true,
  },
  
  // 监控配置
  monitor: {
    sampleInterval: 1000,
    maxSamples: 60,
    autoStart: true,
    logLevel: 'warn',
  },
  
  // 移动端优化
  mobile: {
    reducedQuality: true,
    disableShadows: true,
    simplifyGeometry: true,
    maxTextureSize: 1024,
  },
} as const 