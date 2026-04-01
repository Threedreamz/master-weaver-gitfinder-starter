import express from 'express'
import cors from 'cors'

import dashboardRouter from './routes/dashboard.js'
import reposRouter from './routes/repos.js'
import wavesRouter from './routes/waves.js'
import conflictsRouter from './routes/conflicts.js'
import graphRouter from './routes/graph.js'
import scanRouter from './routes/scan.js'
import { seedState } from './lib/scanner.js'

const PORT = Number(process.env.PORT) || 4631
const app = express()

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors())
app.use(express.json())

// ---------------------------------------------------------------------------
// Health check — required for Railway deployment
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'gitfinder-api',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  })
})

// ---------------------------------------------------------------------------
// GitFinder API routes
// ---------------------------------------------------------------------------
app.use('/api/gitfinder', dashboardRouter)
app.use('/api/gitfinder', reposRouter)
app.use('/api/gitfinder', wavesRouter)
app.use('/api/gitfinder', conflictsRouter)
app.use('/api/gitfinder', graphRouter)
app.use('/api/gitfinder', scanRouter)

// ---------------------------------------------------------------------------
// 404 fallback
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    endpoints: [
      'GET  /api/health',
      'GET  /api/gitfinder/dashboard',
      'GET  /api/gitfinder/repos',
      'GET  /api/gitfinder/waves',
      'GET  /api/gitfinder/conflicts',
      'GET  /api/gitfinder/graph',
      'GET  /api/gitfinder/scan',
      'POST /api/gitfinder/scan',
    ],
  })
})

// ---------------------------------------------------------------------------
// Error handler
// ---------------------------------------------------------------------------
app.use((err, req, res, _next) => {
  console.error(`[gitfinder-api] Error on ${req.method} ${req.path}:`, err.message)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  })
})

// ---------------------------------------------------------------------------
// Start server + initial scan
// ---------------------------------------------------------------------------
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[gitfinder-api] listening on http://0.0.0.0:${PORT}`)
  console.log(`[gitfinder-api] endpoints:`)
  console.log(`  GET  /api/health`)
  console.log(`  GET  /api/gitfinder/dashboard`)
  console.log(`  GET  /api/gitfinder/repos`)
  console.log(`  GET  /api/gitfinder/waves`)
  console.log(`  GET  /api/gitfinder/conflicts`)
  console.log(`  GET  /api/gitfinder/graph`)
  console.log(`  GET  /api/gitfinder/scan`)
  console.log(`  POST /api/gitfinder/scan`)

  // Seed state with initial scan so endpoints return data immediately
  seedState().then(result => {
    console.log(`[gitfinder-api] initial scan complete`)
  }).catch(err => {
    console.error(`[gitfinder-api] initial scan failed:`, err.message)
  })
})

// Graceful shutdown
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    console.log(`[gitfinder-api] ${signal} received, shutting down...`)
    server.close(() => process.exit(0))
  })
}
