import { Router } from 'express'
import { getRepos } from '../lib/state.js'

const router = Router()

/**
 * GET /api/gitfinder/repos
 *
 * Returns all repos in the hub's expected RepoInfo format.
 * The hub's useApi hook extracts the single `repos` key.
 */
router.get('/repos', (req, res) => {
  const rawRepos = getRepos()

  const repos = rawRepos.map(r => {
    const totalAhead = r._git?.totalAhead ?? (r.branches || []).reduce((s, b) => s + (b.aheadCount || 0), 0)
    const totalBehind = r._git?.totalBehind ?? (r.branches || []).reduce((s, b) => s + (b.behindCount || 0), 0)

    let status = 'clean'
    if (r._git?.isDirty) status = 'dirty'
    // Check if any conflict zones reference this repo
    const hasConflict = (r.branches || []).some(b => b.stalenessScore > 60)
    if (hasConflict) status = 'conflict'

    // Compute human-readable last activity
    const lastActivity = formatRelativeTime(r._git?.lastCommit || r.lastScanAt)

    return {
      name: r.name,
      ecosystem: r.ecosystem,
      readiness: r.mergeReadinessScore ?? 50,
      branches: r.branches?.length ?? 0,
      aheadBehind: { ahead: totalAhead, behind: totalBehind },
      lastActivity,
      status,
      defaultBranch: r.defaultBranch || 'dev',
    }
  })

  res.json({ live: true, repos })
})

/**
 * Format an ISO timestamp or git date into a human-readable relative time.
 */
function formatRelativeTime(dateStr) {
  if (!dateStr) return 'unknown'

  try {
    const date = new Date(dateStr)
    const now = Date.now()
    const diffMs = now - date.getTime()

    if (diffMs < 0) return 'just now'

    const minutes = Math.floor(diffMs / 60000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    return `${days}d ago`
  } catch {
    return 'unknown'
  }
}

export default router
