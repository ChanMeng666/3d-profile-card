'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/hooks/useTheme'

interface CanvasContainerProps {
  children: React.ReactNode
}

export function CanvasContainer({ children }: CanvasContainerProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="canvas-container flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="canvas-container" data-theme={theme}>
      {children}
    </div>
  )
} 