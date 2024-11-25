'use client'

import React, { useRef, useState, useCallback } from 'react'
import { useLoader } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { useCubeStore, cubeActions } from '@/store/cubeStore'
import { useMouseInteraction } from '@/hooks/useMouseInteraction'
import { useAudio } from '@/hooks/useAudio'

interface CubeProps {
  position?: [number, number, number]
  scale?: [number, number, number]
  enableSound?: boolean
}

export function Cube({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  enableSound = true,
}: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const [hovered, setHovered] = useState(false)

  // 加载法线贴图
  const normalMap = useLoader(THREE.TextureLoader, '/textures/normal.jpg')

  // 音效
  const { play: playHoverSound } = useAudio('/sounds/hover.mp3', { volume: 0.5 })
  const { play: playClickSound } = useAudio('/sounds/click.mp3', { volume: 0.5 })

  // 动画配置 - 只处理缩放，移除颜色动画
  const { scale: springScale } = useSpring({
    scale: hovered ? scale.map(s => s * 1.1) : scale,
    config: {
      mass: 1,
      tension: 280,
      friction: 60,
    },
  })

  // 鼠标交互
  const { meshRef: interactionRef } = useMouseInteraction(
    {
      enableHover: true,
      enableDrag: false,
      enableDoubleClick: false,
      touchEnabled: true,
    },
    {
      onHover: useCallback((event: THREE.Event) => {
        setHovered(true)
        if (enableSound) playHoverSound()
        cubeActions.handleInteraction(true, false)
      }, [enableSound, playHoverSound]),
      
      onClick: useCallback((event: THREE.Event) => {
        if (enableSound) playClickSound()
        cubeActions.handleInteraction(false, true)
      }, [enableSound, playClickSound]),
    }
  )

  return (
    <animated.mesh
      ref={(mesh) => {
        if (mesh) {
          meshRef.current = mesh
          if (interactionRef) {
            // @ts-ignore - 类型兼容性问题
            interactionRef.current = mesh
          }
        }
      }}
      position={position}
      scale={springScale as any}
      onPointerOut={() => {
        setHovered(false)
        cubeActions.handleInteraction(false, false)
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        transparent
        opacity={0.9}
        color="#ffffff"  // 使用白色作为基础色
        metalness={0.1}  // 降低金属度
        roughness={0.8}  // 增加粗糙度
        normalMap={normalMap}
        normalScale={new THREE.Vector2(1.0, 1.0)}  // 增强法线贴图效果
        envMapIntensity={0.2}  // 降低环境反射
      />
    </animated.mesh>
  )
}

// 性能优化：记忆化组件
export const MemoizedCube = React.memo(Cube) 