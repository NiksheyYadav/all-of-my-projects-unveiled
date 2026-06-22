import { motion } from 'framer-motion'

export default function AnimatedForest({ points }: { points: number }) {
  const trees = Math.floor(points / 10) // 1 tree per 10 points

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: trees }).map((_, i) => (
        <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="text-2xl">🌳</div>
        </motion.div>
      ))}
    </div>
  )
}
