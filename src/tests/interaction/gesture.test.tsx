import { render, fireEvent, act } from '@testing-library/react'
import { TouchableObject } from '@/components/canvas/TouchableObject'
import { useGestures } from '@/hooks/useGestures'
import * as THREE from 'three'

// Mock Three.js
jest.mock('three', () => ({
  ...jest.requireActual('three'),
  Vector2: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    subVectors: jest.fn().mockReturnThis(),
    multiplyScalar: jest.fn().mockReturnThis(),
  })),
}))

describe('Gesture Interaction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles pinch gesture correctly', () => {
    const onPinch = jest.fn()
    const { container } = render(
      <TouchableObject
        position={[0, 0, 0]}
        onPinch={onPinch}
      />
    )

    const mesh = container.querySelector('mesh')
    
    // 模拟双指触摸
    act(() => {
      fireEvent.touchStart(mesh!, {
        touches: [
          { clientX: 0, clientY: 0, identifier: 0 },
          { clientX: 100, clientY: 100, identifier: 1 },
        ],
      })
      
      fireEvent.touchMove(mesh!, {
        touches: [
          { clientX: 0, clientY: 0, identifier: 0 },
          { clientX: 200, clientY: 200, identifier: 1 },
        ],
      })
    })

    expect(onPinch).toHaveBeenCalled()
  })

  it('handles rotation gesture correctly', () => {
    const onRotate = jest.fn()
    const { container } = render(
      <TouchableObject
        position={[0, 0, 0]}
        onRotate={onRotate}
      />
    )

    const mesh = container.querySelector('mesh')
    
    // 模拟旋转手势
    act(() => {
      fireEvent.touchStart(mesh!, {
        touches: [
          { clientX: 0, clientY: 0, identifier: 0 },
          { clientX: 100, clientY: 0, identifier: 1 },
        ],
      })
      
      fireEvent.touchMove(mesh!, {
        touches: [
          { clientX: 0, clientY: 0, identifier: 0 },
          { clientX: 100, clientY: 100, identifier: 1 },
        ],
      })
    })

    expect(onRotate).toHaveBeenCalled()
  })
}) 