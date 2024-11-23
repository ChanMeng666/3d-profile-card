import { render, act } from '@testing-library/react'
import { AnimatedMesh } from '@/components/canvas/AnimatedMesh'
import { animationManager } from '@/utils/animations'
import * as THREE from 'three'

jest.useFakeTimers()

describe('Animation System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('animates position correctly', () => {
    const onUpdate = jest.fn()
    const { container } = render(
      <AnimatedMesh
        position={[0, 0, 0]}
        targetPosition={[1, 1, 1]}
        onUpdate={onUpdate}
      />
    )

    // 推进动画时间
    act(() => {
      jest.advanceTimersByTime(500) // 动画中点
    })

    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
        z: expect.any(Number),
      })
    )
  })

  it('handles animation queue correctly', () => {
    const queue = animationManager.createQueue('test-queue')
    const animation1 = {
      id: '1',
      config: { duration: 1000 },
      startTime: null,
      isComplete: false,
      update: jest.fn(),
    }
    const animation2 = {
      id: '2',
      config: { duration: 1000 },
      startTime: null,
      isComplete: false,
      update: jest.fn(),
    }

    animationManager.addToQueue('test-queue', animation1)
    animationManager.addToQueue('test-queue', animation2)
    animationManager.start('test-queue')

    // 推进时间
    act(() => {
      jest.advanceTimersByTime(2000) // 完整动画时长
    })

    expect(animation1.update).toHaveBeenCalled()
    expect(animation2.update).toHaveBeenCalled()
  })
}) 