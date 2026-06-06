import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export type GlowColor = 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'gold'

export interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: GlowColor
  size?: 'sm' | 'md' | 'lg'
  width?: string | number
  height?: string | number
  /** When true, ignores size prop and uses width/height or className */
  customSize?: boolean
  /** Border glow only — no default padding, grid, or card shadow */
  borderOnly?: boolean
}

const glowColorMap: Record<GlowColor, { base: number; spread: number }> = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
  gold: { base: 42, spread: 28 },
}

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
}

let glowStylesMounted = false

const GLOW_STYLES = `
  [data-glow]::before,
  [data-glow]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-attachment: scroll;
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
  }

  [data-glow]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
    );
    filter: brightness(2);
  }

  [data-glow]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
    );
  }

  [data-glow] [data-glow] {
    position: absolute;
    inset: 0;
    will-change: filter;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius) * 1px);
    border-width: calc(var(--border-size) * 20);
    filter: blur(calc(var(--border-size) * 10));
    background: none;
    pointer-events: none;
    border: none;
  }

  [data-glow] > [data-glow]::before {
    inset: -10px;
    border-width: 10px;
  }
`

function mountGlowStyles() {
  if (glowStylesMounted || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-glow-styles', '')
  el.textContent = GLOW_STYLES
  document.head.appendChild(el)
  glowStylesMounted = true
}

export function GlowCard({
  children,
  className = '',
  glowColor = 'gold',
  size = 'md',
  width,
  height,
  customSize = false,
  borderOnly = false,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mountGlowStyles()
  }, [])

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      if (!cardRef.current) return
      const { clientX: x, clientY: y } = e
      cardRef.current.style.setProperty('--x', x.toFixed(2))
      cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2))
      cardRef.current.style.setProperty('--y', y.toFixed(2))
      cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2))
    }

    document.addEventListener('pointermove', syncPointer)
    return () => document.removeEventListener('pointermove', syncPointer)
  }, [])

  const { base, spread } = glowColorMap[glowColor]

  const inlineStyles: CSSProperties & Record<string, string | number> = {
    '--base': base,
    '--spread': spread,
    '--radius': borderOnly ? 16 : 14,
    '--border': borderOnly ? 2 : 3,
    '--backdrop': borderOnly ? 'transparent' : 'hsl(0 0% 60% / 0.12)',
    '--backup-border': borderOnly ? 'hsl(43 30% 22% / 0.45)' : 'var(--backdrop)',
    '--size': borderOnly ? 180 : 200,
    '--outer': 1,
    '--border-size': 'calc(var(--border, 2) * 1px)',
    '--spotlight-size': 'calc(var(--size, 150) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.08)), transparent
    )`,
    backgroundColor: 'var(--backdrop, transparent)',
    backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'scroll',
    border: 'var(--border-size) solid var(--backup-border)',
    position: 'relative',
    touchAction: borderOnly ? 'auto' : 'none',
  }

  if (width !== undefined) {
    inlineStyles.width = typeof width === 'number' ? `${width}px` : width
  }
  if (height !== undefined) {
    inlineStyles.height = typeof height === 'number' ? `${height}px` : height
  }

  const sizeClasses = customSize ? '' : sizeMap[size]

  return (
    <div
      ref={cardRef}
      data-glow
      style={inlineStyles}
      className={
        borderOnly
          ? `rounded-2xl ${sizeClasses} ${className}`.trim()
          : `
          ${sizeClasses}
          ${!customSize ? 'aspect-[3/4]' : ''}
          rounded-2xl
          relative
          grid
          grid-rows-[1fr_auto]
          shadow-[0_1rem_2rem_-1rem_black]
          p-4
          gap-4
          backdrop-blur-[5px]
          ${className}
        `
      }
    >
      <div data-glow aria-hidden />
      {children}
    </div>
  )
}

/** Animated spotlight border wrapper — use around existing panels; keep padding on inner content. */
export function GlowBorder({
  children,
  className = '',
  glowColor = 'gold',
}: {
  children: ReactNode
  className?: string
  glowColor?: GlowColor
}) {
  return (
    <GlowCard customSize borderOnly glowColor={glowColor} className={className}>
      {children}
    </GlowCard>
  )
}
