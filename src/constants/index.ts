export const CANVAS_CONFIG = {
  DEFAULT_FOV: 75,
  DEFAULT_NEAR: 0.1,
  DEFAULT_FAR: 1000,
  DEFAULT_POSITION: [0, 0, 5] as [number, number, number],
  DEFAULT_CAMERA: {
    fov: 75,
    near: 0.1,
    far: 1000,
    position: [0, 0, 5] as [number, number, number],
  },
  SHADOW_MAP_SIZE: 1024,
  MAX_FPS: 60,
}

export const PROFILE_DEFAULTS = {
  CARD_SIZE: [2, 3, 0.1] as [number, number, number],
  ROTATION_SPEED: 0.01,
} 