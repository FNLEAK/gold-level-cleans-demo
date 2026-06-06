import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSessionId, sendHeartbeat } from '../lib/api'

const HEARTBEAT_MS = 45_000

export function usePresence() {
  const { pathname } = useLocation()

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setInterval> | undefined

    async function beat() {
      if (cancelled) return
      try {
        const sessionId = getSessionId()
        const result = await sendHeartbeat(sessionId, pathname)
        if (!cancelled && result.sessionId !== sessionId) {
          sessionStorage.setItem('glc-session-id', result.sessionId)
        }
      } catch {
        /* API offline */
      }
    }

    const start = window.setTimeout(beat, 800)
    timer = window.setInterval(beat, HEARTBEAT_MS)

    return () => {
      cancelled = true
      window.clearTimeout(start)
      if (timer) window.clearInterval(timer)
    }
  }, [pathname])
}
