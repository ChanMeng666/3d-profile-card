'use client'

import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload
} from '@react-three/drei'
import { ProfileCard } from './ProfileCard'
import { Suspense } from 'react'
import { CANVAS_CONFIG } from '@/constants'
import { SceneContainer } from './SceneContainer'

// 加载状态组件
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent" />
    </div>
  )
}

export function Scene() {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]} // 自适应设备像素比
        camera={{
          fov: CANVAS_CONFIG.DEFAULT_FOV,
          near: CANVAS_CONFIG.DEFAULT_NEAR,
          far: CANVAS_CONFIG.DEFAULT_FAR,
          position: CANVAS_CONFIG.DEFAULT_POSITION,
        }}
        style={{ position: 'absolute' }}
        eventSource={document.getElementById('root') || undefined}
        eventPrefix="client"
      >
        {/* 性能优化组件 */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        {/* 场景预加载 */}
        <Suspense fallback={null}>
          <Preload all />
          <Environment preset="city" />
          
          {/* 场景容器 */}
          <SceneContainer>
            {/* 光照设置 */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            
            {/* 相机控制器 */}
            <PerspectiveCamera makeDefault {...CANVAS_CONFIG.DEFAULT_CAMERA} />
            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              minDistance={2}
              maxDistance={10}
              enablePan={false}
            />
            
            {/* 3D内容 */}
            <ProfileCard />
          </SceneContainer>
        </Suspense>
      </Canvas>
      
      {/* 加载状态 */}
      <Suspense fallback={<Loader />}>
        <div id="root" className="w-full h-full" />
      </Suspense>
    </div>
  )
} 