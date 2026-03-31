'use client'

import { useApi } from '../hooks/use-api'
import { LiveBadge, ReadinessBar, WaveStatusBadge, Skeleton } from '../components/status-badge'
import type { MergeWave } from '../lib/types'

const WAVE_COLORS = [
  { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', accent: 'text-emerald-400', line: 'bg-emerald-500/40' },
  { bg: 'bg-blue-500/5', border: 'border-blue-500/20', accent: 'text-blue-400', line: 'bg-blue-500/40' },
  { bg: 'bg-purple-500/5', border: 'border-purple-500/20', accent: 'text-purple-400', line: 'bg-purple-500/40' },
  { bg: 'bg-amber-500/5', border: 'border-amber-500/20', accent: 'text-amber-400', line: 'bg-amber-500/40' },
]

export default function DagPage() {
  const { data: waves, live, loading } = useApi<MergeWave[]>('/api/gitfinder/waves')

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Merge DAG</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Topological wave execution plan with dependency tracking</p>
        </div>
        <LiveBadge live={live} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-emerald-500/60 rounded" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-blue-500/60 rounded" /> Pending
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border border-dashed border-zinc-600" /> Dependencies
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-zinc-600 rounded" /> Flow direction &rarr;
        </span>
      </div>

      {loading ? (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[280px] rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-5 space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-2 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Timeline visualization */}
          <div className="relative">
            {/* Horizontal connector line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 relative z-10">
              {(waves ?? []).map((wave, idx) => {
                const color = WAVE_COLORS[idx % WAVE_COLORS.length]
                return (
                  <div key={wave.id} className="flex flex-col">
                    {/* Wave number pill */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-8 h-8 rounded-full ${color.bg} ${color.border} border flex items-center justify-center text-sm font-bold ${color.accent}`}>
                        {wave.id}
                      </span>
                      <div className="flex-1 h-0.5 bg-zinc-800 hidden lg:block" />
                      {idx < (waves?.length ?? 0) - 1 && (
                        <span className="text-zinc-600 hidden lg:block">&rarr;</span>
                      )}
                    </div>

                    {/* Wave card */}
                    <div className={`rounded-xl ${color.bg} border ${color.border} p-4 flex-1 space-y-3`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold text-sm ${color.accent}`}>{wave.name}</h3>
                        <WaveStatusBadge status={wave.status} />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                          <span>Wave Readiness</span>
                          <span className="font-mono">{wave.readiness}%</span>
                        </div>
                        <ReadinessBar value={wave.readiness} size="sm" />
                      </div>

                      {/* Repos in this wave */}
                      <div className="space-y-1.5">
                        {wave.repos.map((repo) => (
                          <div key={repo} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-950/50 border border-zinc-800/30">
                            <span className={`w-1.5 h-1.5 rounded-full ${wave.status === 'completed' ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                            <span className="text-xs text-zinc-300 font-medium">{repo}</span>
                          </div>
                        ))}
                      </div>

                      {/* Dependencies */}
                      {wave.dependencies.length > 0 && (
                        <div className="text-[10px] text-zinc-600 pt-1 border-t border-zinc-800/30">
                          Depends on: Wave {wave.dependencies.join(', ')}
                        </div>
                      )}

                      {/* Execute button */}
                      <button
                        disabled={wave.status === 'completed'}
                        className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                          wave.status === 'completed'
                            ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
                            : wave.status === 'running'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 cursor-wait'
                            : `${color.bg} ${color.accent} border ${color.border} hover:bg-opacity-20 cursor-pointer`
                        }`}
                      >
                        {wave.status === 'completed' ? 'Completed' : wave.status === 'running' ? 'Running...' : 'Execute Wave'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Dependency Matrix */}
          <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300">Dependency Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-zinc-500">
                    <th className="text-left py-2 pr-4 font-medium">Wave</th>
                    <th className="text-left py-2 pr-4 font-medium">Repos</th>
                    <th className="text-left py-2 pr-4 font-medium">Depends On</th>
                    <th className="text-left py-2 pr-4 font-medium">Readiness</th>
                    <th className="text-left py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {(waves ?? []).map((wave) => (
                    <tr key={wave.id} className="border-t border-zinc-800/30">
                      <td className="py-2.5 pr-4 font-semibold">{wave.name}</td>
                      <td className="py-2.5 pr-4 font-mono text-zinc-400">{wave.repos.join(', ')}</td>
                      <td className="py-2.5 pr-4 text-zinc-500">
                        {wave.dependencies.length > 0
                          ? wave.dependencies.map(d => (waves ?? []).find(w => w.id === d)?.name ?? `Wave ${d}`).join(', ')
                          : '\u2014'}
                      </td>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <ReadinessBar value={wave.readiness} size="sm" />
                          <span className="font-mono text-zinc-400 w-8 text-right">{wave.readiness}%</span>
                        </div>
                      </td>
                      <td className="py-2.5"><WaveStatusBadge status={wave.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
