// Razorpay integration utilities
declare global {
  interface Window {
    Razorpay: any
  }
}

export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'INR',
    features: ['GPT-3.5 access', '5 messages/day', 'Basic support'],
    limits: { messages: 5, models: ['openai/gpt-3.5-turbo'] }
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 199,
    currency: 'INR',
    razorpayPlanId: 'plan_basic_monthly',
    features: ['All models', '100 messages/day', 'Priority support'],
    limits: { messages: 100, models: 'all' }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 499,
    currency: 'INR',
    razorpayPlanId: 'plan_pro_monthly',
    features: ['All models', 'Unlimited messages', 'Priority support', 'API access'],
    limits: { messages: -1, models: 'all' }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 999,
    currency: 'INR',
    razorpayPlanId: 'plan_premium_monthly',
    features: ['All models', 'Unlimited messages', '24/7 support', 'API access', 'Custom models'],
    limits: { messages: -1, models: 'all' }
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}