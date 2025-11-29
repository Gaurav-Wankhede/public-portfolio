"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export interface RateLimitBannerProps {
  className?: string
  autoHideMs?: number
}

// Listens for 'upsc:rate-limited-cached' and shows a small inline banner.
// Intended for analytics/leaderboard sections to indicate cached-data rendering under 429.
export function RateLimitBanner({ className, autoHideMs = 4000 }: RateLimitBannerProps) {
  const [visible, setVisible] = useState(false)
  const [retryAfter, setRetryAfter] = useState<number | null>(null)

  useEffect(() => {
    function onRateLimitedCached(e: Event) {
      const detail = (e as CustomEvent).detail as { url?: string; retryAfter?: number }
      const ra = typeof detail?.retryAfter === 'number' ? detail.retryAfter : 60
      setRetryAfter(ra)
      setVisible(true)
      const t = setTimeout(() => setVisible(false), autoHideMs)
      return () => clearTimeout(t)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('upsc:rate-limited-cached', onRateLimitedCached as EventListener)
      return () => window.removeEventListener('upsc:rate-limited-cached', onRateLimitedCached as EventListener)
    }
  }, [autoHideMs])

  if (!visible) return null

  return (
    <Alert className={"border-amber-200 bg-amber-50 " + (className || "") }>
      <AlertDescription className="text-amber-800">
        Server is rate limiting. Showing cached data. {retryAfter ? `Try again in ${retryAfter}s.` : null}
      </AlertDescription>
    </Alert>
  )
}
