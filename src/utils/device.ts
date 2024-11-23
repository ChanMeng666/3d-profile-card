export const isMobile = () => {
  if (typeof window === 'undefined') return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

export const isLandscape = () => {
  if (typeof window === 'undefined') return false
  
  return window.innerWidth > window.innerHeight
}

export const getDevicePixelRatio = () => {
  if (typeof window === 'undefined') return 1
  
  return Math.min(window.devicePixelRatio, 2)
}

export const getTouchSupport = () => {
  if (typeof window === 'undefined') return false
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
} 