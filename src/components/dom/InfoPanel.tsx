'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import { useInteractionStore } from '@/store/interactionStore'
import { XIcon } from '@heroicons/react/24/outline'

interface InfoPanelProps {
  title?: string
  content?: React.ReactNode
  position?: 'left' | 'right'
  className?: string
  onClose?: () => void
}

export function InfoPanel({
  title = '',
  content,
  position = 'right',
  className = '',
  onClose,
}: InfoPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isExpanded = useInteractionStore((state) => state.isExpanded)
  const activeContent = useInteractionStore((state) => state.activeContent)

  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, onClose])

  // 动画配置
  const variants = {
    hidden: {
      x: position === 'right' ? '100%' : '-100%',
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      x: position === 'right' ? '100%' : '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      {isExpanded && (
        <motion.div
          ref={panelRef}
          className={`
            fixed top-0 ${position}-0 h-full w-full max-w-md
            bg-card-background text-text-primary
            shadow-lg backdrop-blur-md
            overflow-y-auto
            ${className}
          `}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          data-theme={theme}
          role="dialog"
          aria-modal="true"
          aria-labelledby="panel-title"
        >
          {/* 标题栏 */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card-background/80 backdrop-blur">
            <h2
              id="panel-title"
              className="text-xl font-semibold truncate"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="关闭面板"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* 内容区域 */}
          <motion.div
            className="p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {content}
          </motion.div>

          {/* 辅助功能支持 */}
          <div className="sr-only" role="status" aria-live="polite">
            {isExpanded ? '面板已展开' : '面板已收起'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 