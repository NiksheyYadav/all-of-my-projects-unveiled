import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { text } = await req.json()
  // Use Hugging Face Inference API via fetch
  const hfKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY
  if (!hfKey) return NextResponse.json({ task: 'Journaling' })

  const resp = await fetch('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${hfKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  })
  const result = await resp.json()
  const label = Array.isArray(result) && result[0]?.label ? result[0].label : 'POSITIVE'
  const task = label.toUpperCase().includes('NEGATIVE') ? 'Breathing exercise' : 'Journaling'
  return NextResponse.json({ task })
}
