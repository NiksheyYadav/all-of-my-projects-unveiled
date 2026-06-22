export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'INR',
    interval: 'month',
    features: [
      '10 messages per day',
      'GPT-3.5 Turbo only',
      'Basic support',
    ],
    limits: {
      messagesPerDay: 10,
      models: ['gpt-3.5-turbo'],
    },
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 199,
    currency: 'INR',
    interval: 'month',
    razorpayPlanId: process.env.RAZORPAY_PLAN_BASIC,
    features: [
      '100 messages per day',
      'All models except GPT-4',
      'Email support',
    ],
    limits: {
      messagesPerDay: 100,
      models: ['gpt-3.5-turbo', 'claude-3-haiku', 'llama-3-70b', 'mixtral-8x7b'],
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 499,
    currency: 'INR',
    interval: 'month',
    razorpayPlanId: process.env.RAZORPAY_PLAN_PRO,
    features: [
      '500 messages per day',
      'All models including GPT-4',
      'Priority support',
    ],
    limits: {
      messagesPerDay: 500,
      models: ['gpt-3.5-turbo', 'gpt-4', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'gemini-pro', 'llama-3-70b', 'mixtral-8x7b'],
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 999,
    currency: 'INR',
    interval: 'month',
    razorpayPlanId: process.env.RAZORPAY_PLAN_PREMIUM,
    features: [
      'Unlimited messages',
      'All models + image generation',
      'Priority support',
      'Early access to new features',
    ],
    limits: {
      messagesPerDay: Infinity,
      models: Object.keys(AI_MODELS),
    },
  },
} as const

export type PlanId = keyof typeof SUBSCRIPTION_PLANS

declare global {
  interface Window {
    Razorpay: any
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

import { AI_MODELS } from './openrouter'

