import { useEffect, type CSSProperties, type ReactNode } from 'react'

export type GlowColor = 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'gold'

export interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: GlowColor
  size?: 'sm' | 'md' | 'lg'
  width?: string | number
  height?: string | number
  customSize?: boolean
  borderOnly?: boolean
}

/** Hue + accent for the traveling border streak (subtle by default). */
const glowPalette: Record<GlowColor, { hue: number; sat: number; light: number }> = {
  gold: { hue: 43, sat: 42, light: 52 },
  blue: { hue: 220, sat: 55, light: 58 },
  purple: { hue: 280, sat: 45, light: 58 },
  green: { hue: 145, sat: 40, light: 48 },
  red: { hue: 0, sat: 55, light: 55 },
  orange: { hue: 28, sat: 55, light: 55 },
}

let stylesMounted = false

function mountBorderStyles() {
  if (stylesMounted || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-glow-border-styles', '')
  el.textContent = `
    @property --glow-angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    [data-glow-border] {
      --glow-angle: 0deg;
      position: relative;
      isolation: isolate;
    }

    [data-glow-border]::before {
      content: "";
      position: absolute;
      inset: 0;
      padding: 1px;
      border-radius: inherit;
      background: conic-gradient(
        from var(--glow-angle),
        transparent 0deg,
        transparent 250deg,
        hsl(var(--glow-h) var(--glow-s) var(--glow-l) / 0.22) 285deg,
        hsl(var(--glow-h) var(--glow-s) calc(var(--glow-l) + 8%) / 0.42) 315deg,
        hsl(var(--glow-h) var(--glow-s) var(--glow-l) / 0.22) 345deg,
        transparent 360deg
      );
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      z-index: 2;
      animation: glow-border-spin 5.5s linear infinite;
    }

    [data-glow-border]::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      border: 1px solid hsl(var(--glow-h) var(--glow-s) var(--glow-l) / 0.12);
      pointer-events: none;
      z-index: 1;
    }

    @keyframes glow-border-spin {
      to {
        --glow-angle: 360deg;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      [data-glow-border]::before {
        animation: none;
        background: linear-gradient(
          135deg,
          hsl(var(--glow-h) var(--glow-s) var(--glow-l) / 0.14),
          hsl(var(--glow-h) var(--glow-s) var(--glow-l) / 0.22)
        );
      }
    }
  `
  document.head.appendChild(el)
  stylesMounted = true
}

function glowVars(color: GlowColor): CSSProperties & Record<string, string> {
  const { hue, sat, light } = glowPalette[color]
  return {
    '--glow-h': String(hue),
    '--glow-s': `${sat}%`,
    '--glow-l': `${light}%`,
  }
}

/** Full card shell — same continuous border treatment as GlowBorder. */
export function GlowCard({
  children,
  className = '',
  glowColor = 'gold',
  customSize = false,
  borderOnly = false,
}: GlowCardProps) {
  useEffect(() => {
    mountBorderStyles()
  }, [])

  if (borderOnly || customSize) {
    return (
      <GlowBorder glowColor={glowColor} className={className}>
        {children}
      </GlowBorder>
    )
  }

  return (
    <GlowBorder glowColor={glowColor} className={`grid grid-rows-[1fr_auto] gap-4 p-4 ${className}`}>
      {children}
    </GlowBorder>
  )
}

/** Subtle gold border with a streak that continuously travels around the edge. */
export function GlowBorder({
  children,
  className = '',
  glowColor = 'gold',
}: {
  children: ReactNode
  className?: string
  glowColor?: GlowColor
}) {
  useEffect(() => {
    mountBorderStyles()
  }, [])

  return (
    <div
      data-glow-border
      style={glowVars(glowColor)}
      className={`rounded-2xl ${className}`.trim()}
    >
      <div className="relative z-[3] h-full w-full rounded-[inherit]">{children}</div>
    </div>
  )
}
