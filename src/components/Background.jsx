import { motion } from 'framer-motion'

export default function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 主背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-royal-50 via-royal-100 to-royal-50" />
      
      {/* 装饰性光晕 */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* 粒子效果 */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* 网格纹理 */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* 装饰性边框 */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-gold-500/20 hidden lg:block" />
      <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-gold-500/20 hidden lg:block" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-gold-500/20 hidden lg:block" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-gold-500/20 hidden lg:block" />
    </div>
  )
}
