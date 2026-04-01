'use client'

import { useApi } from './hooks/use-api'
import { LiveBadge, ReadinessBar, EcoBadge, CardSkeleton, Skeleton } from './components/status-badge'
import type { RepoInfo, DashboardStats, ActivityItem } from './lib/types'

export default function DashboardPage() {
  const { data: dashData, live, loading: dashLoading } = useApi<{ stats: DashboardStats; activity: ActivityItem[] }>('/api/gitfinder/dashboard')
  const { data: repos, loading: repoLoading } = useApi<RepoInfo[]>('/api/gitfinder/repos')

  const stats = dashData?.stats
  const activity = dashData?.activity ?? []

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <span className="text-3xl">&#9095;</span>
            GitFinder Dashboard
          </h1>
          <p className="text-sm text-zinc-500 mt-1">DAG-Based Smart Merge Orchestration</p>
        </div>
        <LiveBadge live={live} />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {dashLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-7 w-12" />
            </div>
          ))
        ) : (
          <>
            <StatCard label="Repositories" value={stats?.repos ?? 0} />
            <StatCard label="Branches" value={stats?.branches ?? 0} />
            <StatCard label="Merge Plans" value={stats?.mergePlans ?? 0} accent="blue" />
            <StatCard label="Conflicts" value={stats?.conflicts ?? 0} accent={stats?.conflicts ? 'red' : undefined} />
            <StatCard label="Avg Readiness" value={`${stats?.avgReadiness ?? 0}%`} accent="green" />
          </>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repos — 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Repositories</h2>
            <a href="/repos" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all &rarr;</a>
          </div>
          {repoLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : !repos || repos.length === 0 ? (
            <OnboardingCard />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {repos.slice(0, 8).map((repo) => (
                <RepoCard key={repo.name} repo={repo} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column — Quick Actions + Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Quick Actions</h2>
            <div className="space-y-2">
              <ActionButton href="/repos" label="Scan All Repos" icon="&#9881;" desc="Fetch latest status from all ecosystem repos" />
              <ActionButton href="/dag" label="View Merge DAG" icon="&#9095;" desc="Visualize dependency graph and waves" accent />
              <ActionButton href="/conflicts" label="Check Conflicts" icon="&#9888;" desc="Review predicted conflict zones" />
              <ActionButton href="/waves" label="Run Wave Plan" icon="&#9654;" desc="Execute topological merge sequence" />
            </div>
          </div>

          {/* Activity */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Recent Activity</h2>
            {dashLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {activity.slice(0, 6).map((item) => (
                  <ActivityRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: 'blue' | 'red' | 'green' }) {
  const accentCls =
    accent === 'blue' ? 'text-blue-400' :
    accent === 'red' ? 'text-red-400' :
    accent === 'green' ? 'text-emerald-400' :
    'text-zinc-100'

  return (
    <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4 hover:border-zinc-700/50 transition-colors">
      <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${accentCls}`}>{value}</div>
    </div>
  )
}

function RepoCard({ repo }: { repo: RepoInfo }) {
  const statusDot =
    repo.status === 'clean' ? 'bg-emerald-400' :
    repo.status === 'dirty' ? 'bg-amber-400' :
    'bg-red-400'

  return (
    <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4 hover:border-zinc-700 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusDot}`} />
          <span className="font-semibold text-sm text-zinc-200 group-hover:text-zinc-100 transition-colors">{repo.name}</span>
        </div>
        <EcoBadge ecosystem={repo.ecosystem} />
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
          <span>Readiness</span>
          <span className="font-mono">{repo.readiness}%</span>
        </div>
        <ReadinessBar value={repo.readiness} size="sm" />
      </div>
      <div className="flex items-center gap-4 text-[11px] text-zinc-500">
        <span>{repo.branches} branches</span>
        <span>
          {repo.aheadBehind.ahead > 0 && <span className="text-emerald-400">+{repo.aheadBehind.ahead}</span>}
          {repo.aheadBehind.ahead > 0 && repo.aheadBehind.behind > 0 && ' / '}
          {repo.aheadBehind.behind > 0 && <span className="text-red-400">-{repo.aheadBehind.behind}</span>}
          {repo.aheadBehind.ahead === 0 && repo.aheadBehind.behind === 0 && <span className="text-zinc-600">in sync</span>}
        </span>
        <span className="ml-auto">{repo.lastActivity}</span>
      </div>
    </div>
  )
}

function ActionButton({ href, label, icon, desc, accent }: { href: string; label: string; icon: string; desc: string; accent?: boolean }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all group ${
        accent
          ? 'bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40'
          : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900'
      }`}
    >
      <span className="text-lg w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-700/80 transition-colors">
        {icon}
      </span>
      <div>
        <div className={`text-sm font-medium ${accent ? 'text-blue-400' : 'text-zinc-200'}`}>{label}</div>
        <div className="text-[11px] text-zinc-500">{desc}</div>
      </div>
    </a>
  )
}

function OnboardingCard() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 p-8 text-center">
      <div className="text-4xl mb-4">&#9095;</div>
      <h3 className="text-base font-semibold text-zinc-200 mb-1">No repos registered yet</h3>
      <p className="text-sm text-zinc-500 mb-6 max-w-xs mx-auto">
        GitFinder needs to discover your ecosystem repos. Register them in{' '}
        <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">ecosystem.json</code>{' '}
        then trigger a scan.
      </p>
      <div className="space-y-3 text-left max-w-sm mx-auto mb-6">
        <Step n={1} text="Open ecosystem.json in master-weaver-master" />
        <Step n={2} text="Add your repos under the correct ecosystem block" />
        <Step n={3} text="Trigger a scan to discover them" />
      </div>
      <a
        href="/repos"
        className="inline-flex items-center gap-2 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 hover:border-blue-500/40 transition-all px-5 py-2.5 text-sm font-medium text-blue-400"
      >
        &#9881; Scan &amp; Discover Repos
      </a>
    </div>
  )
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 text-[11px] font-bold flex items-center justify-center">
        {n}
      </span>
      <span className="text-zinc-400">{text}</span>
    </div>
  )
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const icons: Record<string, { icon: string; color: string }> = {
    merge: { icon: '\u2934', color: 'text-emerald-400 bg-emerald-400/10' },
    scan: { icon: '\u21BB', color: 'text-blue-400 bg-blue-400/10' },
    conflict: { icon: '\u26A0', color: 'text-red-400 bg-red-400/10' },
    wave: { icon: '\u25B6', color: 'text-purple-400 bg-purple-400/10' },
  }
  const { icon, color } = icons[item.type] ?? icons.scan

  return (
    <div className="flex gap-2.5 items-start py-2 px-2 rounded-lg hover:bg-zinc-900/50 transition-colors">
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${color}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-zinc-300 leading-tight">{item.message}</div>
        <div className="text-[10px] text-zinc-600 mt-0.5 flex gap-2">
          {item.repo && <span className="text-zinc-500">{item.repo}</span>}
          <span>{item.timestamp}</span>
        </div>
      </div>
    </div>
  )
}
