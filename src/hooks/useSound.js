import { useCallback, useRef, useEffect } from 'react'

// 使用 Web Audio API 生成音效
class SoundGenerator {
  constructor() {
    this.audioContext = null
    this.initialized = false
  }

  init() {
    if (this.initialized) return
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.initialized = true
    } catch (e) {
      console.warn('Web Audio API not supported')
    }
  }

  // 滴答声 - 转盘旋转时使用
  playTick() {
    if (!this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.05)
  }

  // 按钮点击声
  playClick() {
    if (!this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.value = 600
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }

  // 中奖庆祝声 - 上升的音调
  playWin() {
    if (!this.audioContext) return
    
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.value = freq
      oscillator.type = 'sine'
      
      const startTime = this.audioContext.currentTime + index * 0.15
      
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.3)
    })
  }

  // 未中奖声 - 下降的音调
  playLose() {
    if (!this.audioContext) return
    
    const notes = [400, 350, 300] // 下降音调
    
    notes.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.value = freq
      oscillator.type = 'triangle'
      
      const startTime = this.audioContext.currentTime + index * 0.2
      
      gainNode.gain.setValueAtTime(0.15, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.25)
    })
  }

  // 转盘旋转声 - 持续的呼呼声
  createSpinSound() {
    if (!this.audioContext) return null
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.type = 'sawtooth'
    oscillator.frequency.value = 100
    
    filter.type = 'lowpass'
    filter.frequency.value = 500
    
    gainNode.gain.value = 0
    
    return { oscillator, gainNode, filter }
  }
}

// 单例
const soundGenerator = new SoundGenerator()

export function useSound() {
  const spinSoundRef = useRef(null)
  const tickIntervalRef = useRef(null)

  // 初始化音频上下文（需要用户交互后才能初始化）
  const initAudio = useCallback(() => {
    soundGenerator.init()
  }, [])

  // 播放点击声
  const playClick = useCallback(() => {
    soundGenerator.init()
    soundGenerator.playClick()
  }, [])

  // 播放中奖声
  const playWin = useCallback(() => {
    soundGenerator.playWin()
  }, [])

  // 播放未中奖声
  const playLose = useCallback(() => {
    soundGenerator.playLose()
  }, [])

  // 开始转盘音效（滴答声随时间变慢）
  const startSpinSound = useCallback(() => {
    soundGenerator.init()
    
    let interval = 50 // 初始间隔 50ms
    let elapsed = 0
    const duration = 5000 // 总时长 5 秒
    
    const playTickWithSlowdown = () => {
      if (elapsed >= duration) {
        if (tickIntervalRef.current) {
          clearTimeout(tickIntervalRef.current)
          tickIntervalRef.current = null
        }
        return
      }
      
      soundGenerator.playTick()
      elapsed += interval
      
      // 随着时间推移，间隔逐渐增加（滴答声变慢）
      const progress = elapsed / duration
      interval = 50 + progress * 300 // 从 50ms 增加到 350ms
      
      tickIntervalRef.current = setTimeout(playTickWithSlowdown, interval)
    }
    
    playTickWithSlowdown()
  }, [])

  // 停止转盘音效
  const stopSpinSound = useCallback(() => {
    if (tickIntervalRef.current) {
      clearTimeout(tickIntervalRef.current)
      tickIntervalRef.current = null
    }
  }, [])

  // 清理
  useEffect(() => {
    return () => {
      stopSpinSound()
    }
  }, [stopSpinSound])

  return {
    initAudio,
    playClick,
    playWin,
    playLose,
    startSpinSound,
    stopSpinSound
  }
}

export default useSound
