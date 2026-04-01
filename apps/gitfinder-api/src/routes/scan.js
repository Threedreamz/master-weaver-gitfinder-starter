import { Router } from 'express'
import { runScan } from '../lib/scanner.js'
import { getScanMeta, addActivity } from '../lib/state.js'

const router = Router()

/**
 * POST /api/gitfinder/scan
 *
 * Triggers a full ecosystem scan. Used by the gitfinder-worker on a
 * schedule and can be called manually from the hub or CLI.
 *
 * Returns immediately if a scan is already in progress.
 */
router.post('/scan', async (req, res) => {
  const meta = getScanMeta()

  if (meta.scanning) {
    return res.status(409).json({
      live: true,
      status: 'already-scanning',
      message: 'A scan is already in progress',
    })
  }

  addActivity('scan', 'Manual scan triggered')

  // Run scan asynchronously — respond immediately
  const result = await runScan()

  res.json({
    live: true,
    status: result.skipped ? 'skipped' : result.error ? 'error' : 'completed',
    ...result,
  })
})

/**
 * GET /api/gitfinder/scan
 *
 * Returns the current scan status (last scan time, count, in-progress flag).
 */
router.get('/scan', (req, res) => {
  const meta = getScanMeta()
  res.json({ live: true, scan: meta })
})

export default router
