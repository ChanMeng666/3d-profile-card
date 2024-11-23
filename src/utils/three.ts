import * as THREE from 'three'
import { CANVAS_CONFIG } from '@/constants'

// 创建透视相机
export const createPerspectiveCamera = (aspect: number = window.innerWidth / window.innerHeight) => {
  const camera = new THREE.PerspectiveCamera(
    CANVAS_CONFIG.DEFAULT_FOV,
    aspect,
    CANVAS_CONFIG.DEFAULT_NEAR,
    CANVAS_CONFIG.DEFAULT_FAR
  )
  camera.position.set(...CANVAS_CONFIG.DEFAULT_POSITION)
  return camera
}

// 计算视锥体尺寸
export const calculateFrustumSize = (camera: THREE.PerspectiveCamera, distance: number) => {
  const vFOV = THREE.MathUtils.degToRad(camera.fov)
  const height = 2 * Math.tan(vFOV / 2) * distance
  const width = height * camera.aspect
  return { width, height }
}

// 计算设备像素比
export const getOptimalDPR = () => {
  const dpr = window.devicePixelRatio || 1
  return Math.min(dpr, 2) // 限制最大像素比为2以优化性能
}

// 创建光源
export const createLights = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(10, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = CANVAS_CONFIG.SHADOW_MAP_SIZE
  directionalLight.shadow.mapSize.height = CANVAS_CONFIG.SHADOW_MAP_SIZE
  
  return { ambientLight, directionalLight }
} 