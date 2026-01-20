import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LotteryWheel from './components/LotteryWheel'
import ResultModal from './components/ResultModal'
import Background from './components/Background'
import { useSound } from './hooks/useSound'
import confetti from 'canvas-confetti'

// 奖项配置
const prizes = [
  '白酒',
  '阿五集装箱',
  '信阳菜',
  '茶饼礼盒',
  '白酒+阿五集装箱',
  '白酒+信阳菜',
  '白酒+茶饼礼盒',
  '白酒+阿五集装箱+信阳菜',
  '白酒+阿五集装箱+茶饼礼盒',
  '白酒+信阳菜+茶饼礼盒',
  '白酒+阿五集装箱+信阳菜+茶饼礼盒',
  '阿五集装箱+信阳菜',
  '阿五集装箱+茶饼礼盒',
  '阿五集装箱+信阳菜+茶饼礼盒',
  '信阳菜+茶饼礼盒',
  '恭喜你，啥也没'
]

function App() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [shouldStop, setShouldStop] = useState(false)
  const [result, setResult] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // 音效
  const { 
    initAudio, 
    playClick, 
    playWin, 
    playLose, 
    startSpinSound, 
    stopSpinSound 
  } = useSound()

  // 初始化音频（页面加载后）
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio()
      document.removeEventListener('click', handleFirstInteraction)
    }
    document.addEventListener('click', handleFirstInteraction)
    return () => document.removeEventListener('click', handleFirstInteraction)
  }, [initAudio])

  // 触发彩带效果
  const triggerConfetti = useCallback(() => {
    const duration = 4000
    const end = Date.now() + duration

    // 大型彩带爆发
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8C00', '#9B59B6', '#E74C3C', '#3498DB']
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    })

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  // 处理抽奖完成
  const handleSpinEnd = useCallback((prizeIndex) => {
    setResult(prizes[prizeIndex])
    setIsSpinning(false)
    setShouldStop(false)
    stopSpinSound()
    
    // 延迟显示弹窗
    setTimeout(() => {
      setShowModal(true)
      // 如果不是"啥也没"，触发彩带和中奖音效
      if (prizeIndex !== prizes.length - 1) {
        triggerConfetti()
        if (soundEnabled) playWin()
      } else {
        // 未中奖音效
        if (soundEnabled) playLose()
      }
    }, 300)
  }, [triggerConfetti, stopSpinSound, playWin, playLose, soundEnabled])

  // 开始抽奖
  const handleSpin = useCallback(() => {
    if (isSpinning) return
    
    // 播放点击音效和转盘旋转音效
    if (soundEnabled) {
      playClick()
      startSpinSound()
    }
    
    setIsSpinning(true)
    setShouldStop(false)
    setShowModal(false)
  }, [isSpinning, soundEnabled, playClick, startSpinSound])

  // 立即停止
  const handleStop = useCallback(() => {
    if (!isSpinning) return
    if (soundEnabled) playClick()
    setShouldStop(true)
  }, [isSpinning, soundEnabled, playClick])

  // 关闭弹窗
  const handleCloseModal = useCallback(() => {
    setShowModal(false)
  }, [])

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      {/* 背景 */}
      <Background />
      
      {/* 音效开关 */}
      <motion.button
        className="fixed top-4 right-4 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl transition-all group"
        style={{
          background: 'linear-gradient(135deg, rgba(30,30,50,0.9) 0%, rgba(20,20,40,0.95) 100%)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          boxShadow: soundEnabled 
            ? '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)' 
            : '0 4px 15px rgba(0,0,0,0.3)',
        }}
        onClick={() => setSoundEnabled(!soundEnabled)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={soundEnabled ? '关闭音效' : '开启音效'}
      >
        <motion.span
          animate={{ rotate: soundEnabled ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </motion.span>
      </motion.button>

      {/* 主内容 */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center px-4 py-3 md:py-4 overflow-hidden">
        {/* 标题区域 - 绝对定位确保居中 */}
        <motion.header 
          className="absolute top-4 md:top-6 lg:top-8 left-0 right-0 text-center flex-shrink-0"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* 顶部装饰 */}
          <motion.div 
            className="flex items-center justify-center gap-2 mb-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span 
              className="text-xl md:text-2xl"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎊
            </motion.span>
            <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-medium">
              Annual Party
            </span>
            <motion.span 
              className="text-xl md:text-2xl"
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎊
            </motion.span>
          </motion.div>

          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* 标题光晕 */}
            <motion.div
              className="absolute inset-0 -m-4 bg-gradient-radial from-gold-500/20 to-transparent blur-2xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <h1 className="relative font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gold-gradient text-shadow-gold leading-tight">
              2026 年会抽奖
            </h1>
          </motion.div>
        </motion.header>

        {/* 转盘和按钮区域 - 垂直布局 */}
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 flex-shrink-0 mt-16 md:mt-20">
          {/* 转盘 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
            className="flex-shrink-0"
          >
            <LotteryWheel 
              prizes={prizes}
              isSpinning={isSpinning}
              shouldStop={shouldStop}
              onSpinEnd={handleSpinEnd}
            />
          </motion.div>

          {/* 按钮 - 转盘正下方 */}
          <motion.div 
            className="flex-shrink-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <AnimatePresence mode="wait">
              {!isSpinning ? (
                <motion.button
                  key="start"
                  onClick={handleSpin}
                  className="btn-gold text-lg md:text-xl lg:text-2xl tracking-wider ripple py-3 px-8 md:py-4 md:px-12 flex items-center gap-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl md:text-3xl">🎯</span>
                  <span>开始抽奖</span>
                </motion.button>
              ) : (
                <motion.button
                  key="stop"
                  onClick={handleStop}
                  className="py-3 px-8 md:py-4 md:px-12 rounded-xl font-bold text-lg md:text-xl lg:text-2xl tracking-wider flex items-center gap-3 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
                    color: 'white',
                    boxShadow: '0 0 20px rgba(231, 76, 60, 0.5), 0 8px 25px rgba(0,0,0,0.3)',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span 
                    className="text-2xl md:text-3xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    ✋
                  </motion.span>
                  <span>立即停止</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* 结果弹窗 */}
      <AnimatePresence>
        {showModal && (
          <ResultModal 
            result={result}
            onClose={handleCloseModal}
            isLucky={result !== '恭喜你，啥也没'}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
