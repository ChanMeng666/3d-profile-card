'use client'

import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import type { GestureState, GestureConfig, GestureHandlers } from '@/types/gesture'

const DEFAULT_CONFIG: Required<GestureConfig> = {
  enablePinch: true,
  enableRotate: true,
  enablePan: true,
  enableLongPress: true,
  minDistance: 10,
  minScale: 0.1,
  minRotation: 0.1,
  longPressDelay: 500,
  bounds: {
    min: new THREE.Vector3(-Infinity, -Infinity, -Infinity),
    max: new THREE.Vector3(Infinity, Infinity, Infinity),
  },
  momentum: true,
  momentumFactor: 0.95,
  momentumDecay: 0.95,
}

export function useGestures(
  config: GestureConfig = {},
  handlers: GestureHandlers = {}
) {
  const { camera, gl } = useThree()
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  // 状态引用
  const stateRef = useRef<GestureState>({
    active: false,
    initial: true,
    touches: [],
    event: null,
    xy: [0, 0],
    initial_xy: [0, 0],
    delta: [0, 0],
    movement: [0, 0],
    offset: [0, 0],
    scale: 1,
    initial_scale: 1,
    da: [0, 0],
    rotation: 0,
    initial_rotation: 0,
    velocity: [0, 0],
    direction: [0, 0],
    distance: 0,
    timeStamp: 0,
    startTime: 0,
    elapsedTime: 0,
  })
  
  // 长按定时器
  const longPressTimer = useRef<NodeJS.Timeout>()
  
  // 惯性动画帧
  const momentumFrame = useRef<number>()

  // 计算两点之间的距离和角度
  const getDistanceAndAngle = useCallback((p1: Touch, p2: Touch): [number, number] => {
    const dx = p2.clientX - p1.clientX
    const dy = p2.clientY - p1.clientY
    return [
      Math.sqrt(dx * dx + dy * dy),
      Math.atan2(dy, dx),
    ]
  }, [])

  // 更新状态
  const updateState = useCallback((event: TouchEvent, partial: Partial<GestureState>) => {
    const state = stateRef.current
    const touches = Array.from(event.touches)
    
    // 更新基础信息
    state.event = event
    state.touches = touches
    state.timeStamp = event.timeStamp
    state.elapsedTime = state.timeStamp - state.startTime
    
    // 更新位置信息
    if (touches.length > 0) {
      const touch = touches[0]
      state.xy = [touch.clientX, touch.clientY]
      state.delta = [
        state.xy[0] - state.initial_xy[0],
        state.xy[1] - state.initial_xy[1],
      ]
    }
    
    // 更新多点触控信息
    if (touches.length >= 2) {
      const [d, a] = getDistanceAndAngle(touches[0], touches[1])
      state.da = [d, a]
      state.scale = d / state.initial_scale
      state.rotation = a - state.initial_rotation
    }
    
    // 更新速度信息
    const dt = state.elapsedTime / 1000
    state.velocity = [
      state.delta[0] / dt,
      state.delta[1] / dt,
    ]
    state.direction = [
      Math.sign(state.velocity[0]),
      Math.sign(state.velocity[1]),
    ]
    state.distance = Math.sqrt(
      state.delta[0] * state.delta[0] + 
      state.delta[1] * state.delta[1]
    )
    
    Object.assign(state, partial)
  }, [getDistanceAndAngle])

  // 手势开始
  const handleTouchStart = useCallback((event: TouchEvent) => {
    const state = stateRef.current
    const touches = Array.from(event.touches)
    
    if (!state.active) {
      state.active = true
      state.initial = true
      state.startTime = event.timeStamp
      state.initial_xy = [touches[0].clientX, touches[0].clientY]
      
      if (touches.length >= 2) {
        const [d, a] = getDistanceAndAngle(touches[0], touches[1])
        state.initial_scale = d
        state.initial_rotation = a
      }
      
      updateState(event, { active: true })
      handlers.onStart?.(state)
      
      // 设置长按定时器
      if (finalConfig.enableLongPress) {
        longPressTimer.current = setTimeout(() => {
          handlers.onLongPress?.(state.xy, event)
        }, finalConfig.longPressDelay)
      }
    }
  }, [finalConfig, handlers, getDistanceAndAngle, updateState])

  // 手势移动
  const handleTouchMove = useCallback((event: TouchEvent) => {
    const state = stateRef.current
    if (!state.active) return
    
    // 清除长按定时器
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
    
    updateState(event, { initial: false })
    
    // 处理缩放
    if (finalConfig.enablePinch && event.touches.length >= 2) {
      handlers.onPinch?.(state.scale, event)
    }
    
    // 处理旋转
    if (finalConfig.enableRotate && event.touches.length >= 2) {
      handlers.onRotate?.(state.rotation, event)
    }
    
    // 处理平移
    if (finalConfig.enablePan && state.distance > finalConfig.minDistance) {
      handlers.onPan?.(state.delta, event)
    }
    
    handlers.onMove?.(state)
  }, [finalConfig, handlers, updateState])

  // 手势结束
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    const state = stateRef.current
    if (!state.active) return
    
    // 清除长按定时器
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
    
    updateState(event, { active: false })
    handlers.onEnd?.(state)
    
    // 处理惯性
    if (finalConfig.momentum && state.distance > finalConfig.minDistance) {
      let velocity = [...state.velocity]
      
      const animate = () => {
        velocity = velocity.map(v => v * finalConfig.momentumDecay) as [number, number]
        const speed = Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1])
        
        if (speed > 0.01) {
          handlers.onPan?.([
            velocity[0] * finalConfig.momentumFactor,
            velocity[1] * finalConfig.momentumFactor,
          ], event)
          momentumFrame.current = requestAnimationFrame(animate)
        }
      }
      
      momentumFrame.current = requestAnimationFrame(animate)
    }
  }, [finalConfig, handlers, updateState])

  // 事件监听
  useEffect(() => {
    const canvas = gl.domElement
    
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchmove', handleTouchMove)
    canvas.addEventListener('touchend', handleTouchEnd)
    canvas.addEventListener('touchcancel', handleTouchEnd)
    
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      canvas.removeEventListener('touchcancel', handleTouchEnd)
      
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
      if (momentumFrame.current) {
        cancelAnimationFrame(momentumFrame.current)
      }
    }
  }, [gl, handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    state: stateRef.current,
  }
} 