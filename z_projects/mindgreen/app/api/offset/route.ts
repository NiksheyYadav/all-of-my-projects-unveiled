import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { points } = await req.json()
  // Prefer Greenframe or a mock if no API key is configured.
  const greenframeKey = process.env.GREENFRAME_API_KEY || process.env.NEXT_PUBLIC_GREENFRAME_API_KEY
  if (!greenframeKey) {
    // Return a mocked offset response for local/dev usage
    return NextResponse.json({ provider: 'mock', offset_tons: points / 100, status: 'queued' })
  }

  // Placeholder for a Greenframe integration. For now return mock until configured.
  return NextResponse.json({ provider: 'greenframe', offset_tons: points / 100, status: 'queued' })
}
