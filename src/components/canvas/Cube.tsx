'use client'

import React, { useRef, useState, useCallback } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { useCubeStore, cubeActions } from '@/store/cubeStore'
import { useMouseInteraction } from '@/hooks/useMouseInteraction'
import { useAudio } from '@/hooks/useAudio'

interface CubeProps {
  position?: [number, number, number]
  scale?: [number, number, number]
  color?: string
  hoverColor?: string
  hoverScale?: number
  enableSound?: boolean
}

export function Cube({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#4f46e5',
  hoverColor = '#6366f1',
  hoverScale = 1.1,
  enableSound = true,
}: CubeProps) {
  // 引用和状态
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const [hovered, setHovered] = useState(false)

  // 加载法线贴图
  const normalMap = useLoader(THREE.TextureLoader, '/textures/normal.jpg')

  // 音效
  const { play: playHoverSound } = useAudio('/sounds/hover.mp3', { volume: 0.5 })
  const { play: playClickSound } = useAudio('/sounds/click.mp3', { volume: 0.5 })

  // 动画配置
  const { scale: springScale, color: springColor } = useSpring({
    scale: hovered ? [scale[0] * hoverScale, scale[1] * hoverScale, scale[2] * hoverScale] : scale,
    color: hovered ? hoverColor : color,
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

  // 性能优化：限制更新频率
  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return

    // 使用 RAF 进行平滑过渡
    if (materialRef.current.emissiveIntensity !== (hovered ? 0.5 : 0)) {
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        hovered ? 0.5 : 0,
        delta * 5
      )
    }
  })

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
      scale={springScale}
      onPointerOut={() => {
        setHovered(false)
        cubeActions.handleInteraction(false, false)
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <animated.meshStandardMaterial
        ref={materialRef}
        color={springColor}
        metalness={0.5}
        roughness={0.2}
        emissive={hoverColor}
        emissiveIntensity={0}
        toneMapped={false}
        normalMap={normalMap}
      />
    </animated.mesh>
  )
}

// 性能优化：记忆化组件
export const MemoizedCube = React.memo(Cube) 