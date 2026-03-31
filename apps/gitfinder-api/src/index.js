import { createServer } from 'node:http'

const PORT = process.env.PORT || 4631

const server = createServer((req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', app: 'gitfinder-api', timestamp: new Date().toISOString() }))
    return
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ app: 'gitfinder-api', version: '0.1.0', endpoints: ['/api/health'] }))
})

server.listen(PORT, '0.0.0.0', () => console.log(`gitfinder-api listening on :${PORT}`))
