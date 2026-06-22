import { getApps, initializeApp } from 'firebase/app'
import { getAuth as firebaseGetAuth } from 'firebase/auth'
import { getFirestore as firebaseGetFirestore } from 'firebase/firestore'

// Log env vars in dev to debug configuration
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase config:', {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  })
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function ensureInitialized() {
  // Only initialize in the browser/runtime where window is defined
  if (typeof window === 'undefined') return
  if (!getApps().length) {
    try {
      initializeApp(firebaseConfig)
    } catch (e) {
      // swallow - init may fail in some environments when envs are missing
      // callers should handle absence of a valid auth/db
      // eslint-disable-next-line no-console
      console.warn('Firebase init failed or skipped:', e)
    }
  }
}

export function getAuth() {
  ensureInitialized()
  // If initialization failed or was skipped (missing envs), avoid throwing by returning undefined
  if (!getApps().length) return undefined
  return firebaseGetAuth()
}

export function getDb() {
  ensureInitialized()
  if (!getApps().length) return undefined
  return firebaseGetFirestore()
}
