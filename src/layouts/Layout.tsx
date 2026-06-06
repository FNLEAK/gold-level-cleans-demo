import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AiChatWidget } from '../components/AiChatWidget'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { usePresence } from '../hooks/usePresence'

export function Layout() {
  const { pathname } = useLocation()
  usePresence()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="relative flex min-h-dvh min-h-svh flex-col overflow-x-clip bg-void text-mist">
      <div className="pointer-events-none fixed inset-0 gold-haze" aria-hidden />
      <Header />
      <main className="relative flex-1 pb-[max(4.75rem,calc(3.75rem+env(safe-area-inset-bottom)))] [touch-action:manipulation] md:pb-16">
        <Outlet />
      </main>
      <Footer />
      <AiChatWidget />
    </div>
  )
}
