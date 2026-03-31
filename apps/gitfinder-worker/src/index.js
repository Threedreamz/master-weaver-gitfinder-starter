import { createServer } from 'node:http'

const PORT = process.env.PORT || 4632

const server = createServer((req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', app: 'gitfinder-worker', timestamp: new Date().toISOString() }))
    return
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ app: 'gitfinder-worker', version: '0.1.0' }))
})

server.listen(PORT, '0.0.0.0', () => console.log(`gitfinder-worker listening on :${PORT}`))
