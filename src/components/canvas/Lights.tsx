'use client'

import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useHelper } from '@react-three/drei'
import * as THREE from 'three'
import { LIGHT_CONFIG } from '@/constants/lights'

interface LightsProps {
  debug?: boolean
  enableAnimation?: boolean
  shadowQuality?: 'low' | 'medium' | 'high'
}

export function Lights({ 
  debug = false, 
  enableAnimation = LIGHT_CONFIG.animation.enabled,
  shadowQuality = 'medium'
}: LightsProps) {
  // 引用
  const directionalLightRef = useRef<THREE.DirectionalLight>(null)
  const pointLightRefs = useRef<THREE.PointLight[]>([])
  
  // Debug helpers
  if (debug && directionalLightRef.current) {
    useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, '#ffff00')
  }

  // 根据质量设置阴影贴图大小
  const shadowMapSize = {
    low: 1024,
    medium: 2048,
    high: 4096,
  }[shadowQuality]

  // 设置阴影相机
  useEffect(() => {
    if (directionalLightRef.current) {
      const light = directionalLightRef.current
      light.shadow.camera.left = -10
      light.shadow.camera.right = 10
      light.shadow.camera.top = 10
      light.shadow.camera.bottom = -10
      light.shadow.camera.near = 0.1
      light.shadow.camera.far = 40
      light.shadow.camera.updateProjectionMatrix()
    }
  }, [])

  // 动画更新
  useFrame(({ clock }) => {
    if (!enableAnimation) return

    const time = clock.getElapsedTime()
    const speed = LIGHT_CONFIG.animation.speed
    const radius = LIGHT_CONFIG.animation.radius
    const height = LIGHT_CONFIG.animation.height

    // 平行光动画
    if (directionalLightRef.current) {
      const light = directionalLightRef.current
      light.position.x = Math.sin(time * speed) * radius
      light.position.z = Math.cos(time * speed) * radius
      light.position.y = height + Math.sin(time * speed * 0.5) * 2
      light.lookAt(0, 0, 0)
    }

    // 点光源动画
    pointLightRefs.current.forEach((light, index) => {
      const offset = (index * Math.PI) / pointLightRefs.current.length
      light.position.x = Math.sin(time * speed + offset) * (radius * 0.5)
      light.position.z = Math.cos(time * speed + offset) * (radius * 0.5)
      light.position.y = height * 0.5 + Math.sin(time * speed * 0.5 + offset) * 2
    })
  })

  return (
    <>
      {/* 环境光 */}
      <ambientLight
        color={LIGHT_CONFIG.ambient.color}
        intensity={LIGHT_CONFIG.ambient.intensity}
      />

      {/* 平行光 */}
      <directionalLight
        ref={directionalLightRef}
        color={LIGHT_CONFIG.directional.color}
        intensity={LIGHT_CONFIG.directional.intensity}
        position={LIGHT_CONFIG.directional.position.toArray()}
        castShadow
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-bias={LIGHT_CONFIG.directional.shadowBias}
        shadow-radius={LIGHT_CONFIG.directional.shadowRadius}
      />

      {/* 点光源 */}
      {LIGHT_CONFIG.point.positions.map((position, index) => (
        <pointLight
          key={index}
          ref={(el) => {
            if (el) pointLightRefs.current[index] = el
          }}
          color={LIGHT_CONFIG.point.color}
          intensity={LIGHT_CONFIG.point.intensity}
          position={position.toArray()}
          distance={LIGHT_CONFIG.point.distance}
          decay={LIGHT_CONFIG.point.decay}
          castShadow={shadowQuality === 'high'}
        />
      ))}
    </>
  )
}

// 性能优化：记忆化组件
export const MemoizedLights = React.memo(Lights) 