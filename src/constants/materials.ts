import { Color } from 'three'

export const FACE_TYPES = {
  FRONT: 'front',
  BACK: 'back',
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  BOTTOM: 'bottom',
} as const

export type FaceType = typeof FACE_TYPES[keyof typeof FACE_TYPES]

export const MATERIAL_CONFIGS = {
  [FACE_TYPES.FRONT]: {
    name: '个人介绍',
    baseColor: new Color('#4f46e5'),
    hoverColor: new Color('#6366f1'),
    roughness: 0.3,
    metalness: 0.7,
    envMapIntensity: 1,
  },
  [FACE_TYPES.BACK]: {
    name: '联系方式',
    baseColor: new Color('#2563eb'),
    hoverColor: new Color('#3b82f6'),
    roughness: 0.4,
    metalness: 0.6,
    envMapIntensity: 0.8,
  },
  [FACE_TYPES.LEFT]: {
    name: '技能树',
    baseColor: new Color('#7c3aed'),
    hoverColor: new Color('#8b5cf6'),
    roughness: 0.5,
    metalness: 0.5,
    envMapIntensity: 0.9,
  },
  [FACE_TYPES.RIGHT]: {
    name: '项目经历',
    baseColor: new Color('#9333ea'),
    hoverColor: new Color('#a855f7'),
    roughness: 0.4,
    metalness: 0.6,
    envMapIntensity: 0.8,
  },
  [FACE_TYPES.TOP]: {
    name: '教育背景',
    baseColor: new Color('#c026d3'),
    hoverColor: new Color('#d946ef'),
    roughness: 0.3,
    metalness: 0.7,
    envMapIntensity: 1,
  },
  [FACE_TYPES.BOTTOM]: {
    name: '个人兴趣',
    baseColor: new Color('#db2777'),
    hoverColor: new Color('#ec4899'),
    roughness: 0.5,
    metalness: 0.5,
    envMapIntensity: 0.7,
  },
} as const 