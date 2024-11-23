'use client'

import { useRef, useCallback, useEffect } from 'react'

interface AudioOptions {
  volume?: number
  loop?: boolean
  autoplay?: boolean
}

export function useAudio(url: string, options: AudioOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { volume = 1, loop = false, autoplay = false } = options

  useEffect(() => {
    // 延迟加载音频以优化性能
    const audio = new Audio(url)
    audio.volume = volume
    audio.loop = loop
    if (autoplay) audio.autoplay = true
    audioRef.current = audio

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [url, volume, loop, autoplay])

  const play = useCallback(() => {
    if (audioRef.current) {
      // 重置播放位置
      audioRef.current.currentTime = 0
      // 使用 Promise 处理播放
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Audio playback failed:', error)
        })
      }
    }
  }, [])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  return { play, pause, stop, audio: audioRef.current }
} 