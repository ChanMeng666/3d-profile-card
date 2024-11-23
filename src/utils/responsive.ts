import { CANVAS_CONFIG } from '@/constants'

export interface Breakpoint {
  width: number
  height: number
  scale: number
}

export const BREAKPOINTS: Record<string, Breakpoint> = {
  mobile: { width: 640, height: 960, scale: 0.8 },
  tablet: { width: 1024, height: 1366, scale: 0.9 },
  desktop: { width: 1920, height: 1080, scale: 1 }
}

export const calculateResponsiveScale = (width: number, height: number): number => {
  const aspect = width / height
  const baseScale = 1

  if (width <= BREAKPOINTS.mobile.width) {
    return baseScale * BREAKPOINTS.mobile.scale
  } else if (width <= BREAKPOINTS.tablet.width) {
    return baseScale * BREAKPOINTS.tablet.scale
  }
  return baseScale * BREAKPOINTS.desktop.scale
}

export const getResponsiveValue = <T>(
  value: T,
  breakpoints: Record<string, T>,
  width: number
): T => {
  if (width <= BREAKPOINTS.mobile.width) return breakpoints.mobile
  if (width <= BREAKPOINTS.tablet.width) return breakpoints.tablet
  return breakpoints.desktop
} 