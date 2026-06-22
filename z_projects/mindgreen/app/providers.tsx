'use client'

import { getAuth as getClientAuth, getDb as getClientDb } from '@/lib/firebase'
import { ReactNode } from 'react'

// Export helper getters that are safe to call from client-side components
export function auth() {
  try {
    return getClientAuth()
  } catch (e) {
    return undefined
  }
}

export function db() {
  try {
    return getClientDb()
  } catch (e) {
    return undefined
  }
}

export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>
}
