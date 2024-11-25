import { Vector3 } from 'three'

export const LIGHT_CONFIG = {
  ambient: {
    intensity: 0.3,
    color: '#ffffff',
  },
  directional: {
    intensity: 0.7,
    color: '#ffffff',
    position: new Vector3(10, 10, 5),
    shadowMapSize: 2048,
    shadowBias: -0.0001,
    shadowRadius: 4,
  },
  point: {
    intensity: 0.4,
    color: '#ffffff',
    distance: 20,
    decay: 2,
    positions: [
      new Vector3(-5, 5, 5),
      new Vector3(5, 5, -5),
    ],
  },
  animation: {
    enabled: true,
    speed: 0.5,
    radius: 10,
    height: 8,
  },
} as const 