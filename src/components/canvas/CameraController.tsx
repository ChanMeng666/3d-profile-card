'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'
import { useCameraStore } from '@/store/cameraStore'
import { isMobile } from '@/utils/device'

interface CameraControllerProps {
  initialPosition?: [number, number, number]
  initialTarget?: [number, number, number]
  minDistance?: number
  maxDistance?: number
  enableDamping?: boolean
  dampingFactor?: number
  enableZoom?: boolean
  enableRotate?: boolean
  enablePan?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
}

export function CameraController({
  initialPosition = [0, 0, 5],
  initialTarget = [0, 0, 0],
  minDistance = 2,
  maxDistance = 10,
  enableDamping = true,
  dampingFactor = 0.05,
  enableZoom = true,
  enableRotate = true,
  enablePan = false,
  autoRotate = false,
  autoRotateSpeed = 1,
}: CameraControllerProps) {
  const { camera, gl } = useThree()
  const targetRef = useRef(new THREE.Vector3(...initialTarget))
  const { setTarget, setPosition } = useCameraStore()

  // 动画配置
  const { position } = useSpring({
    position: initialPosition,
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    },
  })

  // 相机位置更新
  const updateCameraPosition = useCallback((newPosition: [number, number, number]) => {
    const distance = new THREE.Vector3(...newPosition).distanceTo(targetRef.current)
    
    // 边界检查
    if (distance < minDistance || distance > maxDistance) {
      const direction = new THREE.Vector3()
        .subVectors(new THREE.Vector3(...newPosition), targetRef.current)
        .normalize()
      const clampedDistance = THREE.MathUtils.clamp(distance, minDistance, maxDistance)
      const clampedPosition = targetRef.current.clone()
        .add(direction.multiplyScalar(clampedDistance))
      
      setPosition([clampedPosition.x, clampedPosition.y, clampedPosition.z])
      return
    }

    setPosition(newPosition)
  }, [minDistance, maxDistance, setPosition])

  // 焦点更新
  const updateTarget = useCallback((newTarget: [number, number, number]) => {
    targetRef.current.set(...newTarget)
    setTarget(newTarget)
  }, [setTarget])

  // 移动端触摸处理
  useEffect(() => {
    if (!isMobile()) return

    const touchStart = { x: 0, y: 0 }
    let isMoving = false

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStart.x = e.touches[0].clientX
        touchStart.y = e.touches[0].clientY
        isMoving = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMoving || !enableRotate) return

      const touch = e.touches[0]
      const deltaX = (touch.clientX - touchStart.x) * 0.01
      const deltaY = (touch.clientY - touchStart.y) * 0.01

      const currentPosition = new THREE.Vector3().copy(camera.position)
      const rotationMatrix = new THREE.Matrix4()

      // 水平旋转
      rotationMatrix.makeRotationY(-deltaX)
      currentPosition.applyMatrix4(rotationMatrix)

      // 垂直旋转
      const right = new THREE.Vector3(1, 0, 0)
      rotationMatrix.makeRotationAxis(right, -deltaY)
      currentPosition.applyMatrix4(rotationMatrix)

      updateCameraPosition([currentPosition.x, currentPosition.y, currentPosition.z])
      touchStart.x = touch.clientX
      touchStart.y = touch.clientY
    }

    const handleTouchEnd = () => {
      isMoving = false
    }

    const canvas = gl.domElement
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchmove', handleTouchMove)
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [gl, camera, enableRotate, updateCameraPosition])

  // 自动旋转
  useFrame((_, delta) => {
    if (!autoRotate) return

    const currentPosition = new THREE.Vector3().copy(camera.position)
    const rotationMatrix = new THREE.Matrix4()
    rotationMatrix.makeRotationY(autoRotateSpeed * delta)
    currentPosition.applyMatrix4(rotationMatrix)

    updateCameraPosition([currentPosition.x, currentPosition.y, currentPosition.z])
  })

  // 阻尼效果
  useFrame(() => {
    if (!enableDamping) return

    const currentPosition = new THREE.Vector3().copy(camera.position)
    const targetPosition = new THREE.Vector3(...position.get())
    currentPosition.lerp(targetPosition, dampingFactor)

    camera.position.copy(currentPosition)
    camera.lookAt(targetRef.current)
  })

  return (
    <PerspectiveCamera
      makeDefault
      position={position.get()}
      zoom={enableZoom ? undefined : 1}
    />
  )
} 