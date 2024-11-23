interface SoundConfig {
  volume?: number
  loop?: boolean
  autoplay?: boolean
}

export class InteractionSoundManager {
  private static audioContext: AudioContext | null = null
  private static sounds: Map<string, AudioBuffer> = new Map()
  private static gainNode: GainNode | null = null

  // 初始化音频上下文
  static init() {
    if (typeof window === 'undefined') return
    
    this.audioContext = new AudioContext()
    this.gainNode = this.audioContext.createGain()
    this.gainNode.connect(this.audioContext.destination)
  }

  // 加载音频文件
  static async loadSound(url: string, id: string) {
    if (!this.audioContext) return

    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      this.sounds.set(id, audioBuffer)
    } catch (error) {
      console.error('Failed to load sound:', error)
    }
  }

  // 播放音效
  static playSound(id: string, config: SoundConfig = {}) {
    if (!this.audioContext || !this.gainNode) return
    
    const sound = this.sounds.get(id)
    if (!sound) return

    const source = this.audioContext.createBufferSource()
    source.buffer = sound
    
    const gainNode = this.audioContext.createGain()
    gainNode.gain.value = config.volume || 1
    
    source.connect(gainNode)
    gainNode.connect(this.gainNode)
    
    source.loop = config.loop || false
    source.start(0)

    return source
  }

  // 停止所有音效
  static stopAll() {
    if (!this.gainNode) return
    this.gainNode.gain.setValueAtTime(0, 0)
  }
} 