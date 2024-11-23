import { createPerspectiveCamera, calculateFrustumSize, getOptimalDPR } from '../three'
import * as THREE from 'three'

describe('Three.js Utils', () => {
  test('createPerspectiveCamera creates camera with correct properties', () => {
    const camera = createPerspectiveCamera(16/9)
    expect(camera).toBeInstanceOf(THREE.PerspectiveCamera)
    expect(camera.aspect).toBe(16/9)
  })

  test('calculateFrustumSize returns correct dimensions', () => {
    const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000)
    const { width, height } = calculateFrustumSize(camera, 5)
    expect(width).toBeGreaterThan(0)
    expect(height).toBeGreaterThan(0)
  })

  test('getOptimalDPR returns value between 1 and 2', () => {
    const dpr = getOptimalDPR()
    expect(dpr).toBeGreaterThanOrEqual(1)
    expect(dpr).toBeLessThanOrEqual(2)
  })
}) 