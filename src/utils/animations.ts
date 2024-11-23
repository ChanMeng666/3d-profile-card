import * as THREE from 'three'
import type { 
  AnimationConfig, 
  TransitionConfig, 
  AnimationQueue,
  Animation,
  EasingFunction,
  Vector3Animation,
  ColorAnimation
} from '@/types/animation'

// 缓动函数
export const Easing = {
  // 线性
  linear: (t: number) => t,
  
  // 缓入
  easeIn: (t: number) => t * t,
  
  // 缓出
  easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
  
  // 缓入缓出
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  
  // 弹性
  elastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4)
  },
  
  // 弹跳
  bounce: (t: number) => {
    const n1 = 7.5625
    const d1 = 2.75
    
    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  }
}

// 动画管理器
class AnimationManager {
  private static instance: AnimationManager
  private queues: Map<string, AnimationQueue>
  private rafId: number | null
  private lastTime: number

  private constructor() {
    this.queues = new Map()
    this.rafId = null
    this.lastTime = 0
  }

  static getInstance() {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager()
    }
    return AnimationManager.instance
  }

  // 创建动画队列
  createQueue(id: string): AnimationQueue {
    const queue: AnimationQueue = {
      id,
      animations: [],
      isPlaying: false,
      currentIndex: 0,
    }
    this.queues.set(id, queue)
    return queue
  }

  // 添加动画到队列
  addToQueue(queueId: string, animation: Animation) {
    const queue = this.queues.get(queueId)
    if (queue) {
      queue.animations.push(animation)
    }
  }

  // 开始动画
  start(queueId: string) {
    const queue = this.queues.get(queueId)
    if (queue && !queue.isPlaying) {
      queue.isPlaying = true
      this.startAnimation()
    }
  }

  // 停止动画
  stop(queueId: string) {
    const queue = this.queues.get(queueId)
    if (queue) {
      queue.isPlaying = false
      if (this.rafId && !this.hasPlayingQueues()) {
        cancelAnimationFrame(this.rafId)
        this.rafId = null
      }
    }
  }

  // 更新动画
  private update(time: number) {
    const deltaTime = time - this.lastTime
    this.lastTime = time

    this.queues.forEach(queue => {
      if (queue.isPlaying && queue.currentIndex < queue.animations.length) {
        const animation = queue.animations[queue.currentIndex]
        
        if (!animation.startTime) {
          animation.startTime = time
          animation.config.onStart?.()
        }

        animation.update(deltaTime)
        
        if (animation.isComplete) {
          queue.currentIndex++
          if (queue.currentIndex >= queue.animations.length) {
            queue.isPlaying = false
          }
        }
      }
    })

    if (this.hasPlayingQueues()) {
      this.rafId = requestAnimationFrame(this.update.bind(this))
    }
  }

  private startAnimation() {
    if (!this.rafId) {
      this.lastTime = performance.now()
      this.rafId = requestAnimationFrame(this.update.bind(this))
    }
  }

  private hasPlayingQueues(): boolean {
    return Array.from(this.queues.values()).some(queue => queue.isPlaying)
  }
}

// 创建动画工具函数
export class AnimationFactory {
  // 创建向量动画
  static createVector3Animation(config: Vector3Animation): Animation {
    const from = new THREE.Vector3().fromArray(Array.isArray(config.from) ? config.from : config.from.toArray())
    const to = new THREE.Vector3().fromArray(Array.isArray(config.to) ? config.to : config.to.toArray())
    const duration = config.duration || 1000
    const easing = config.easing || Easing.easeInOut

    return {
      id: Math.random().toString(36).substr(2, 9),
      config,
      startTime: null,
      isComplete: false,
      update: (deltaTime: number) => {
        if (!this.startTime) return
        
        const elapsed = performance.now() - this.startTime
        const progress = Math.min(elapsed / duration, 1)
        const t = easing(progress)

        const current = new THREE.Vector3().lerpVectors(from, to, t)
        config.onUpdate?.(current)

        if (progress === 1) {
          this.isComplete = true
          config.onComplete?.()
        }
      }
    }
  }

  // 创建颜色动画
  static createColorAnimation(config: ColorAnimation): Animation {
    const from = new THREE.Color(config.from)
    const to = new THREE.Color(config.to)
    const duration = config.duration || 1000
    const easing = config.easing || Easing.easeInOut

    return {
      id: Math.random().toString(36).substr(2, 9),
      config,
      startTime: null,
      isComplete: false,
      update: (deltaTime: number) => {
        if (!this.startTime) return
        
        const elapsed = performance.now() - this.startTime
        const progress = Math.min(elapsed / duration, 1)
        const t = easing(progress)

        const current = new THREE.Color().lerpColors(from, to, t)
        config.onUpdate?.(current)

        if (progress === 1) {
          this.isComplete = true
          config.onComplete?.()
        }
      }
    }
  }
}

// 导出动画管理器实例
export const animationManager = AnimationManager.getInstance() 