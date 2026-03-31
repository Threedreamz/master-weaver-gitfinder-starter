'use client'

export function LiveBadge({ live }: { live: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      live ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-emerald-400 live-dot' : 'bg-amber-400'}`} />
      {live ? 'Live' : 'Sample Data'}
    </span>
  )
}

export function ReadinessBar({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' }) {
  const color =
    value >= 90 ? 'bg-emerald-500' :
    value >= 75 ? 'bg-blue-500' :
    value >= 50 ? 'bg-amber-500' :
    'bg-red-500'

  const h = size === 'sm' ? 'h-1.5' : 'h-2'

  return (
    <div className={`w-full ${h} bg-zinc-800 rounded-full overflow-hidden`}>
      <div
        className={`${h} ${color} rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export function EcoBadge({ ecosystem }: { ecosystem: string }) {
  const colors: Record<string, string> = {
    finder: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    odyn: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    admin: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    design: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    etd: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    devtools: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    crowds: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    finderauth: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    feedback: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    gitfinder: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
    opensoftware: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
    'db-manager': 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  }
  const cls = colors[ecosystem] ?? 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20'
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${cls}`}>
      {ecosystem}
    </span>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-5 space-y-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-2 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: 'bg-red-500/15 text-red-400 border-red-500/25',
    high: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    low: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${map[severity] ?? map.low}`}>
      {severity}
    </span>
  )
}

export function WaveStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-emerald-500/15 text-emerald-400',
    running: 'bg-blue-500/15 text-blue-400',
    pending: 'bg-zinc-700/50 text-zinc-400',
    failed: 'bg-red-500/15 text-red-400',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${map[status] ?? map.pending}`}>
      {status}
    </span>
  )
}
