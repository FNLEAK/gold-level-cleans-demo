import { animate, motion, useInView, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const easeOut = [0.22, 1, 0.36, 1] as const

type AnimatedStatValueProps = {
  value: string
  countTo?: number
  suffix?: string
  className?: string
  duration?: number
  delay?: number
}

export function AnimatedStatValue({
  value,
  countTo,
  suffix = '',
  className = '',
  duration = 1.2,
  delay = 0,
}: AnimatedStatValueProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20px 0px' })
  const motionCount = useMotionValue(0)
  const [display, setDisplay] = useState(0)
  const isNumeric = countTo != null

  useMotionValueEvent(motionCount, 'change', (latest) => {
    setDisplay(Math.round(latest))
  })

  useEffect(() => {
    if (!isNumeric || !inView) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      motionCount.set(countTo)
      return
    }

    motionCount.set(0)
    const controls = animate(motionCount, countTo, {
      duration,
      delay,
      ease: easeOut,
    })

    return () => controls.stop()
  }, [inView, isNumeric, countTo, duration, delay, motionCount])

  const content = isNumeric ? (
    <>
      {display}
      {suffix}
    </>
  ) : (
    value
  )

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${isNumeric ? 'tabular-nums' : ''} ${className}`.trim()}
      aria-label={value}
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 14, scale: 0.94 }
      }
      transition={{
        duration: 0.55,
        delay,
        ease: easeOut,
      }}
    >
      {content}
    </motion.span>
  )
}
