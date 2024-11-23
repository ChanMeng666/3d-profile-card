'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Perf } from 'r3f-perf'

export default function Scene() {
  return (
    <Canvas>
      {process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {/* 这里添加您的3D内容 */}
    </Canvas>
  )
} 