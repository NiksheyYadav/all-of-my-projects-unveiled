'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStore {
  userId: string | null
  email: string | null
  name: string | null
  plan: 'free' | 'basic' | 'pro' | 'premium'
  messagesUsedToday: number
  
  setUser: (user: { id: string; email: string; name: string | null; plan: 'free' | 'basic' | 'pro' | 'premium' }) => void
  incrementMessageCount: () => void
  resetDailyUsage: () => void
  updatePlan: (plan: 'free' | 'basic' | 'pro' | 'premium') => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      email: null,
      name: null,
      plan: 'free',
      messagesUsedToday: 0,

      setUser: (user) => {
        set({
          userId: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
        })
      },

      incrementMessageCount: () => {
        set((state) => ({
          messagesUsedToday: state.messagesUsedToday + 1,
        }))
      },

      resetDailyUsage: () => {
        set({ messagesUsedToday: 0 })
      },

      updatePlan: (plan) => {
        set({ plan })
      },

      clearUser: () => {
        set({
          userId: null,
          email: null,
          name: null,
          plan: 'free',
          messagesUsedToday: 0,
        })
      },
    }),
    {
      name: 'user-storage',
    }
  )
)
