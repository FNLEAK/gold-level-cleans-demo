import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

export type SelectOption = {
  value: string
  label: string
  hint?: string
}

type SelectFieldProps = {
  id: string
  label: ReactNode
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  name?: string
  required?: boolean
  placeholder?: string
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  name,
  required,
  placeholder = 'Select…',
}: SelectFieldProps) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function pick(next: string) {
    onChange(next)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      {name ? <input type="hidden" name={name} value={value} required={required} /> : null}

      <label htmlFor={id} className="block text-xs font-semibold tracking-wide text-fog">
        {label}
      </label>

      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((v) => !v)}
        className={`mt-2 flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border bg-void-200/60 px-4 py-3 text-left font-sans text-[15px] text-white shadow-sm transition [touch-action:manipulation] ${
          open
            ? 'border-gold-400/55 ring-2 ring-gold-400/15'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <span className="min-w-0 flex-1 truncate">
          {selected ? (
            <span className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
              <span className="font-medium text-mist">{selected.label}</span>
              {selected.hint ? (
                <span className="text-xs text-fog/90">{selected.hint}</span>
              ) : null}
            </span>
          ) : (
            <span className="text-fog/80">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gold-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 z-[120] mt-2 origin-top"
          >
            <ul
              id={listboxId}
              role="listbox"
              aria-labelledby={id}
              className="select-scroll max-h-[min(16rem,50vh)] overflow-y-auto overscroll-contain rounded-2xl border border-gold-400/25 bg-[#0c0c0c]/95 p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85)] backdrop-blur-xl"
            >
              {options.map((option) => {
                const isSelected = option.value === value
                return (
                  <li key={option.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => pick(option.value)}
                      className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition [touch-action:manipulation] ${
                        isSelected
                          ? 'bg-gold-muted text-gold-300'
                          : 'text-mist hover:bg-white/[0.06]'
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium leading-snug">{option.label}</span>
                        {option.hint ? (
                          <span className="mt-0.5 block text-xs text-fog">{option.hint}</span>
                        ) : null}
                      </span>
                      {isSelected ? (
                        <Check className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                      ) : (
                        <span className="h-4 w-4 shrink-0" aria-hidden />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
