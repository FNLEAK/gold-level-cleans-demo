import { useRef, useState, type MouseEvent, type ReactNode } from 'react'

type SpotlightCardProps = {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

/** React Bits–style spotlight card (https://reactbits.dev/animations/spotlight-card) */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 215, 0, 0.15)',
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setOpacity(1)
  }

  function handleLeave() {
    setOpacity(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  )
}
