import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useAnimation } from 'framer-motion'

// 更丰富的颜色配置 - 红金配色，更有年会氛围
const COLORS = [
  { bg: '#C41E3A', text: '#FFD700' },  // 中国红 + 金
  { bg: '#FFD700', text: '#8B0000' },  // 金 + 深红
  { bg: '#B22222', text: '#FFF8DC' },  // 火砖红 + 米白
  { bg: '#DAA520', text: '#800000' },  // 金麦色 + 栗色
  { bg: '#DC143C', text: '#FFE4B5' },  // 猩红 + 鹿皮色
  { bg: '#F4C430', text: '#8B0000' },  // 藏红花黄 + 深红
  { bg: '#8B0000', text: '#FFD700' },  // 深红 + 金
  { bg: '#FF8C00', text: '#FFFAF0' },  // 深橙 + 花白
]

export default function LotteryWheel({ prizes, isSpinning, shouldStop, onSpinEnd }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const rotationRef = useRef(0)
  const selectedIndexRef = useRef(0)
  const spinTimerRef = useRef(null)
  const controls = useAnimation()
  const [canvasSize, setCanvasSize] = useState(400)

  // 计算Canvas尺寸
  const updateCanvasSize = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const size = Math.min(container.offsetWidth, container.offsetHeight, 650)
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

    // 获取设备像素比，提高清晰度
    const dpr = window.devicePixelRatio || 1
    const displaySize = canvasSize
    
    // 设置 canvas 的实际像素尺寸（更高分辨率）
    canvas.width = displaySize * dpr
    canvas.height = displaySize * dpr
    
    // 设置 canvas 的显示尺寸
    canvas.style.width = displaySize + 'px'
    canvas.style.height = displaySize + 'px'
    
    const ctx = canvas.getContext('2d')
    
    // 缩放绘图上下文以匹配设备像素比
    ctx.scale(dpr, dpr)
    
    const center = displaySize / 2
    const radius = displaySize / 2 - 15
    const anglePerPrize = (2 * Math.PI) / prizes.length

    ctx.clearRect(0, 0, displaySize, displaySize)

    // 绘制外圈阴影
    ctx.beginPath()
    ctx.arc(center, center, radius + 5, 0, 2 * Math.PI)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fill()

    // 绘制每个扇形
    prizes.forEach((prize, index) => {
      const startAngle = index * anglePerPrize - Math.PI / 2
      const endAngle = (index + 1) * anglePerPrize - Math.PI / 2
      const colorScheme = COLORS[index % COLORS.length]

      // 绘制扇形
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, radius, startAngle, endAngle)
      ctx.closePath()
      
      // 创建渐变填充
      const midAngle = (startAngle + endAngle) / 2
      const gradient = ctx.createLinearGradient(
        center + Math.cos(midAngle) * radius * 0.3,
        center + Math.sin(midAngle) * radius * 0.3,
        center + Math.cos(midAngle) * radius,
        center + Math.sin(midAngle) * radius
      )
      gradient.addColorStop(0, colorScheme.bg)
      gradient.addColorStop(1, adjustBrightness(colorScheme.bg, -20))
      
      ctx.fillStyle = gradient
      ctx.fill()
      
      // 扇形边框
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)'
      ctx.lineWidth = 2
      ctx.stroke()

      // 绘制文字
      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(startAngle + anglePerPrize / 2)

      // 计算文字参数
      const text = prize
      const totalChars = text.length
      const innerRadius = 60
      const outerRadius = radius - 15
      const availableLength = outerRadius - innerRadius
      
      // 根据字符数量动态计算字体大小
      let fontSize = Math.floor(availableLength / (totalChars * 1.1))
      fontSize = Math.max(10, Math.min(18, fontSize))

      // 使用更清晰的字体设置
      ctx.font = `bold ${fontSize}px "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", sans-serif`
      ctx.fillStyle = colorScheme.text
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'
      ctx.lineWidth = 3
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // 启用文字抗锯齿
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      const charSpacing = fontSize * 1.2
      const totalLength = totalChars * charSpacing
      const startX = innerRadius + (availableLength - totalLength) / 2 + charSpacing / 2

      // 逐字绘制（先描边后填充，确保清晰）
      for (let i = 0; i < totalChars; i++) {
        const char = text.charAt(i)
        const x = startX + i * charSpacing
        ctx.strokeText(char, x, 0)
        ctx.fillText(char, x, 0)
      }

      ctx.restore()
    })

    // 绘制内圈装饰环
    ctx.beginPath()
    ctx.arc(center, center, 50, 0, 2 * Math.PI)
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)'
    ctx.lineWidth = 3
    ctx.stroke()

    // 绘制中心圆 - 渐变效果
    ctx.beginPath()
    ctx.arc(center, center, 45, 0, 2 * Math.PI)
    const centerGradient = ctx.createRadialGradient(center - 10, center - 10, 0, center, center, 45)
    centerGradient.addColorStop(0, '#FFE4B5')
    centerGradient.addColorStop(0.3, '#FFD700')
    centerGradient.addColorStop(0.7, '#DAA520')
    centerGradient.addColorStop(1, '#B8860B')
    ctx.fillStyle = centerGradient
    ctx.fill()
    
    // 中心圆边框
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 3
    ctx.stroke()

    // 中心圆高光
    ctx.beginPath()
    ctx.arc(center - 12, center - 12, 15, 0, 2 * Math.PI)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.fill()

  }, [prizes, canvasSize])

  // 处理旋转动画
  useEffect(() => {
    if (!isSpinning) return

    // 随机选择结果
    const selectedIndex = Math.floor(Math.random() * prizes.length)
    selectedIndexRef.current = selectedIndex
    const anglePerPrize = 360 / prizes.length
    
    const targetPosition = 360 - (selectedIndex + 0.5) * anglePerPrize
    const currentPosition = ((rotationRef.current % 360) + 360) % 360
    
    let delta = targetPosition - currentPosition
    if (delta <= 0) delta += 360
    
    const spins = 5 + Math.random() * 3
    const totalRotation = Math.floor(spins) * 360 + delta
    const finalRotation = rotationRef.current + totalRotation
    
    // 开始动画
    controls.start({
      rotate: finalRotation,
      transition: {
        duration: 5,
        ease: [0.2, 0.8, 0.2, 1],
      }
    })
    
    rotationRef.current = finalRotation

    // 动画结束后回调
    spinTimerRef.current = setTimeout(() => {
      onSpinEnd(selectedIndex)
    }, 5000)

    return () => {
      if (spinTimerRef.current) {
        clearTimeout(spinTimerRef.current)
      }
    }
  }, [isSpinning, prizes.length, onSpinEnd, controls])

  // 处理立即停止
  useEffect(() => {
    if (!shouldStop || !isSpinning) return

    // 清除原来的定时器
    if (spinTimerRef.current) {
      clearTimeout(spinTimerRef.current)
    }

    // 获取当前旋转角度，并计算停在哪个奖项
    const anglePerPrize = 360 / prizes.length
    
    // 随机选择一个奖项（快速停止时）
    const selectedIndex = Math.floor(Math.random() * prizes.length)
    selectedIndexRef.current = selectedIndex
    
    const targetPosition = 360 - (selectedIndex + 0.5) * anglePerPrize
    const currentPosition = ((rotationRef.current % 360) + 360) % 360
    
    let delta = targetPosition - currentPosition
    if (delta <= 0) delta += 360
    
    // 只转1圈就停止
    const totalRotation = 360 + delta
    const finalRotation = rotationRef.current + totalRotation
    
    // 快速停止动画
    controls.start({
      rotate: finalRotation,
      transition: {
        duration: 1.5,
        ease: [0.4, 0, 0.2, 1],
      }
    })
    
    rotationRef.current = finalRotation

    // 1.5秒后回调
    spinTimerRef.current = setTimeout(() => {
      onSpinEnd(selectedIndex)
    }, 1500)

  }, [shouldStop, isSpinning, prizes.length, onSpinEnd, controls])

  return (
    <div 
      ref={containerRef}
      className="relative w-[70vw] h-[70vw] max-w-[300px] max-h-[300px] sm:max-w-[360px] sm:max-h-[360px] md:w-[55vh] md:h-[55vh] md:max-w-[500px] md:max-h-[500px] lg:max-w-[550px] lg:max-h-[550px] xl:max-w-[600px] xl:max-h-[600px]"
    >
      {/* 最外层光晕 */}
      <motion.div 
        className="absolute -inset-6 md:-inset-8 rounded-full bg-gradient-radial from-gold-500/30 via-gold-500/10 to-transparent blur-xl"
        animate={{
          opacity: isSpinning ? [0.5, 1, 0.5] : 0.6,
          scale: isSpinning ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: isSpinning ? Infinity : 0,
        }}
      />

      {/* 装饰环 - 外圈灯泡效果 */}
      <div className="absolute -inset-3 md:-inset-4 rounded-full">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full"
            style={{
              left: `calc(50% + ${Math.cos((i / 24) * Math.PI * 2 - Math.PI / 2) * 50}% - 5px)`,
              top: `calc(50% + ${Math.sin((i / 24) * Math.PI * 2 - Math.PI / 2) * 50}% - 5px)`,
              background: i % 2 === 0 ? '#FFD700' : '#FF4444',
              boxShadow: i % 2 === 0 
                ? '0 0 8px #FFD700, 0 0 16px #FFD700' 
                : '0 0 8px #FF4444, 0 0 16px #FF4444',
            }}
            animate={{
              opacity: isSpinning 
                ? [1, 0.3, 1] 
                : [0.6, 1, 0.6],
              scale: isSpinning ? [1, 0.8, 1] : 1,
            }}
            transition={{
              duration: isSpinning ? 0.15 : 1.5,
              repeat: Infinity,
              delay: isSpinning ? (i * 0.02) : (i * 0.1),
            }}
          />
        ))}
      </div>
      
      {/* 转盘外框 - 3D效果 */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #FFE4B5 0%, #DAA520 25%, #B8860B 50%, #8B4513 75%, #654321 100%)',
          padding: '10px',
          boxShadow: `
            0 0 0 3px rgba(255, 215, 0, 0.8),
            0 0 25px rgba(255, 215, 0, 0.5),
            inset 0 0 15px rgba(0,0,0,0.3),
            0 8px 30px rgba(0,0,0,0.5)
          `,
        }}
      >
        {/* 转盘本体 */}
        <motion.div
          className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
          style={{
            boxShadow: 'inset 0 0 25px rgba(0,0,0,0.4)',
          }}
          animate={controls}
        >
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full"
          />
        </motion.div>
      </div>

      {/* 指针 */}
      <div className="absolute -top-1 md:-top-2 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={isSpinning ? { 
            y: [0, -4, 0],
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
        >
          {/* 指针底座 */}
          <div className="relative">
            <div 
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #FFE4B5, #DAA520, #B8860B)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
            />
            {/* 指针三角 */}
            <div 
              className="relative z-10"
              style={{
                width: 0,
                height: 0,
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderTop: '50px solid #C41E3A',
                filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.5))',
              }}
            />
            {/* 指针高光 */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '25px solid rgba(255,255,255,0.3)',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* 中心按钮 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.div
          className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #FFE4B5 0%, #FFD700 30%, #DAA520 60%, #B8860B 100%)',
            boxShadow: `
              0 0 0 3px rgba(139, 69, 19, 0.8),
              0 6px 20px rgba(0,0,0,0.5),
              inset 0 2px 8px rgba(255,255,255,0.5)
            `,
          }}
          animate={isSpinning ? { 
            rotate: 360,
            boxShadow: [
              '0 0 0 3px rgba(139, 69, 19, 0.8), 0 6px 20px rgba(0,0,0,0.5), 0 0 25px rgba(255,215,0,0.5)',
              '0 0 0 3px rgba(139, 69, 19, 0.8), 0 6px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,215,0,0.8)',
              '0 0 0 3px rgba(139, 69, 19, 0.8), 0 6px 20px rgba(0,0,0,0.5), 0 0 25px rgba(255,215,0,0.5)',
            ]
          } : {}}
          transition={isSpinning ? { 
            rotate: { duration: 1, repeat: Infinity, ease: "linear" },
            boxShadow: { duration: 0.5, repeat: Infinity }
          } : {}}
        >
          <span 
            className="text-xs md:text-sm lg:text-base font-black tracking-wider"
            style={{
              color: '#8B4513',
              textShadow: '0 1px 2px rgba(255,255,255,0.5)',
            }}
          >
            {isSpinning ? '🎲' : 'GO!'}
          </span>
        </motion.div>
      </div>
    </div>
  )
}

// 调整颜色亮度
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)
}
