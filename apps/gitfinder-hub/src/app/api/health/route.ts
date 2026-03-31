import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({ status: 'ok', app: 'gitfinder-hub', timestamp: new Date().toISOString() })
}
