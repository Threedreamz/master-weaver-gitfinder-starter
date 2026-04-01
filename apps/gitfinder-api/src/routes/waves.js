import { Router } from 'express'
import { getWaves } from '../lib/state.js'

const router = Router()

/**
 * GET /api/gitfinder/waves
 *
 * Returns merge waves in the hub's MergeWave format.
 * The hub's useApi hook extracts the single `waves` key.
 */
router.get('/waves', (req, res) => {
  const waves = getWaves()
  res.json({ live: true, waves })
})

export default router
