import type { RepoInfo, DashboardStats, ConflictZone, MergeWave, ActivityItem } from './types'

export const SAMPLE_REPOS: RepoInfo[] = [
  { name: 'finder-starter', ecosystem: 'finder', readiness: 92, branches: 4, aheadBehind: { ahead: 2, behind: 0 }, lastActivity: '12m ago', status: 'clean', defaultBranch: 'dev' },
  { name: 'ODYN-starter', ecosystem: 'odyn', readiness: 87, branches: 3, aheadBehind: { ahead: 0, behind: 1 }, lastActivity: '28m ago', status: 'clean', defaultBranch: 'dev' },
  { name: 'admin-starter', ecosystem: 'admin', readiness: 95, branches: 2, aheadBehind: { ahead: 0, behind: 0 }, lastActivity: '1h ago', status: 'clean', defaultBranch: 'dev' },
  { name: 'design-starter', ecosystem: 'design', readiness: 78, branches: 5, aheadBehind: { ahead: 3, behind: 2 }, lastActivity: '45m ago', status: 'dirty', defaultBranch: 'dev' },
  { name: 'etd-starter', ecosystem: 'etd', readiness: 84, branches: 3, aheadBehind: { ahead: 1, behind: 0 }, lastActivity: '2h ago', status: 'clean', defaultBranch: 'dev' },
  { name: 'devtools-manager', ecosystem: 'devtools', readiness: 71, branches: 6, aheadBehind: { ahead: 5, behind: 3 }, lastActivity: '8m ago', status: 'dirty', defaultBranch: 'dev' },
  { name: 'crowds', ecosystem: 'crowds', readiness: 90, branches: 2, aheadBehind: { ahead: 0, behind: 0 }, lastActivity: '3h ago', status: 'clean', defaultBranch: 'dev' },
  { name: 'finderauth', ecosystem: 'finderauth', readiness: 96, branches: 2, aheadBehind: { ahead: 1, behind: 0 }, lastActivity: '6h ago', status: 'clean', defaultBranch: 'dev' },
  { name: 'feedback-starter', ecosystem: 'feedback', readiness: 65, branches: 4, aheadBehind: { ahead: 2, behind: 4 }, lastActivity: '1d ago', status: 'conflict', defaultBranch: 'dev' },
  { name: 'gitfinder-starter', ecosystem: 'gitfinder', readiness: 45, branches: 3, aheadBehind: { ahead: 8, behind: 0 }, lastActivity: '2m ago', status: 'dirty', defaultBranch: 'dev' },
  { name: 'opensoftware-starter', ecosystem: 'opensoftware', readiness: 82, branches: 3, aheadBehind: { ahead: 1, behind: 1 }, lastActivity: '4h ago', status: 'clean', defaultBranch: 'dev' },
  { name: 'db-manager', ecosystem: 'db-manager', readiness: 88, branches: 2, aheadBehind: { ahead: 0, behind: 0 }, lastActivity: '5h ago', status: 'clean', defaultBranch: 'dev' },
]

export const SAMPLE_STATS: DashboardStats = {
  repos: 12,
  branches: 39,
  mergePlans: 3,
  conflicts: 2,
  avgReadiness: 81,
  lastScan: new Date().toISOString(),
}

export const SAMPLE_CONFLICTS: ConflictZone[] = [
  { id: 'c1', file: 'packages/auth-nextauth/src/index.ts', repos: ['finder-starter', 'admin-starter', 'ODYN-starter'], severity: 'critical', description: 'Three repos modified the auth session handler independently. Overlapping changes in getServerSession() wrapper.', predictedAt: '15m ago' },
  { id: 'c2', file: 'packages/masterpanel/src/components/shell.tsx', repos: ['design-starter', 'devtools-manager'], severity: 'high', description: 'Both repos extended MasterPanel shell with different plugin APIs. Tab registration conflicts likely.', predictedAt: '1h ago' },
  { id: 'c3', file: 'templates/claude-hooks/base/session-start-hook.ts', repos: ['master-weaver-master', 'finder-starter'], severity: 'medium', description: 'Session-start hook diverged: master added team-sync alerts, finder added custom scanner.', predictedAt: '3h ago' },
  { id: 'c4', file: 'packages/db-adapter/src/dialects/postgres.ts', repos: ['db-manager', 'crowds'], severity: 'medium', description: 'Connection pool settings differ between implementations. Pool size and idle timeout changed.', predictedAt: '6h ago' },
  { id: 'c5', file: 'apps/admin/src/components/sidebar.tsx', repos: ['admin-starter', 'feedback-starter'], severity: 'low', description: 'Minor styling differences in sidebar navigation component.', predictedAt: '1d ago' },
]

export const SAMPLE_WAVES: MergeWave[] = [
  { id: 1, name: 'Foundation', repos: ['finderauth', 'db-manager'], status: 'completed', dependencies: [], readiness: 96 },
  { id: 2, name: 'Core Starters', repos: ['finder-starter', 'admin-starter', 'etd-starter'], status: 'pending', dependencies: [1], readiness: 90 },
  { id: 3, name: 'Extended', repos: ['ODYN-starter', 'design-starter', 'crowds', 'opensoftware-starter'], status: 'pending', dependencies: [1, 2], readiness: 84 },
  { id: 4, name: 'Meta & Tools', repos: ['devtools-manager', 'gitfinder-starter', 'feedback-starter'], status: 'pending', dependencies: [2, 3], readiness: 60 },
]

export const SAMPLE_ACTIVITY: ActivityItem[] = [
  { id: 'a1', type: 'scan', message: 'Full ecosystem scan completed — 12 repos analyzed', timestamp: '2m ago' },
  { id: 'a2', type: 'merge', message: 'Wave 1 (Foundation) merged successfully', repo: 'finderauth', timestamp: '15m ago' },
  { id: 'a3', type: 'conflict', message: 'New conflict predicted in auth-nextauth', repo: 'finder-starter', timestamp: '22m ago' },
  { id: 'a4', type: 'wave', message: 'Wave 2 readiness increased to 90%', timestamp: '45m ago' },
  { id: 'a5', type: 'scan', message: 'Remote sync detected 3 new pushes', timestamp: '1h ago' },
  { id: 'a6', type: 'merge', message: 'dev branch synced with origin', repo: 'crowds', timestamp: '2h ago' },
]
