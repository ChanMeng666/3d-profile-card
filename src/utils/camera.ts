import * as THREE from 'three'
import { CANVAS_CONFIG } from '@/constants'

export class CameraController {
  private camera: THREE.PerspectiveCamera
  private target: THREE.Vector3
  private damping: number

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera
    this.target = new THREE.Vector3()
    this.damping = 0.1
  }

  setTarget(position: THREE.Vector3 | [number, number, number]) {
    if (Array.isArray(position)) {
      this.target.set(...position)
    } else {
      this.target.copy(position)
    }
  }

  update() {
    this.camera.position.lerp(this.target, this.damping)
    this.camera.updateProjectionMatrix()
  }

  fitToObject(object: THREE.Object3D, offset: number = 1.5) {
    const box = new THREE.Box3().setFromObject(object)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = this.camera.fov * (Math.PI / 180)
    const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * offset

    const direction = this.camera.position.clone().sub(center).normalize()
    this.setTarget(center.add(direction.multiplyScalar(cameraDistance)))
  }
} 