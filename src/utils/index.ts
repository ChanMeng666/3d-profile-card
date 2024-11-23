export const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t
}

export const degToRad = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
} 