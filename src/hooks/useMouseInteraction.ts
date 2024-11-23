'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { InteractionState, InteractionConfig, InteractionHandlers } from '@/types/interaction'

// 默认配置
const DEFAULT_CONFIG: Required<InteractionConfig> = {
  enableHover: true,
  enableDrag: true,
  enableDoubleClick: true,
  doubleClickDelay: 300,
  dragThreshold: 3,
  throttleDelay: 16,
  debounceDelay: 150,
  touchEnabled: true,
}

// 节流函数
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      func(...args)
      lastCall = now
    }
  }
}

// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function useMouseInteraction(
  config: InteractionConfig = {},
  handlers: InteractionHandlers = {}
) {
  const { camera, raycaster, gl } = useThree()
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  // 状态管理
  const [state, setState] = useState<InteractionState>({
    isHovered: false,
    isDragging: false,
    isDoubleClicking: false,
    lastClickTime: 0,
    mousePosition: new THREE.Vector2(),
    dragStartPosition: new THREE.Vector2(),
    dragDelta: new THREE.Vector2(),
  })

  // 引用值
  const meshRef = useRef<THREE.Mesh>(null)
  const touchRef = useRef<{ identifier: number | null }>({ identifier: null })

  // 事件处理器
  const handlePointerMove = useCallback(
    throttle((event: THREE.Event) => {
      if (!meshRef.current) return

      // 更新鼠标位置
      const { clientX, clientY } = event as any
      const rect = gl.domElement.getBoundingClientRect()
      const x = ((clientX - rect.left) / rect.width) * 2 - 1
      const y = -((clientY - rect.top) / rect.height) * 2 + 1
      
      state.mousePosition.set(x, y)
      raycaster.setFromCamera(state.mousePosition, camera)

      // 检测悬停
      if (finalConfig.enableHover) {
        const intersects = raycaster.intersectObject(meshRef.current)
        const isHovered = intersects.length > 0
        
        if (isHovered !== state.isHovered) {
          setState(prev => ({ ...prev, isHovered }))
          handlers.onHover?.(event)
        }
      }

      // 处理拖拽
      if (state.isDragging) {
        state.dragDelta.subVectors(state.mousePosition, state.dragStartPosition)
        handlers.onDrag?.(event, state.dragDelta)
      }
    }, finalConfig.throttleDelay),
    [camera, raycaster, state, handlers, finalConfig]
  )

  const handlePointerDown = useCallback(
    (event: THREE.Event) => {
      if (!meshRef.current) return

      const now = Date.now()
      const timeSinceLastClick = now - state.lastClickTime

      // 检测双击
      if (finalConfig.enableDoubleClick && timeSinceLastClick < finalConfig.doubleClickDelay) {
        setState(prev => ({ ...prev, isDoubleClicking: true }))
        handlers.onDoubleClick?.(event)
        return
      }

      // 开始拖拽
      if (finalConfig.enableDrag) {
        setState(prev => ({
          ...prev,
          isDragging: true,
          dragStartPosition: prev.mousePosition.clone(),
          lastClickTime: now,
        }))
        handlers.onDragStart?.(event)
      }

      // 处理点击
      handlers.onClick?.(event)
    },
    [state, handlers, finalConfig]
  )

  const handlePointerUp = useCallback(
    (event: THREE.Event) => {
      if (state.isDragging) {
        setState(prev => ({ ...prev, isDragging: false }))
        handlers.onDragEnd?.(event)
      }
      setState(prev => ({ ...prev, isDoubleClicking: false }))
    },
    [state, handlers]
  )

  // 触摸事件处理
  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!finalConfig.touchEnabled) return

      const touch = event.touches[0]
      touchRef.current.identifier = touch.identifier
      handlePointerDown(touch as any)
    },
    [handlePointerDown, finalConfig]
  )

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!finalConfig.touchEnabled) return

      const touch = Array.from(event.touches).find(
        t => t.identifier === touchRef.current.identifier
      )
      if (touch) {
        handlePointerMove(touch as any)
      }
    },
    [handlePointerMove, finalConfig]
  )

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (!finalConfig.touchEnabled) return

      const touch = Array.from(event.changedTouches).find(
        t => t.identifier === touchRef.current.identifier
      )
      if (touch) {
        handlePointerUp(touch as any)
        touchRef.current.identifier = null
      }
    },
    [handlePointerUp, finalConfig]
  )

  // 性能优化：使用 RAF 更新
  useFrame(() => {
    if (state.isDragging) {
      // 更新拖拽状态
      meshRef.current?.position.add(state.dragDelta.multiplyScalar(0.01))
    }
  })

  // 事件监听
  useEffect(() => {
    const canvas = gl.domElement

    // 鼠标事件
    canvas.addEventListener('pointermove', handlePointerMove as any)
    canvas.addEventListener('pointerdown', handlePointerDown as any)
    canvas.addEventListener('pointerup', handlePointerUp as any)

    // 触摸事件
    if (finalConfig.touchEnabled) {
      canvas.addEventListener('touchstart', handleTouchStart)
      canvas.addEventListener('touchmove', handleTouchMove)
      canvas.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove as any)
      canvas.removeEventListener('pointerdown', handlePointerDown as any)
      canvas.removeEventListener('pointerup', handlePointerUp as any)

      if (finalConfig.touchEnabled) {
        canvas.removeEventListener('touchstart', handleTouchStart)
        canvas.removeEventListener('touchmove', handleTouchMove)
        canvas.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [
    gl,
    handlePointerMove,
    handlePointerDown,
    handlePointerUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    finalConfig,
  ])

  return {
    meshRef,
    state,
    isHovered: state.isHovered,
    isDragging: state.isDragging,
    isDoubleClicking: state.isDoubleClicking,
  }
} 