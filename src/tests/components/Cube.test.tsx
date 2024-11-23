import { render, fireEvent } from '@testing-library/react'
import { Cube } from '@/components/canvas/Cube'
import { useCubeStore } from '@/store/cubeStore'
import { act } from 'react-dom/test-utils'

describe('Cube Component', () => {
  beforeEach(() => {
    useCubeStore.getState().reset()
  })

  it('renders without crashing', () => {
    const { container } = render(<Cube />)
    expect(container).toBeTruthy()
  })

  it('responds to hover events', () => {
    const { container } = render(<Cube />)
    const mesh = container.querySelector('mesh')
    
    act(() => {
      fireEvent.pointerOver(mesh!)
    })
    
    expect(useCubeStore.getState().interaction.isHovered).toBe(true)
    
    act(() => {
      fireEvent.pointerOut(mesh!)
    })
    
    expect(useCubeStore.getState().interaction.isHovered).toBe(false)
  })

  it('updates rotation state correctly', () => {
    const { container } = render(
      <Cube autoRotate rotationSpeed={0.1} />
    )
    
    const initialRotation = useCubeStore.getState().rotation.currentRotation
    
    // 模拟帧更新
    act(() => {
      jest.advanceTimersByTime(1000 / 60) // 一帧的时间
    })
    
    const newRotation = useCubeStore.getState().rotation.currentRotation
    expect(newRotation).not.toEqual(initialRotation)
  })
}) 