import '@testing-library/jest-dom'
import 'jest-canvas-mock'
import * as THREE from 'three'

// Mock Three.js WebGLRenderer
jest.mock('three', () => {
  const originalThree = jest.requireActual('three')
  return {
    ...originalThree,
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      render: jest.fn(),
      shadowMap: {},
      domElement: document.createElement('canvas'),
    })),
  }
})

// Mock React Three Fiber
jest.mock('@react-three/fiber', () => ({
  ...jest.requireActual('@react-three/fiber'),
  useThree: () => ({
    gl: new THREE.WebGLRenderer(),
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
  }),
  useFrame: jest.fn(),
})) 