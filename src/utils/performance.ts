export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private measurements: Map<string, number[]>
  private maxSamples: number

  private constructor() {
    this.measurements = new Map()
    this.maxSamples = 60 // 保存最近60帧的数据
  }

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startMeasure(label: string) {
    if (!this.measurements.has(label)) {
      this.measurements.set(label, [])
    }
    performance.mark(`${label}-start`)
  }

  endMeasure(label: string) {
    performance.mark(`${label}-end`)
    performance.measure(label, `${label}-start`, `${label}-end`)
    
    const measure = performance.getEntriesByName(label).pop()
    if (measure) {
      const samples = this.measurements.get(label) || []
      samples.push(measure.duration)
      if (samples.length > this.maxSamples) {
        samples.shift()
      }
      this.measurements.set(label, samples)
    }
    
    performance.clearMarks()
    performance.clearMeasures()
  }

  getAverageTime(label: string): number {
    const samples = this.measurements.get(label)
    if (!samples || samples.length === 0) return 0
    return samples.reduce((a, b) => a + b, 0) / samples.length
  }
} 