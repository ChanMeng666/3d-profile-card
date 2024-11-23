'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { FaceType, MATERIAL_CONFIGS } from '@/constants/materials'
import { useMaterialStore } from '@/store/materialStore'

interface CubeFaceProps {
  face: FaceType
  position: [number, number, number]
  rotation: [number, number, number]
}

export function CubeFace({ face, position, rotation }: CubeFaceProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const { setHoveredFace, setActiveFace } = useMaterialStore()
  
  const [hovered, setHovered] = useState(false)
  
  const { color, scale } = useSpring({
    color: hovered ? MATERIAL_CONFIGS[face].hoverColor : MATERIAL_CONFIGS[face].baseColor,
    scale: hovered ? 1.05 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  })

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.color = color.get()
    }
  })

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        setHoveredFace(face)
      }}
      onPointerOut={() => {
        setHovered(false)
        setHoveredFace(null)
      }}
      onClick={() => setActiveFace(face)}
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        {...MATERIAL_CONFIGS[face]}
        transparent
        opacity={0.9}
      />
    </animated.mesh>
  )
} 