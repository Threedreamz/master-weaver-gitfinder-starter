'use client'

import { useState, useMemo } from 'react'
import { useApi } from '../hooks/use-api'
import { LiveBadge, ReadinessBar, EcoBadge, Skeleton } from '../components/status-badge'
import type { RepoInfo } from '../lib/types'

type SortKey = 'name' | 'ecosystem' | 'readiness' | 'branches' | 'status'
type SortDir = 'asc' | 'desc'

export default function ReposPage() {
  const { data: repos, live, loading } = useApi<RepoInfo[]>('/api/gitfinder/repos')
  const [sortKey, setSortKey] = useState<SortKey>('readiness')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [filter, setFilter] = useState('')

  const sorted = useMemo(() => {
    if (!repos) return []
    let filtered = repos
    if (filter) {
      const q = filter.toLowerCase()
      filtered = repos.filter(r => r.name.toLowerCase().includes(q) || r.ecosystem.toLowerCase().includes(q))
    }
    return [...filtered].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortKey === 'ecosystem') cmp = a.ecosystem.localeCompare(b.ecosystem)
      else if (sortKey === 'readiness') cmp = a.readiness - b.readiness
      else if (sortKey === 'branches') cmp = a.branches - b.branches
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [repos, sortKey, sortDir, filter])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const SortHeader = ({ k, label, className = '' }: { k: SortKey; label: string; className?: string }) => (
    <button
      onClick={() => toggleSort(k)}
      className={`text-left text-[11px] uppercase tracking-wider font-semibold text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 ${className}`}
    >
      {label}
      {sortKey === k && <span className="text-blue-400">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>}
    </button>
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Repositories</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{sorted.length} repos across the ecosystem</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter repos..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 w-48"
          />
          <LiveBadge live={live} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-2 w-32" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800/50 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-zinc-900/80 border-b border-zinc-800/50 items-center">
            <SortHeader k="name" label="Repository" className="col-span-3" />
            <SortHeader k="ecosystem" label="Ecosystem" className="col-span-2" />
            <SortHeader k="readiness" label="Readiness" className="col-span-2" />
            <SortHeader k="branches" label="Branches" className="col-span-1" />
            <div className="col-span-2 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">Ahead / Behind</div>
            <SortHeader k="status" label="Status" className="col-span-1" />
            <div className="col-span-1 text-[11px] uppercase tracking-wider font-semibold text-zinc-500">Last</div>
          </div>

          {/* Rows */}
          {sorted.map((repo) => {
            const statusCls =
              repo.status === 'clean' ? 'text-emerald-400 bg-emerald-400/10' :
              repo.status === 'dirty' ? 'text-amber-400 bg-amber-400/10' :
              'text-red-400 bg-red-400/10'

            return (
              <div key={repo.name} className="grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-zinc-800/30 items-center hover:bg-zinc-900/50 transition-colors">
                <div className="col-span-3 font-medium text-sm text-zinc-200">{repo.name}</div>
                <div className="col-span-2"><EcoBadge ecosystem={repo.ecosystem} /></div>
                <div className="col-span-2 flex items-center gap-2">
                  <ReadinessBar value={repo.readiness} size="sm" />
                  <span className="text-xs font-mono text-zinc-400 w-8 text-right">{repo.readiness}%</span>
                </div>
                <div className="col-span-1 text-sm text-zinc-400 font-mono">{repo.branches}</div>
                <div className="col-span-2 text-xs font-mono">
                  {repo.aheadBehind.ahead > 0 && <span className="text-emerald-400">+{repo.aheadBehind.ahead}</span>}
                  {repo.aheadBehind.ahead > 0 && repo.aheadBehind.behind > 0 && <span className="text-zinc-600"> / </span>}
                  {repo.aheadBehind.behind > 0 && <span className="text-red-400">-{repo.aheadBehind.behind}</span>}
                  {repo.aheadBehind.ahead === 0 && repo.aheadBehind.behind === 0 && <span className="text-zinc-600">in sync</span>}
                </div>
                <div className="col-span-1">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${statusCls}`}>
                    {repo.status}
                  </span>
                </div>
                <div className="col-span-1 text-xs text-zinc-500">{repo.lastActivity}</div>
              </div>
            )
          })}

          {sorted.length === 0 && (
            <div className="px-5 py-12 text-center text-zinc-500 text-sm">No repos match your filter.</div>
          )}
        </div>
      )}
    </div>
  )
}
