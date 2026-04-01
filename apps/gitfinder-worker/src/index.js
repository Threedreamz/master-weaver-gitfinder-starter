import { createServer } from 'node:http'

const PORT = Number(process.env.PORT) || 4632
const API_URL = process.env.GITFINDER_API_URL || 'http://localhost:4631'
const SCAN_INTERVAL = Number(process.env.SCAN_INTERVAL_MS) || 4 * 60 * 60 * 1000 // 4 hours

let lastScanResult = null
let lastScanAt = null
let scanCount = 0
let scanning = false

async function triggerScan() {
  if (scanning) return
  scanning = true
  const start = Date.now()
  console.log(`[worker] Triggering scan at ${new Date().toISOString()}`)
  try {
    const res = await fetch(`${API_URL}/api/gitfinder/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(120_000),
    })
    if (res.ok) {
      lastScanResult = await res.json()
      lastScanAt = new Date().toISOString()
      scanCount++
      console.log(`[worker] Scan #${scanCount} complete in ${Date.now() - start}ms: ${lastScanResult.scanned} repos`)
    } else {
      console.error(`[worker] Scan failed: ${res.status} ${res.statusText}`)
    }
  } catch (err) {
    console.error(`[worker] Scan error: ${err.message}`)
  } finally {
    scanning = false
  }
}

const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json')

  if (req.url === '/api/health') {
    res.writeHead(200)
    res.end(JSON.stringify({
      status: 'ok',
      app: 'gitfinder-worker',
      timestamp: new Date().toISOString(),
      scanning,
      scanCount,
      lastScanAt,
      lastScanResult,
      intervalMin: Math.round(SCAN_INTERVAL / 60_000),
    }))
    return
  }

  if (req.url === '/api/scan' && req.method === 'POST') {
    triggerScan()
    res.writeHead(202)
    res.end(JSON.stringify({ accepted: true, message: 'Scan triggered' }))
    return
  }

  res.writeHead(200)
  res.end(JSON.stringify({ app: 'gitfinder-worker', version: '0.1.0' }))
})

let scanTimer = null

server.listen(PORT, '0.0.0.0', () => {
  console.log(`gitfinder-worker listening on :${PORT}`)
  console.log(`[worker] API: ${API_URL}, interval: ${SCAN_INTERVAL / 60_000}m`)

  // Initial scan after 30s (give API time to start)
  setTimeout(triggerScan, 30_000)

  // Recurring scans
  scanTimer = setInterval(triggerScan, SCAN_INTERVAL)
})

function shutdown() {
  console.log('[worker] Shutting down...')
  if (scanTimer) clearInterval(scanTimer)
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(1), 5000)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
