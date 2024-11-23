'use client'

import { useMouseInteraction } from '@/hooks/useMouseInteraction'
import * as THREE from 'three'

interface InteractiveMeshProps {
  position?: [number, number, number]
  color?: string
  onHover?: (event: THREE.Event) => void
  onClick?: (event: THREE.Event) => void
  onDrag?: (event: THREE.Event, delta: THREE.Vector2) => void
}

export function InteractiveMesh({
  position = [0, 0, 0],
  color = '#4f46e5',
  onHover,
  onClick,
  onDrag,
}: InteractiveMeshProps) {
  const { meshRef, isHovered, isDragging } = useMouseInteraction(
    {
      enableHover: true,
      enableDrag: true,
      enableDoubleClick: true,
      touchEnabled: true,
    },
    {
      onHover,
      onClick,
      onDrag,
    }
  )

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={isHovered ? 1.1 : 1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        opacity={isDragging ? 0.8 : 1}
        transparent
      />
    </mesh>
  )
} 