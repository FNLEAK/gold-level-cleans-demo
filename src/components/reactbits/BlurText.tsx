import { motion } from 'framer-motion'

type BlurTextProps = {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

/** React Bits–style blur-in text (https://reactbits.dev/text-animations/blur-text) */
export function BlurText({
  text,
  className = '',
  delay = 0,
  as: Tag = 'p',
}: BlurTextProps) {
  return (
    <motion.div
      initial={{ filter: 'blur(12px)', opacity: 0, y: 8 }}
      whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Tag className={className}>{text}</Tag>
    </motion.div>
  )
}
