'use client'

import { useState, useEffect, useCallback } from 'react'

interface ApiResult<T> {
  data: T | null
  live: boolean
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useApi<T>(url: string, interval = 30000): ApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setLive(json.live ?? false)
      // Extract the main data key (repos, stats, conflicts, waves, etc.)
      const { live: _live, ...rest } = json
      const keys = Object.keys(rest)
      if (keys.length === 1) {
        setData(rest[keys[0]] as T)
      } else {
        setData(rest as T)
      }
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, interval)
    return () => clearInterval(id)
  }, [fetchData, interval])

  return { data, live, loading, error, refresh: fetchData }
}
