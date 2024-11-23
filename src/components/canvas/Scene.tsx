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
import * as THREE from 'three'
import { ProfileCard } from './ProfileCard'
import { Suspense } from 'react'
import { CANVAS_CONFIG } from '@/constants'
import { SceneContainer } from './SceneContainer'
import { Cube } from './Cube'
import { Lights } from './Lights'

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
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          // 配置阴影贴图
          shadowMap: {
            enabled: true,
            type: THREE.PCFSoftShadowMap,
            autoUpdate: true,
            needsUpdate: false,
            // 添加缺失的属性
            render: () => {},
            cullFace: THREE.CullFaceBack
          },
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
            <Lights
              shadowQuality="medium"
              enableAnimation
              debug={process.env.NODE_ENV === 'development'}
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
            
            {/* 添加立方体 */}
            <Cube
              position={[0, 0, 0]}
              color="#4f46e5"
              autoRotate
              onClick={(event) => {
                console.log('Cube clicked', event)
              }}
            />
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