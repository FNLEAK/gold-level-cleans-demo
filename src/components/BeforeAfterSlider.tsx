import { ChevronsLeftRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type BeforeAfterSliderProps = {
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
  className?: string
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  className = '',
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)
  const [width, setWidth] = useState(0)
  const dragging = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    ro.observe(el)
    setWidth(el.offsetWidth)
    return () => ro.disconnect()
  }, [])

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(96, Math.max(4, pct)))
  }, [])

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging.current) return
      setFromClientX(e.clientX)
    }
    function onUp() {
      dragging.current = false
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [setFromClientX])

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative aspect-[4/3] touch-none select-none overflow-hidden bg-void"
        onPointerDown={(e) => {
          dragging.current = true
          setFromClientX(e.clientX)
        }}
        role="slider"
        aria-label="Before and after comparison. Pull each way to compare photos."
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPosition((p) => Math.max(4, p - 4))
          if (e.key === 'ArrowRight') setPosition((p) => Math.min(96, p + 4))
        }}
      >
        <img
          src={beforeSrc}
          alt={beforeAlt}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={afterSrc}
            alt={afterAlt}
            draggable={false}
            loading="lazy"
            decoding="async"
            className="absolute inset-y-0 left-0 h-full max-w-none object-cover"
            style={{ width: width || '100%' }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-gold-400 shadow-[0_0_16px_rgba(212,175,55,0.85)]"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        />

        <div
          className="pointer-events-none absolute top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold-400/80 bg-void/90 text-gold-400 shadow-[0_0_24px_-4px_rgba(212,175,55,0.65)] backdrop-blur-sm"
          style={{ left: `${position}%` }}
        >
          <ChevronsLeftRight className="h-5 w-5 animate-slider-hint-sway" aria-hidden />
        </div>

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col items-start gap-1">
          <span className="rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
            Before
          </span>
          <span className="rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/85 backdrop-blur-sm">
            Pull →
          </span>
        </div>

        <div className="pointer-events-none absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
          <span className="rounded-full border border-gold-400/35 bg-gold-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300 backdrop-blur-sm">
            After
          </span>
          <span className="rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-300/95 backdrop-blur-sm">
            ← Pull
          </span>
        </div>
      </div>

      <p className="flex items-center justify-center gap-2 border-t border-white/[0.06] bg-void-300/35 px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-300">
        <ChevronsLeftRight className="h-3.5 w-3.5 shrink-0 animate-slider-hint-sway text-gold-400" aria-hidden />
        Pull each way to compare before &amp; after
      </p>
    </div>
  )
}
