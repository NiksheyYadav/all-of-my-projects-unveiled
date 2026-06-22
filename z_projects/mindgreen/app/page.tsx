'use client'

import AuthForm from '@/components/AuthForm'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { auth as getAuth } from './providers'

export default function Home() {
    useEffect(() => {
        const _auth = getAuth()
        if (!_auth) return
        const unsubscribe = onAuthStateChanged(_auth, (user) => {
            if (user) window.location.href = '/dashboard'
        })
        return unsubscribe
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 mandala-bg">
            <h1 className="text-4xl font-bold text-green-800">MindGreen</h1>
            <p className="text-lg text-brown-600">Heal Yourself, Heal the Planet</p>
            <AuthForm />
        </main>
    )
}
