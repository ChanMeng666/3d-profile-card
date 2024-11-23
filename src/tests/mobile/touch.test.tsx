import { render, fireEvent, act } from '@testing-library/react'
import { TouchableObject } from '@/components/canvas/TouchableObject'
import { isMobile } from '@/utils/device'

// Mock device detection
jest.mock('@/utils/device', () => ({
  isMobile: jest.fn(),
}))

describe('Mobile Touch Interaction', () => {
  beforeEach(() => {
    (isMobile as jest.Mock).mockReturnValue(true)
  })

  it('handles long press correctly', () => {
    const onLongPress = jest.fn()
    const { container } = render(
      <TouchableObject
        position={[0, 0, 0]}
        onLongPress={onLongPress}
      />
    )

    const mesh = container.querySelector('mesh')
    
    // 模拟长按
    act(() => {
      fireEvent.touchStart(mesh!, {
        touches: [{ clientX: 0, clientY: 0, identifier: 0 }],
      })
      jest.advanceTimersByTime(500) // 长按阈值
    })

    expect(onLongPress).toHaveBeenCalled()
  })

  it('handles multi-touch correctly', () => {
    const onPinch = jest.fn()
    const onRotate = jest.fn()
    const { container } = render(
      <TouchableObject
        position={[0, 0, 0]}
        onPinch={onPinch}
        onRotate={onRotate}
      />
    )

    const mesh = container.querySelector('mesh')
    
    // 模拟多点触控
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
    expect(onRotate).toHaveBeenCalled()
  })
}) 