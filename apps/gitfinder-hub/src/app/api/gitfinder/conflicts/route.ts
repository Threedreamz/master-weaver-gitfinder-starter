import { NextResponse } from 'next/server'
import { SAMPLE_CONFLICTS } from '../../../lib/sample-data'

export const dynamic = 'force-dynamic'

const CONTROL_PLANE_URL = process.env.CONTROL_PLANE_URL || 'https://devtools-control-plane-dev.up.railway.app'

export async function GET() {
  try {
    const res = await fetch(`${CONTROL_PLANE_URL}/api/gitfinder/conflicts`, {
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Control plane returned ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ live: true, conflicts: data.conflicts ?? data })
  } catch {
    return NextResponse.json({ live: false, conflicts: SAMPLE_CONFLICTS })
  }
}
