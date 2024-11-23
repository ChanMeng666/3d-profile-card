import { performance } from 'perf_hooks'

export class PerformanceTestUtil {
  private static measurements: Map<string, number[]> = new Map()

  static startMeasure(label: string) {
    if (!this.measurements.has(label)) {
      this.measurements.set(label, [])
    }
    performance.mark(`${label}-start`)
  }

  static endMeasure(label: string) {
    performance.mark(`${label}-end`)
    performance.measure(label, `${label}-start`, `${label}-end`)
    
    const measure = performance.getEntriesByName(label).pop()
    if (measure) {
      const measurements = this.measurements.get(label) || []
      measurements.push(measure.duration)
      this.measurements.set(label, measurements)
    }
  }

  static getAverageTime(label: string): number {
    const measurements = this.measurements.get(label)
    if (!measurements || measurements.length === 0) return 0
    return measurements.reduce((a, b) => a + b, 0) / measurements.length
  }

  static clearMeasurements() {
    this.measurements.clear()
    performance.clearMarks()
    performance.clearMeasures()
  }
} 