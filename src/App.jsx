import { useState, useCallback, useEffect } from 'react'
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
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#D4AF37', '#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4']
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#D4AF37', '#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4']
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
    }, 500)
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
    setShowModal(false)
  }, [isSpinning, soundEnabled, playClick, startSpinSound])

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
        className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl hover:bg-white/20 transition-colors"
        onClick={() => setSoundEnabled(!soundEnabled)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={soundEnabled ? '关闭音效' : '开启音效'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </motion.button>

      {/* 主内容 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-6 md:py-8 lg:py-10">
        {/* 标题区域 */}
        <motion.header 
          className="text-center mb-6 md:mb-8 lg:mb-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.02 }}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-gold-gradient text-shadow-gold mb-2">
              2026 年会抽奖
            </h1>
            <motion.div 
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-gold-500" />
              <p className="text-gold-400 text-lg md:text-xl lg:text-2xl tracking-[0.3em] uppercase">
                Fortune Wheel
              </p>
              <span className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-gold-500" />
            </motion.div>
          </motion.div>
        </motion.header>

        {/* 转盘区域 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-shrink-0"
        >
          <LotteryWheel 
            prizes={prizes}
            isSpinning={isSpinning}
            onSpinEnd={handleSpinEnd}
          />
        </motion.div>

        {/* 按钮区域 */}
        <motion.div 
          className="mt-6 md:mt-8 lg:mt-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="btn-gold text-xl md:text-2xl tracking-wider"
          >
            {isSpinning ? '抽奖中...' : '开始抽奖'}
          </button>
        </motion.div>

        {/* 底部装饰 */}
        <motion.footer
          className="mt-auto pt-8 text-center text-gold-500/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>祝大家2026年好运连连 🎊</p>
        </motion.footer>
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
