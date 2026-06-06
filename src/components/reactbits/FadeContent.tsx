import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type FadeContentProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  delay?: number
}

/** React Bits–style scroll fade (https://reactbits.dev/animations/fade-content) */
export function FadeContent({
  children,
  delay = 0,
  className = '',
  ...rest
}: FadeContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
