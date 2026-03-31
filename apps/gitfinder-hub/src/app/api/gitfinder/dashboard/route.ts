import { NextResponse } from 'next/server'
import { SAMPLE_STATS, SAMPLE_ACTIVITY } from '../../../lib/sample-data'

export const dynamic = 'force-dynamic'

const CONTROL_PLANE_URL = process.env.CONTROL_PLANE_URL || 'https://devtools-control-plane-dev.up.railway.app'

export async function GET() {
  try {
    const res = await fetch(`${CONTROL_PLANE_URL}/api/gitfinder/dashboard`, {
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Control plane returned ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ live: true, stats: data.stats ?? data, activity: data.activity ?? [] })
  } catch {
    return NextResponse.json({ live: false, stats: SAMPLE_STATS, activity: SAMPLE_ACTIVITY })
  }
}
