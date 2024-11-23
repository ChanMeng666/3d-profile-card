'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { useGestures } from '@/hooks/useGestures'

interface TouchableObjectProps {
  position?: [number, number, number]
  scale?: [number, number, number]
  color?: string
}

export function TouchableObject({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#4f46e5',
}: TouchableObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useGestures(
    {
      enablePinch: true,
      enableRotate: true,
      enablePan: true,
      bounds: {
        min: new THREE.Vector3(-5, -5, -5),
        max: new THREE.Vector3(5, 5, 5),
      },
      momentum: true,
    },
    {
      onPinch: (scale, event) => {
        if (meshRef.current) {
          meshRef.current.scale.setScalar(scale)
        }
      },
      
      onRotate: (rotation, event) => {
        if (meshRef.current) {
          meshRef.current.rotation.z = rotation
        }
      },
      
      onPan: (delta, event) => {
        if (meshRef.current) {
          meshRef.current.position.x += delta[0] * 0.01
          meshRef.current.position.y -= delta[1] * 0.01
        }
      },
      
      onLongPress: (position, event) => {
        if (meshRef.current) {
          meshRef.current.material.color.setHex(Math.random() * 0xffffff)
        }
      },
    }
  )

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
} 