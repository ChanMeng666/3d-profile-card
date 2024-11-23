'use client'

import { useRef, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { useInteractionStore } from '@/store/interactionStore'
import { InteractionAnimator } from '@/utils/animations/interaction'
import { InteractionEventHandler } from '@/utils/events/interaction'
import { InteractionSoundManager } from '@/utils/audio/interaction'

interface InteractivePanelProps {
  contentId: string
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function InteractivePanel({
  contentId,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: InteractivePanelProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const isExpanded = useInteractionStore((state) => state.isExpanded)
  const activeContent = useInteractionStore((state) => state.activeContent)
  const transitionPhase = useInteractionStore((state) => state.transitionPhase)

  // 动画配置
  const { scale, meshRotation } = useSpring({
    scale: isExpanded 
      ? InteractionAnimator.getExpandAnimation().scale 
      : InteractionAnimator.getCollapseAnimation().scale,
    meshRotation: isExpanded 
      ? InteractionAnimator.getExpandAnimation().rotation 
      : InteractionAnimator.getCollapseAnimation().rotation,
  })

  // 初始化音效
  useEffect(() => {
    InteractionSoundManager.init()
    InteractionSoundManager.loadSound('/sounds/expand.mp3', 'expand')
    InteractionSoundManager.loadSound('/sounds/collapse.mp3', 'collapse')
    InteractionSoundManager.loadSound('/sounds/show.mp3', 'show')
    InteractionSoundManager.loadSound('/sounds/hide.mp3', 'hide')
  }, [])

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      rotation={meshRotation}
      scale={scale}
      onClick={(e) => InteractionEventHandler.handleClick(e, contentId)}
      onPointerOver={(e) => InteractionEventHandler.handleHover(e, true)}
      onPointerOut={(e) => InteractionEventHandler.handleHover(e, false)}
    >
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial
        color={activeContent === contentId ? '#6366f1' : '#4f46e5'}
        transparent
        opacity={transitionPhase === 'enter' ? 1 : 0.8}
      />
    </animated.mesh>
  )
} 