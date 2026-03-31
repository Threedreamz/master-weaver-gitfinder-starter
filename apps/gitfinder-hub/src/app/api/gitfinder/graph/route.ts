import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const CONTROL_PLANE_URL = process.env.CONTROL_PLANE_URL || 'https://devtools-control-plane-dev.up.railway.app'

export async function GET() {
  try {
    const res = await fetch(`${CONTROL_PLANE_URL}/api/gitfinder/graph`, {
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Control plane returned ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ live: true, graph: data.graph ?? data })
  } catch {
    // Fallback graph data derived from ecosystem structure
    return NextResponse.json({
      live: false,
      graph: {
        nodes: [
          { id: 'finderauth', label: 'FinderAuth', group: 'foundation', x: 100, y: 200 },
          { id: 'db-manager', label: 'DB Manager', group: 'foundation', x: 100, y: 350 },
          { id: 'finder-starter', label: 'Finder Starter', group: 'core', x: 350, y: 100 },
          { id: 'admin-starter', label: 'Admin Starter', group: 'core', x: 350, y: 250 },
          { id: 'etd-starter', label: 'ETD Starter', group: 'core', x: 350, y: 400 },
          { id: 'ODYN-starter', label: 'ODYN Starter', group: 'extended', x: 600, y: 100 },
          { id: 'design-starter', label: 'Design Starter', group: 'extended', x: 600, y: 225 },
          { id: 'crowds', label: 'Crowds', group: 'extended', x: 600, y: 350 },
          { id: 'opensoftware-starter', label: 'OpenSoftware', group: 'extended', x: 600, y: 475 },
          { id: 'devtools-manager', label: 'DevTools Manager', group: 'meta', x: 850, y: 150 },
          { id: 'gitfinder-starter', label: 'GitFinder Starter', group: 'meta', x: 850, y: 300 },
          { id: 'feedback-starter', label: 'Feedback Starter', group: 'meta', x: 850, y: 450 },
        ],
        edges: [
          { from: 'finderauth', to: 'finder-starter' },
          { from: 'finderauth', to: 'admin-starter' },
          { from: 'finderauth', to: 'etd-starter' },
          { from: 'db-manager', to: 'finder-starter' },
          { from: 'db-manager', to: 'admin-starter' },
          { from: 'db-manager', to: 'crowds' },
          { from: 'finder-starter', to: 'ODYN-starter' },
          { from: 'finder-starter', to: 'design-starter' },
          { from: 'admin-starter', to: 'devtools-manager' },
          { from: 'etd-starter', to: 'opensoftware-starter' },
          { from: 'ODYN-starter', to: 'devtools-manager' },
          { from: 'design-starter', to: 'gitfinder-starter' },
          { from: 'crowds', to: 'feedback-starter' },
        ],
      },
    })
  }
}
