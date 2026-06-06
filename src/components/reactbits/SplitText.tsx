import { motion } from 'framer-motion'

type SplitTextProps = {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

/** React Bits–style split text reveal (https://reactbits.dev/text-animations/split-text) */
export function SplitText({
  text,
  className = '',
  delay = 0,
  as: Tag = 'span',
}: SplitTextProps) {
  const words = text.split(' ')

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.45,
              delay: delay + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
