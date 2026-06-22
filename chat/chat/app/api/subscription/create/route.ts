import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    const { planId, amount } = await req.json()

    const order = await razorpay.orders.create({
      amount, // amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        planId,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
