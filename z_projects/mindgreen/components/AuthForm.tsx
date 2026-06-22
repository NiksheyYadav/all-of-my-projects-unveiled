'use client'

import { auth as getAuth } from '@/app/providers'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'

export default function AuthForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignup, setIsSignup] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const _auth = getAuth()
            if (!_auth) throw new Error('Auth not initialized')
            if (isSignup) {
                await createUserWithEmailAndPassword(_auth, email, password)
            } else {
                await signInWithEmailAndPassword(_auth, email, password)
            }
            // Redirect to dashboard
            window.location.href = '/dashboard'
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md">
            <div className="flex flex-col gap-3">
                <input
                    className="p-2 border rounded"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    className="p-2 border rounded"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" className="bg-green-600 text-white p-2 rounded">{isSignup ? 'Sign Up' : 'Log In'}</button>
                <button type="button" onClick={() => setIsSignup(!isSignup)} className="text-blue-600 underline">{isSignup ? 'Already have an account? Log In' : 'New? Sign Up'}</button>
            </div>
        </form>
    )
}
