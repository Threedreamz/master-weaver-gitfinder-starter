'use client'

import { useState } from 'react'
import { useApi } from '../hooks/use-api'
import { LiveBadge, ReadinessBar, WaveStatusBadge, Skeleton } from '../components/status-badge'
import type { MergeWave } from '../lib/types'

export default function WavesPage() {
  const { data: waves, live, loading, refresh } = useApi<MergeWave[]>('/api/gitfinder/waves')
  const [executing, setExecuting] = useState<number | null>(null)

  async function executeWave(waveId: number) {
    setExecuting(waveId)
    // In a real implementation this would POST to the control plane
    await new Promise(resolve => setTimeout(resolve, 2000))
    setExecuting(null)
    refresh()
  }

  const completedCount = (waves ?? []).filter(w => w.status === 'completed').length
  const totalCount = (waves ?? []).length
  const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Wave Executor</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Topological merge execution with progress tracking</p>
        </div>
        <LiveBadge live={live} />
      </div>

      {/* Overall progress */}
      <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-zinc-300">Overall Progress</span>
          <span className="text-sm font-mono text-zinc-400">{completedCount} / {totalCount} waves</span>
        </div>
        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[11px] text-zinc-600">
          <span>Start</span>
          <span>{overallProgress}% complete</span>
          <span>Finish</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-5 space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-2 w-full" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(waves ?? []).map((wave, idx) => {
            const canExecute = wave.status === 'pending' &&
              wave.dependencies.every(depId => (waves ?? []).find(w => w.id === depId)?.status === 'completed')
            const isExecuting = executing === wave.id
            const blockedBy = wave.dependencies
              .filter(depId => (waves ?? []).find(w => w.id === depId)?.status !== 'completed')
              .map(depId => (waves ?? []).find(w => w.id === depId)?.name ?? `Wave ${depId}`)

            return (
              <div key={wave.id} className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden">
                {/* Wave header */}
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/30">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300">
                      {wave.id}
                    </span>
                    <div>
                      <div className="font-semibold text-sm text-zinc-200">{wave.name}</div>
                      <div className="text-[11px] text-zinc-500">
                        {wave.repos.length} repos
                        {wave.dependencies.length > 0 && ` \u00B7 depends on wave ${wave.dependencies.join(', ')}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <WaveStatusBadge status={wave.status} />
                    <button
                      onClick={() => executeWave(wave.id)}
                      disabled={!canExecute || isExecuting}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        wave.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 cursor-default'
                          : isExecuting
                          ? 'bg-blue-500/20 text-blue-400 cursor-wait'
                          : canExecute
                          ? 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30 cursor-pointer'
                          : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      {wave.status === 'completed'
                        ? '\u2713 Done'
                        : isExecuting
                        ? 'Executing...'
                        : canExecute
                        ? 'Execute Wave'
                        : `Blocked by ${blockedBy.join(', ')}`}
                    </button>
                  </div>
                </div>

                {/* Readiness bar */}
                <div className="px-5 py-3 border-b border-zinc-800/20">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
                    <span>Wave Readiness</span>
                    <span className="font-mono">{wave.readiness}%</span>
                  </div>
                  <ReadinessBar value={wave.readiness} />
                </div>

                {/* Repo list */}
                <div className="px-5 py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {wave.repos.map((repo) => (
                      <div
                        key={repo}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-950/50 border border-zinc-800/30"
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          wave.status === 'completed' ? 'bg-emerald-400' :
                          isExecuting ? 'bg-blue-400 live-dot' :
                          'bg-zinc-600'
                        }`} />
                        <span className="text-xs text-zinc-300 font-medium">{repo}</span>
                        {wave.status === 'completed' && (
                          <span className="ml-auto text-[10px] text-emerald-400">\u2713</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
