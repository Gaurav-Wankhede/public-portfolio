import useSWR, { SWRConfiguration, SWRResponse } from 'swr'

// Narrow error type used by SWR for better specificity
export type FetchError = Error & { status?: number }

// Simple in-memory ETag + data cache scoped to the browser tab/runtime
// Keyed by the SWR key (URL string recommended)
const etagCache = new Map<string, { etag?: string; data: unknown }>()

// Fetcher that:
// - Sends If-None-Match when we have a prior ETag for the same key
// - On 304 Not Modified, returns cached data without parsing a body
// - On 2xx, parses JSON and stores ETag + data into the cache
// - On non-OK (non-2xx, non-304), throws an Error for SWR error states
export async function etagFetcher<T = unknown>(key: string, init?: RequestInit): Promise<T> {
  const cached = etagCache.get(key)
  const headers = new Headers(init?.headers || {})
  if (cached?.etag) headers.set('If-None-Match', cached.etag)
  headers.set('Accept', headers.get('Accept') || 'application/json')

  const resp = await fetch(key, { ...init, headers, credentials: init?.credentials || 'include' })

  if (resp.status === 304) {
    if (cached) return cached.data as T
    // Edge case: 304 but no cached data — treat as soft error for visibility
    const err = new Error('Not Modified but no cached data available') as FetchError
    err.status = 304
    throw err
  }

  // On 429, if we have cached data, dispatch event and return cached
  if (resp.status === 429 && cached) {
    try {
      const retryAfterHeader = resp.headers.get('Retry-After')
      const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : undefined
      if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
        const evt = new CustomEvent('upsc:rate-limited-cached', { detail: { url: key, retryAfter: retryAfter ?? 60 } })
        window.dispatchEvent(evt)
      }
    } catch {}
    return cached.data as T
  }

  if (!resp.ok) {
    let message = `HTTP ${resp.status}`
    try {
      const errJson = await resp.json()
      message = errJson?.message || message
    } catch {}
    const err = new Error(message) as FetchError
    err.status = resp.status
    throw err
  }

  // Parse JSON payload
  const data = (await resp.json()) as T

  // Store/refresh ETag + data
  const etag = resp.headers.get('ETag') || undefined
  etagCache.set(key, { etag, data })

  return data
}

// Convenience SWR hook that defaults to the etagFetcher
export function useEtagSWR<T = unknown>(
  key: string | null,
  config?: SWRConfiguration<T, FetchError>
): SWRResponse<T, FetchError> {
  return useSWR<T, FetchError>(key, (k: string) => etagFetcher<T>(k), {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 1000, // avoid bursty re-requests
    ...config,
  })
}

// Utilities to manipulate cache programmatically if needed
export function getCachedEtag(key: string): string | undefined {
  return etagCache.get(key)?.etag
}

export function getCachedData<T = unknown>(key: string): T | undefined {
  return etagCache.get(key)?.data as T | undefined
}

export function clearEtagCache() {
  etagCache.clear()
}

