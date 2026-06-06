import { motion } from 'framer-motion'

const easeOut = [0.22, 1, 0.36, 1] as const

type PageHeaderProps = {
  eyebrow: string
  title: string
  subtitle?: string
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  className = '',
}: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
      className={`text-center md:text-left ${className}`}
    >
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-gold-400">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-balance font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-2xl text-balance font-sans text-base leading-relaxed text-fog md:mx-0">
          {subtitle}
        </p>
      ) : null}
    </motion.header>
  )
}
