import { Router } from 'express'
import { getConflicts } from '../lib/state.js'

const router = Router()

/**
 * GET /api/gitfinder/conflicts
 *
 * Returns detected conflict zones in the hub's ConflictZone format.
 * The hub's useApi hook extracts the single `conflicts` key.
 */
router.get('/conflicts', (req, res) => {
  const conflicts = getConflicts()
  res.json({ live: true, conflicts })
})

export default router
