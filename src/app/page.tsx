'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { CanvasContainer } from '@/components/dom/CanvasContainer'
import { InfoPanel } from '@/components/dom/InfoPanel'
import { useInteractionStore } from '@/store/interactionStore'

// 动态导入Scene组件以避免SSR问题
const Scene = dynamic(() => import('@/components/canvas/Scene').then(mod => ({ default: mod.Scene })), {
  ssr: false,
  loading: () => <LoadingFallback />
})

// 加载状态组件
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[400px]">
      <div className="loading-spinner" />
    </div>
  )
}

// 错误状态组件
function ErrorFallback({ error, resetErrorBoundary }: {
  error: Error
  resetErrorBoundary: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] p-4 text-center">
      <h2 className="text-xl font-bold text-red-500 mb-4">出现了一些问题</h2>
      <p className="text-sm text-text-secondary mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        重试
      </button>
    </div>
  )
}

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const { activeContent, hideContent } = useInteractionStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <LoadingFallback />
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // 重置应用状态
        window.location.reload()
      }}
    >
      <div className="relative w-full h-screen">
        <Suspense fallback={<LoadingFallback />}>
          <CanvasContainer>
            <Scene />
          </CanvasContainer>
        </Suspense>
        <InfoPanel
          title={activeContent ? `关于 ${activeContent}` : ''}
          content={
            <div className="prose dark:prose-invert">
              {/* 动态内容 */}
              <p>这是一个示例内容面板。</p>
            </div>
          }
          position="right"
          onClose={hideContent}
        />
      </div>
    </ErrorBoundary>
  )
}
