import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function Background() {
  // 生成随机星星位置
  const stars = useMemo(() => 
    [...Array(50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    })), []
  )

  // 生成流星
  const meteors = useMemo(() =>
    [...Array(6)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: i * 3 + Math.random() * 2,
    })), []
  )

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 深色渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d1528] to-[#0a0a1a]" />
      
      {/* 径向渐变叠加 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)]" />
      
      {/* 顶部光晕 */}
      <motion.div
        className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[150%] h-[60%] bg-gradient-radial from-gold-500/15 via-gold-500/5 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* 底部光晕 */}
      <motion.div
        className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[50%] bg-gradient-radial from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* 浮动光球 */}
      <motion.div
        className="absolute top-1/3 left-[10%] w-64 h-64 bg-gold-500/10 rounded-full blur-[100px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-1/2 right-[10%] w-48 h-48 bg-rose-500/8 rounded-full blur-[80px]"
        animate={{
          x: [0, -80, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      {/* 星星 */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* 流星 */}
      <div className="absolute inset-0 overflow-hidden">
        {meteors.map((meteor) => (
          <motion.div
            key={meteor.id}
            className="absolute w-[2px] h-20 bg-gradient-to-b from-white via-gold-300 to-transparent"
            style={{
              left: `${meteor.left}%`,
              top: '-80px',
              transform: 'rotate(45deg)',
            }}
            animate={{
              y: ['0vh', '120vh'],
              x: ['0vw', '30vw'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: meteor.delay,
              repeatDelay: 8,
            }}
          />
        ))}
      </div>
      
      {/* 网格纹理 */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* 噪点纹理 */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* 装饰性边框 - 更精致 */}
      <div className="absolute top-6 left-6 w-32 h-32 hidden lg:block">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold-500/60 to-transparent" />
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-gold-500/60 to-transparent" />
        <motion.div 
          className="absolute top-0 left-0 w-2 h-2 bg-gold-500 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="absolute top-6 right-6 w-32 h-32 hidden lg:block">
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-gold-500/60 to-transparent" />
        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-gold-500/60 to-transparent" />
        <motion.div 
          className="absolute top-0 right-0 w-2 h-2 bg-gold-500 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      <div className="absolute bottom-6 left-6 w-32 h-32 hidden lg:block">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold-500/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[2px] h-full bg-gradient-to-t from-gold-500/60 to-transparent" />
        <motion.div 
          className="absolute bottom-0 left-0 w-2 h-2 bg-gold-500 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </div>
      <div className="absolute bottom-6 right-6 w-32 h-32 hidden lg:block">
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-gold-500/60 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[2px] h-full bg-gradient-to-t from-gold-500/60 to-transparent" />
        <motion.div 
          className="absolute bottom-0 right-0 w-2 h-2 bg-gold-500 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />
      </div>

      {/* 2026 年份装饰 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[200px] font-bold text-white/[0.02] pointer-events-none select-none hidden md:block">
        2026
      </div>
    </div>
  )
}
