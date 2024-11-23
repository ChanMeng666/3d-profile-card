import { useSpring } from '@react-spring/three'
import * as THREE from 'three'

interface AnimationConfig {
  mass?: number
  tension?: number
  friction?: number
  duration?: number
}

export class InteractionAnimator {
  private static readonly DEFAULT_CONFIG: Required<AnimationConfig> = {
    mass: 1,
    tension: 280,
    friction: 60,
    duration: 300,
  }

  // 展开动画
  static getExpandAnimation(config?: AnimationConfig) {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config }
    
    return {
      scale: [1.2, 1.2, 1.2],
      rotation: [0, Math.PI * 2, 0],
      config: {
        mass: finalConfig.mass,
        tension: finalConfig.tension,
        friction: finalConfig.friction,
      },
    }
  }

  // 收起动画
  static getCollapseAnimation(config?: AnimationConfig) {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config }
    
    return {
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      config: {
        mass: finalConfig.mass,
        tension: finalConfig.tension,
        friction: finalConfig.friction,
      },
    }
  }

  // 内容显示动画
  static getContentShowAnimation(config?: AnimationConfig) {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config }
    
    return {
      opacity: 1,
      transform: 'translateY(0)',
      config: {
        duration: finalConfig.duration,
      },
    }
  }

  // 内容隐藏动画
  static getContentHideAnimation(config?: AnimationConfig) {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config }
    
    return {
      opacity: 0,
      transform: 'translateY(20px)',
      config: {
        duration: finalConfig.duration,
      },
    }
  }
} 