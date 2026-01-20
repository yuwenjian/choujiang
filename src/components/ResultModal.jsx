import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ResultModal({ result, onClose, isLucky }) {
  const [showFireworks, setShowFireworks] = useState(false)

  useEffect(() => {
    if (isLucky) {
      setShowFireworks(true)
      const timer = setTimeout(() => setShowFireworks(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isLucky])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* 遮罩 */}
      <motion.div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* 烟花效果 */}
      {showFireworks && isLucky && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 40}%`,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 1.5, 2],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: 2,
                repeatDelay: 1,
              }}
            >
              {[...Array(8)].map((_, j) => (
                <motion.div
                  key={j}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8C00', '#9B59B6'][j % 5],
                    boxShadow: `0 0 10px ${['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8C00', '#9B59B6'][j % 5]}`,
                  }}
                  initial={{ x: 0, y: 0 }}
                  animate={{
                    x: Math.cos((j / 8) * Math.PI * 2) * 80,
                    y: Math.sin((j / 8) * Math.PI * 2) * 80,
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.2,
                    repeat: 2,
                    repeatDelay: 1,
                  }}
                />
              ))}
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 弹窗内容 */}
      <motion.div
        className="relative z-10 max-w-md w-full mx-4"
        initial={{ scale: 0.3, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.3, opacity: 0, y: -100 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 卡片主体 */}
        <div 
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(30,30,50,0.95) 0%, rgba(20,20,40,0.98) 100%)',
            boxShadow: `
              0 0 0 2px rgba(255, 215, 0, 0.3),
              0 0 60px rgba(255, 215, 0, 0.2),
              0 25px 80px rgba(0, 0, 0, 0.6)
            `,
          }}
        >
          {/* 顶部装饰带 */}
          <div className="h-2 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />
          
          {/* 内容区域 */}
          <div className="p-8 md:p-10">
            {/* 关闭按钮 */}
            <motion.button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* 图标动画 */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="relative">
                {isLucky ? (
                  <>
                    {/* 光环效果 */}
                    <motion.div
                      className="absolute inset-0 -m-6 rounded-full bg-gradient-to-r from-gold-500/30 to-yellow-500/30 blur-xl"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-2xl">
                      <motion.span 
                        className="text-5xl md:text-6xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                      >
                        🎉
                      </motion.span>
                    </div>
                  </>
                ) : (
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-2xl">
                    <motion.span 
                      className="text-5xl md:text-6xl"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      😅
                    </motion.span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 标题 */}
            <motion.h2
              className={`text-center text-3xl md:text-4xl font-bold mb-6 ${
                isLucky 
                  ? 'bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent' 
                  : 'text-gray-300'
              }`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isLucky ? '🎊 恭喜中奖 🎊' : '下次好运！'}
            </motion.h2>

            {/* 奖品展示 */}
            <motion.div
              className="relative rounded-2xl p-6 md:p-8 mb-8 overflow-hidden"
              style={{
                background: isLucky 
                  ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 140, 0, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(100, 100, 100, 0.1) 0%, rgba(80, 80, 80, 0.1) 100%)',
                border: isLucky ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255,255,255,0.1)',
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* 闪光效果 */}
              {isLucky && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              )}
              
              <p className={`relative text-center text-2xl md:text-3xl font-bold ${
                isLucky ? 'text-gold-300' : 'text-gray-400'
              }`}>
                {result}
              </p>
            </motion.div>

            {/* 确认按钮 */}
            <motion.button
              onClick={onClose}
              className="w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all relative overflow-hidden group"
              style={{
                background: isLucky 
                  ? 'linear-gradient(135deg, #D4AF37 0%, #F4C430 50%, #DAA520 100%)'
                  : 'linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%)',
                color: isLucky ? '#1a1a2e' : '#ffffff',
                boxShadow: isLucky 
                  ? '0 8px 30px rgba(212, 175, 55, 0.4)' 
                  : '0 8px 30px rgba(0, 0, 0, 0.3)',
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 按钮闪光 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative">{isLucky ? '太棒了！' : '再来一次'}</span>
            </motion.button>
          </div>

          {/* 底部装饰带 */}
          <div className="h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        </div>

        {/* 装饰性角标 */}
        {isLucky && (
          <>
            <motion.div 
              className="absolute -top-3 -left-3 text-4xl"
              animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <motion.div 
              className="absolute -top-3 -right-3 text-4xl"
              animate={{ rotate: [0, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              ✨
            </motion.div>
            <motion.div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-4xl"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🎁
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
