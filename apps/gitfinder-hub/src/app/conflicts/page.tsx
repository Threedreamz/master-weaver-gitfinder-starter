'use client'

import { useState, useMemo } from 'react'
import { useApi } from '../hooks/use-api'
import { LiveBadge, SeverityBadge, EcoBadge, Skeleton } from '../components/status-badge'
import type { ConflictZone } from '../lib/types'

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

export default function ConflictsPage() {
  const { data: conflicts, live, loading } = useApi<ConflictZone[]>('/api/gitfinder/conflicts')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')

  const grouped = useMemo(() => {
    if (!conflicts) return { critical: [], high: [], medium: [], low: [] }
    const filtered = filterSeverity === 'all' ? conflicts : conflicts.filter(c => c.severity === filterSeverity)
    const groups: Record<string, ConflictZone[]> = { critical: [], high: [], medium: [], low: [] }
    for (const c of filtered) {
      ;(groups[c.severity] ?? groups.low).push(c)
    }
    return groups
  }, [conflicts, filterSeverity])

  const counts = useMemo(() => {
    if (!conflicts) return { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
    const c = { critical: 0, high: 0, medium: 0, low: 0, total: conflicts.length }
    for (const item of conflicts) c[item.severity]++
    return c
  }, [conflicts])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Conflict Zones</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Predicted merge conflicts across the ecosystem</p>
        </div>
        <LiveBadge live={live} />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <SummaryCard label="Total" count={counts.total} color="text-zinc-200" active={filterSeverity === 'all'} onClick={() => setFilterSeverity('all')} />
        <SummaryCard label="Critical" count={counts.critical} color="text-red-400" active={filterSeverity === 'critical'} onClick={() => setFilterSeverity('critical')} />
        <SummaryCard label="High" count={counts.high} color="text-orange-400" active={filterSeverity === 'high'} onClick={() => setFilterSeverity('high')} />
        <SummaryCard label="Medium" count={counts.medium} color="text-amber-400" active={filterSeverity === 'medium'} onClick={() => setFilterSeverity('medium')} />
        <SummaryCard label="Low" count={counts.low} color="text-zinc-400" active={filterSeverity === 'low'} onClick={() => setFilterSeverity('low')} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-5 space-y-3">
              <div className="flex gap-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-64" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-48" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(['critical', 'high', 'medium', 'low'] as const).map((severity) => {
            const items = grouped[severity]
            if (items.length === 0) return null
            return items.map((conflict) => (
              <ConflictCard key={conflict.id} conflict={conflict} />
            ))
          })}

          {Object.values(grouped).every(g => g.length === 0) && (
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-12 text-center">
              <div className="text-3xl mb-3">&#10004;</div>
              <div className="text-zinc-300 font-medium">No conflicts detected</div>
              <div className="text-zinc-500 text-sm mt-1">All ecosystem repos are conflict-free</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, count, color, active, onClick }: { label: string; count: number; color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-3.5 text-left transition-all ${
        active ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700/50'
      }`}
    >
      <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">{label}</div>
      <div className={`text-2xl font-bold mt-0.5 ${color}`}>{count}</div>
    </button>
  )
}

function ConflictCard({ conflict }: { conflict: ConflictZone }) {
  const borderColor =
    conflict.severity === 'critical' ? 'border-l-red-500' :
    conflict.severity === 'high' ? 'border-l-orange-500' :
    conflict.severity === 'medium' ? 'border-l-amber-500' :
    'border-l-zinc-600'

  return (
    <div className={`rounded-xl bg-zinc-900/50 border border-zinc-800/50 border-l-2 ${borderColor} p-5 space-y-3 hover:bg-zinc-900/80 transition-colors`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <SeverityBadge severity={conflict.severity} />
          <code className="text-xs text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded font-mono">
            {conflict.file}
          </code>
        </div>
        <span className="text-[10px] text-zinc-600 whitespace-nowrap">{conflict.predictedAt}</span>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">{conflict.description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium mr-1">Affected:</span>
        {conflict.repos.map((repo) => (
          <span key={repo} className="inline-flex px-2 py-0.5 rounded bg-zinc-800/60 text-[11px] text-zinc-300 font-medium">
            {repo}
          </span>
        ))}
      </div>
    </div>
  )
}
