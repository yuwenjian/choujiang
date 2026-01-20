import { useCallback, useRef, useEffect } from 'react'

// 使用 Web Audio API 生成更动感的音效
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

  // 创建混响效果
  createReverb(duration = 1) {
    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const impulse = this.audioContext.createBuffer(2, length, sampleRate)
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
      }
    }
    
    const convolver = this.audioContext.createConvolver()
    convolver.buffer = impulse
    return convolver
  }

  // 动感滴答声 - 类似老虎机的声音
  playTick() {
    if (!this.audioContext) return
    
    // 主音
    const osc1 = this.audioContext.createOscillator()
    const gain1 = this.audioContext.createGain()
    
    // 泛音增加金属感
    const osc2 = this.audioContext.createOscillator()
    const gain2 = this.audioContext.createGain()
    
    // 噪音增加打击感
    const bufferSize = this.audioContext.sampleRate * 0.05
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1
    }
    const noise = this.audioContext.createBufferSource()
    noise.buffer = noiseBuffer
    const noiseGain = this.audioContext.createGain()
    const noiseFilter = this.audioContext.createBiquadFilter()
    
    // 连接
    osc1.connect(gain1)
    osc2.connect(gain2)
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    
    gain1.connect(this.audioContext.destination)
    gain2.connect(this.audioContext.destination)
    noiseGain.connect(this.audioContext.destination)
    
    // 设置参数
    const now = this.audioContext.currentTime
    
    osc1.type = 'square'
    osc1.frequency.setValueAtTime(1200, now)
    osc1.frequency.exponentialRampToValueAtTime(600, now + 0.03)
    
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(2400, now)
    
    noiseFilter.type = 'highpass'
    noiseFilter.frequency.value = 3000
    
    gain1.gain.setValueAtTime(0.15, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
    
    gain2.gain.setValueAtTime(0.08, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
    
    noiseGain.gain.setValueAtTime(0.1, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
    
    osc1.start(now)
    osc2.start(now)
    noise.start(now)
    
    osc1.stop(now + 0.06)
    osc2.stop(now + 0.04)
    noise.stop(now + 0.03)
  }

  // 动感按钮点击声 - 电子游戏风格
  playClick() {
    if (!this.audioContext) return
    
    const now = this.audioContext.currentTime
    
    // 低频冲击
    const kick = this.audioContext.createOscillator()
    const kickGain = this.audioContext.createGain()
    kick.connect(kickGain)
    kickGain.connect(this.audioContext.destination)
    
    kick.type = 'sine'
    kick.frequency.setValueAtTime(150, now)
    kick.frequency.exponentialRampToValueAtTime(50, now + 0.1)
    kickGain.gain.setValueAtTime(0.3, now)
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    
    // 高频点击
    const click = this.audioContext.createOscillator()
    const clickGain = this.audioContext.createGain()
    click.connect(clickGain)
    clickGain.connect(this.audioContext.destination)
    
    click.type = 'square'
    click.frequency.setValueAtTime(800, now)
    click.frequency.exponentialRampToValueAtTime(400, now + 0.05)
    clickGain.gain.setValueAtTime(0.2, now)
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    
    // 电子音效
    const synth = this.audioContext.createOscillator()
    const synthGain = this.audioContext.createGain()
    synth.connect(synthGain)
    synthGain.connect(this.audioContext.destination)
    
    synth.type = 'sawtooth'
    synth.frequency.setValueAtTime(600, now)
    synth.frequency.setValueAtTime(900, now + 0.02)
    synth.frequency.setValueAtTime(600, now + 0.04)
    synthGain.gain.setValueAtTime(0.1, now)
    synthGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
    
    kick.start(now)
    click.start(now)
    synth.start(now)
    
    kick.stop(now + 0.15)
    click.stop(now + 0.08)
    synth.stop(now + 0.1)
  }

  // 超级动感中奖音效 - 游戏胜利风格
  playWin() {
    if (!this.audioContext) return
    
    const now = this.audioContext.currentTime
    
    // 胜利号角琶音
    const notes = [523, 659, 784, 880, 1047, 1319, 1568] // C5 到 G6
    
    notes.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator()
      const gain = this.audioContext.createGain()
      const filter = this.audioContext.createBiquadFilter()
      
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.audioContext.destination)
      
      osc.type = 'sawtooth'
      osc.frequency.value = freq
      
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(2000, now + index * 0.08)
      filter.frequency.linearRampToValueAtTime(5000, now + index * 0.08 + 0.1)
      
      const startTime = now + index * 0.08
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02)
      gain.gain.setValueAtTime(0.15, startTime + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4)
      
      osc.start(startTime)
      osc.stop(startTime + 0.4)
    })
    
    // 闪耀音效
    for (let i = 0; i < 5; i++) {
      const sparkle = this.audioContext.createOscillator()
      const sparkleGain = this.audioContext.createGain()
      
      sparkle.connect(sparkleGain)
      sparkleGain.connect(this.audioContext.destination)
      
      sparkle.type = 'sine'
      sparkle.frequency.value = 2000 + Math.random() * 2000
      
      const startTime = now + 0.5 + i * 0.1
      sparkleGain.gain.setValueAtTime(0.1, startTime)
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15)
      
      sparkle.start(startTime)
      sparkle.stop(startTime + 0.15)
    }
    
    // 低频震撼
    const bass = this.audioContext.createOscillator()
    const bassGain = this.audioContext.createGain()
    bass.connect(bassGain)
    bassGain.connect(this.audioContext.destination)
    
    bass.type = 'sine'
    bass.frequency.setValueAtTime(80, now)
    bass.frequency.linearRampToValueAtTime(60, now + 0.5)
    bassGain.gain.setValueAtTime(0.25, now)
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    
    bass.start(now)
    bass.stop(now + 0.6)
  }

  // 动感未中奖音效 - 喜剧风格
  playLose() {
    if (!this.audioContext) return
    
    const now = this.audioContext.currentTime
    
    // 滑稽的下滑音
    const slide = this.audioContext.createOscillator()
    const slideGain = this.audioContext.createGain()
    slide.connect(slideGain)
    slideGain.connect(this.audioContext.destination)
    
    slide.type = 'sawtooth'
    slide.frequency.setValueAtTime(600, now)
    slide.frequency.exponentialRampToValueAtTime(100, now + 0.5)
    slideGain.gain.setValueAtTime(0.15, now)
    slideGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
    
    slide.start(now)
    slide.stop(now + 0.5)
    
    // 弹簧声
    const spring = this.audioContext.createOscillator()
    const springGain = this.audioContext.createGain()
    spring.connect(springGain)
    springGain.connect(this.audioContext.destination)
    
    spring.type = 'sine'
    // 弹簧振动效果
    spring.frequency.setValueAtTime(400, now + 0.5)
    spring.frequency.setValueAtTime(300, now + 0.55)
    spring.frequency.setValueAtTime(350, now + 0.6)
    spring.frequency.setValueAtTime(280, now + 0.65)
    spring.frequency.setValueAtTime(320, now + 0.7)
    spring.frequency.setValueAtTime(250, now + 0.75)
    
    springGain.gain.setValueAtTime(0.12, now + 0.5)
    springGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85)
    
    spring.start(now + 0.5)
    spring.stop(now + 0.85)
    
    // 小号哭泣声
    const sad = this.audioContext.createOscillator()
    const sadGain = this.audioContext.createGain()
    const sadFilter = this.audioContext.createBiquadFilter()
    
    sad.connect(sadFilter)
    sadFilter.connect(sadGain)
    sadGain.connect(this.audioContext.destination)
    
    sad.type = 'triangle'
    sadFilter.type = 'lowpass'
    sadFilter.frequency.value = 1000
    
    // Wah wah 效果
    sad.frequency.setValueAtTime(350, now + 0.9)
    sad.frequency.linearRampToValueAtTime(300, now + 1.1)
    sad.frequency.linearRampToValueAtTime(280, now + 1.3)
    
    sadGain.gain.setValueAtTime(0.1, now + 0.9)
    sadGain.gain.setValueAtTime(0.08, now + 1.1)
    sadGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4)
    
    sad.start(now + 0.9)
    sad.stop(now + 1.4)
  }
}

// 单例
const soundGenerator = new SoundGenerator()

export function useSound() {
  const tickIntervalRef = useRef(null)
  const bgMusicRef = useRef(null)

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

  // 开始转盘音效（动感滴答声 + 加速感）
  const startSpinSound = useCallback(() => {
    soundGenerator.init()
    
    let interval = 30 // 初始间隔更短，更快
    let elapsed = 0
    const duration = 5000 // 总时长 5 秒
    
    // 播放启动音效
    if (soundGenerator.audioContext) {
      const now = soundGenerator.audioContext.currentTime
      
      // 加速启动声
      const startup = soundGenerator.audioContext.createOscillator()
      const startupGain = soundGenerator.audioContext.createGain()
      startup.connect(startupGain)
      startupGain.connect(soundGenerator.audioContext.destination)
      
      startup.type = 'sawtooth'
      startup.frequency.setValueAtTime(100, now)
      startup.frequency.exponentialRampToValueAtTime(500, now + 0.3)
      startupGain.gain.setValueAtTime(0.15, now)
      startupGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
      
      startup.start(now)
      startup.stop(now + 0.4)
    }
    
    const playTickWithSlowdown = () => {
      if (elapsed >= duration) {
        if (tickIntervalRef.current) {
          clearTimeout(tickIntervalRef.current)
          tickIntervalRef.current = null
        }
        
        // 播放停止音效
        if (soundGenerator.audioContext) {
          const now = soundGenerator.audioContext.currentTime
          const stop = soundGenerator.audioContext.createOscillator()
          const stopGain = soundGenerator.audioContext.createGain()
          stop.connect(stopGain)
          stopGain.connect(soundGenerator.audioContext.destination)
          
          stop.type = 'sine'
          stop.frequency.setValueAtTime(800, now)
          stop.frequency.exponentialRampToValueAtTime(200, now + 0.3)
          stopGain.gain.setValueAtTime(0.2, now)
          stopGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
          
          stop.start(now)
          stop.stop(now + 0.35)
        }
        return
      }
      
      soundGenerator.playTick()
      elapsed += interval
      
      // 使用缓动函数让减速更自然
      const progress = elapsed / duration
      const easeOut = 1 - Math.pow(1 - progress, 3) // 三次方缓出
      interval = 30 + easeOut * 400 // 从 30ms 增加到 430ms
      
      tickIntervalRef.current = setTimeout(playTickWithSlowdown, interval)
    }
    
    // 延迟一点开始滴答声，让启动音效先播放
    setTimeout(playTickWithSlowdown, 200)
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
