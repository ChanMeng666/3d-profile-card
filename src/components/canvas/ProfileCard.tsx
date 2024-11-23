'use client'

import { useProfileStore } from '@/store'
import { useSpring, animated } from '@react-spring/three'
import { Mesh } from 'three'
import { useRef } from 'react'

export function ProfileCard() {
  const meshRef = useRef<Mesh>(null)
  const { name, title } = useProfileStore()
  
  const [springs] = useSpring(() => ({
    scale: [1, 1, 1],
    config: { mass: 1, tension: 280, friction: 60 }
  }))

  return (
    <animated.mesh
      ref={meshRef}
      scale={springs.scale}
    >
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial color="#4f46e5" />
    </animated.mesh>
  )
} 