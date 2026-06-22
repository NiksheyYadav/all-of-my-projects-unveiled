import { ethers } from 'ethers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { address, amount } = await req.json()
  const rpc = process.env.NEXT_PUBLIC_POLYGON_RPC_URL || process.env.POLYGON_RPC_URL
  const pk = process.env.PRIVATE_KEY || process.env.WALLET_PRIVATE_KEY
  if (!pk) return NextResponse.json({ error: 'Missing server private key' }, { status: 500 })
  if (!rpc) return NextResponse.json({ error: 'Missing RPC URL' }, { status: 500 })

  const provider = new ethers.JsonRpcProvider(rpc)
  const wallet = new ethers.Wallet(pk, provider)
  const tx = await wallet.sendTransaction({
    to: address,
    value: ethers.parseEther(amount.toString()),
  })
  return NextResponse.json({ txHash: tx.hash })
}
