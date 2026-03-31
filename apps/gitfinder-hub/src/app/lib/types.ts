export interface RepoInfo {
  name: string
  ecosystem: string
  readiness: number
  branches: number
  aheadBehind: { ahead: number; behind: number }
  lastActivity: string
  status: 'clean' | 'dirty' | 'conflict'
  defaultBranch: string
}

export interface DashboardStats {
  repos: number
  branches: number
  mergePlans: number
  conflicts: number
  avgReadiness: number
  lastScan: string
}

export interface ConflictZone {
  id: string
  file: string
  repos: string[]
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  predictedAt: string
}

export interface MergeWave {
  id: number
  name: string
  repos: string[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  dependencies: number[]
  readiness: number
}

export interface ActivityItem {
  id: string
  type: 'merge' | 'scan' | 'conflict' | 'wave'
  message: string
  repo?: string
  timestamp: string
}
