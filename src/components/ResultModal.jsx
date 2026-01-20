import { motion } from 'framer-motion'

export default function ResultModal({ result, onClose, isLucky }) {
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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      
      {/* 弹窗内容 */}
      <motion.div
        className="relative z-10 glass-card p-8 md:p-12 max-w-lg w-full text-center"
        initial={{ scale: 0.5, opacity: 0, rotateX: -15 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotateX: 15 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 装饰性顶部 */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:rotate-90 duration-300"
        >
          <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 图标 */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          {isLucky ? (
            <span className="text-6xl md:text-7xl">🎉</span>
          ) : (
            <span className="text-6xl md:text-7xl">😅</span>
          )}
        </motion.div>

        {/* 标题 */}
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-gold-400 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isLucky ? '恭喜中奖！' : '再接再厉！'}
        </motion.h2>

        {/* 结果 */}
        <motion.div
          className="bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 rounded-xl p-6 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
            {result}
          </p>
        </motion.div>

        {/* 确认按钮 */}
        <motion.button
          onClick={onClose}
          className="btn-gold px-8 py-3 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          好的
        </motion.button>

        {/* 装饰性底部 */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      </motion.div>
    </motion.div>
  )
}
