import { Router } from 'express'
import {
  getRepos,
  getWaves,
  getConflicts,
  getScanMeta,
  getActivity,
} from '../lib/state.js'

const router = Router()

/**
 * GET /api/gitfinder/dashboard
 *
 * Returns dashboard statistics and recent activity.
 * The hub's useApi hook receives { live, stats, activity }.
 * Since there are 2 keys beyond `live`, the hook returns { stats, activity } as-is.
 */
router.get('/dashboard', (req, res) => {
  const repos = getRepos()
  const waves = getWaves()
  const conflicts = getConflicts()
  const scanMeta = getScanMeta()
  const activity = getActivity(10)

  const totalBranches = repos.reduce(
    (sum, r) => sum + (r.branches?.length ?? 0),
    0,
  )

  const avgReadiness = repos.length > 0
    ? Math.round(repos.reduce((sum, r) => sum + (r.mergeReadinessScore ?? 50), 0) / repos.length)
    : 0

  const stats = {
    repos: repos.length,
    branches: totalBranches,
    mergePlans: waves.filter(w => w.status === 'pending').length,
    conflicts: conflicts.length,
    avgReadiness,
    lastScan: scanMeta.lastScanAt || new Date().toISOString(),
  }

  res.json({ live: true, stats, activity })
})

export default router
