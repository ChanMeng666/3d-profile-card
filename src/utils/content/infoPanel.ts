import { useEffect, useState } from 'react'

interface ContentLoaderOptions {
  fallback?: React.ReactNode
  onError?: (error: Error) => void
}

export function useContentLoader(contentId: string, options: ContentLoaderOptions = {}) {
  const [content, setContent] = useState<React.ReactNode>(options.fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true)
        // 这里可以根据contentId动态加载不同的内容
        const module = await import(`@/content/${contentId}.mdx`)
        setContent(module.default)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load content')
        setError(error)
        options.onError?.(error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [contentId, options.onError])

  return { content, loading, error }
} 