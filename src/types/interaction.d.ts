import * as THREE from 'three'

export interface InteractionState {
  isHovered: boolean
  isDragging: boolean
  isDoubleClicking: boolean
  lastClickTime: number
  mousePosition: THREE.Vector2
  dragStartPosition: THREE.Vector2
  dragDelta: THREE.Vector2
}

export interface InteractionConfig {
  enableHover?: boolean
  enableDrag?: boolean
  enableDoubleClick?: boolean
  doubleClickDelay?: number
  dragThreshold?: number
  throttleDelay?: number
  debounceDelay?: number
  touchEnabled?: boolean
}

export interface InteractionHandlers {
  onHover?: (event: THREE.Event) => void
  onDragStart?: (event: THREE.Event) => void
  onDrag?: (event: THREE.Event, delta: THREE.Vector2) => void
  onDragEnd?: (event: THREE.Event) => void
  onClick?: (event: THREE.Event) => void
  onDoubleClick?: (event: THREE.Event) => void
} 