import type { ReactNode } from 'react'

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-void text-mist">
      <div className="pointer-events-none fixed inset-0 gold-haze" aria-hidden />
      <div className="relative">{children}</div>
    </div>
  )
}
