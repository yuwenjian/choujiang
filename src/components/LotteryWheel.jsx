import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

// 颜色配置 - 交替使用两种颜色，更清晰
const COLORS = [
  '#D4AF37', '#B8860B', '#DAA520', '#C9A961',
  '#F4D03F', '#E6C200', '#FFD700', '#FFA500',
  '#CD853F', '#DEB887', '#F5DEB3', '#FFE4B5',
  '#D4AF37', '#B8860B', '#DAA520', '#8B7355'
]

export default function LotteryWheel({ prizes, isSpinning, onSpinEnd }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const rotationRef = useRef(0) // 用于追踪当前实际旋转角度
  const [rotation, setRotation] = useState(0)
  const [canvasSize, setCanvasSize] = useState(400)

  // 计算Canvas尺寸
  const updateCanvasSize = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const size = Math.min(container.offsetWidth, container.offsetHeight, 500)
      setCanvasSize(size)
    }
  }, [])

  // 监听容器尺寸变化
  useEffect(() => {
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [updateCanvasSize])

  // 绘制转盘
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const center = canvasSize / 2
    const radius = canvasSize / 2 - 10
    const anglePerPrize = (2 * Math.PI) / prizes.length

    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // 绘制每个扇形
    prizes.forEach((prize, index) => {
      const startAngle = index * anglePerPrize - Math.PI / 2
      const endAngle = (index + 1) * anglePerPrize - Math.PI / 2

      // 绘制扇形
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, radius, startAngle, endAngle)
      ctx.closePath()
      
      // 交替颜色
      ctx.fillStyle = COLORS[index % COLORS.length]
      ctx.fill()
      
      // 边框
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()

      // 绘制文字
      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(startAngle + anglePerPrize / 2)

      // 计算文字参数
      const text = prize
      const totalChars = text.length
      const innerRadius = 50
      const outerRadius = radius - 15
      const availableLength = outerRadius - innerRadius
      
      let fontSize = Math.floor(availableLength / (totalChars * 1.3))
      fontSize = Math.max(8, Math.min(14, fontSize))

      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.fillStyle = '#1a1a2e'
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const charSpacing = fontSize * 1.3
      const totalLength = totalChars * charSpacing
      const startX = innerRadius + (availableLength - totalLength) / 2 + charSpacing / 2

      // 逐字绘制
      for (let i = 0; i < totalChars; i++) {
        const char = text.charAt(i)
        const x = startX + i * charSpacing
        ctx.strokeText(char, x, 0)
        ctx.fillText(char, x, 0)
      }

      ctx.restore()
    })

    // 绘制中心圆
    ctx.beginPath()
    ctx.arc(center, center, 35, 0, 2 * Math.PI)
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 35)
    gradient.addColorStop(0, '#D4AF37')
    gradient.addColorStop(1, '#B8860B')
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth = 3
    ctx.stroke()

  }, [prizes, canvasSize])

  // 同步 rotationRef
  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  // 处理旋转动画
  useEffect(() => {
    if (!isSpinning) return

    // 随机选择结果
    const selectedIndex = Math.floor(Math.random() * prizes.length)
    const anglePerPrize = 360 / prizes.length
    
    // 计算目标位置：使指针指向选中扇形的中心
    // 指针在顶部（12点钟方向），扇形从顶部开始顺时针绘制
    // 第 n 个扇形的中心角度 = (n + 0.5) * anglePerPrize
    // 要让这个中心旋转到顶部，需要旋转 360 - (n + 0.5) * anglePerPrize 度
    const targetPosition = 360 - (selectedIndex + 0.5) * anglePerPrize
    
    // 获取当前旋转位置（归一化到 0-360）
    const currentPosition = ((rotationRef.current % 360) + 360) % 360
    
    // 计算从当前位置到目标位置需要旋转的角度
    let delta = targetPosition - currentPosition
    if (delta <= 0) delta += 360 // 确保正向旋转
    
    // 转5-8圈 + 到达目标位置
    const spins = 5 + Math.random() * 3
    const totalRotation = Math.floor(spins) * 360 + delta
    
    setRotation(prev => prev + totalRotation)

    // 动画结束后回调
    const timer = setTimeout(() => {
      onSpinEnd(selectedIndex)
    }, 5000)

    return () => clearTimeout(timer)
  }, [isSpinning, prizes.length, onSpinEnd])

  return (
    <div 
      ref={containerRef}
      className="relative w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] md:w-[60vw] md:h-[60vw] lg:w-[45vw] lg:h-[45vw]"
    >
      {/* 外圈发光 */}
      <div className="absolute inset-0 rounded-full glow-gold animate-pulse-gold" />
      
      {/* 转盘外框 */}
      <div className="absolute inset-0 rounded-full border-[8px] md:border-[12px] border-gold-500 shadow-2xl">
        {/* 转盘本体 */}
        <motion.div
          className="w-full h-full rounded-full overflow-hidden"
          animate={{ rotate: rotation }}
          transition={{
            duration: 5,
            ease: [0.25, 0.1, 0.25, 1], // 自定义缓动
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="w-full h-full"
          />
        </motion.div>
      </div>

      {/* 指针 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
        <motion.div
          animate={isSpinning ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
        >
          <div className="relative">
            {/* 指针圆球 */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gold-500 shadow-lg" />
            {/* 指针三角 */}
            <div 
              className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[50px] border-l-transparent border-r-transparent border-t-gold-500"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* 中心按钮装饰 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-xl flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          animate={isSpinning ? { rotate: 360 } : {}}
          transition={isSpinning ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        >
          <span className="text-royal-50 font-bold text-xs md:text-sm">SPIN</span>
        </motion.div>
      </div>
    </div>
  )
}
