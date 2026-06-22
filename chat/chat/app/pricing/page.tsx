'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { loadRazorpayScript } from '@/lib/razorpay'
import { useUserStore } from '@/store/user'
import { motion } from 'framer-motion'
import { Check, Crown, Sparkles, Star, Zap } from 'lucide-react'
import { useState } from 'react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceInr: '₹0',
    icon: Sparkles,
    color: 'from-gray-600 to-gray-700',
    features: [
      '10 messages per day',
      'GPT-3.5 Turbo access',
      'Basic support',
      'Chat history',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 199,
    priceInr: '₹199',
    icon: Zap,
    color: 'from-blue-600 to-cyan-600',
    features: [
      '100 messages per day',
      'All models except GPT-4',
      'Email support',
      'Priority queue',
      'Export conversations',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 499,
    priceInr: '₹499',
    icon: Star,
    color: 'from-purple-600 to-pink-600',
    features: [
      '500 messages per day',
      'All models including GPT-4',
      'Priority support',
      'Advanced features',
      'API access',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 999,
    priceInr: '₹999',
    icon: Crown,
    color: 'from-yellow-600 to-orange-600',
    features: [
      'Unlimited messages',
      'All models + image generation',
      '24/7 priority support',
      'Early access to features',
      'Custom integrations',
    ],
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const { plan: currentPlan, updatePlan } = useUserStore()

  const handleSubscribe = async (planId: string, price: number) => {
    if (planId === 'free') {
      updatePlan('free')
      return
    }

    setLoading(planId)

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        alert('Failed to load Razorpay SDK')
        return
      }

      // Create order
      const orderResponse = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, amount: price * 100 }), // Convert to paise
      })

      const order = await orderResponse.json()

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'AI Chat',
        description: `${planId.toUpperCase()} Plan Subscription`,
        order_id: order.id,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch('/api/subscription/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
            }),
          })

          if (verifyResponse.ok) {
            updatePlan(planId as any)
            alert('Subscription successful!')
          } else {
            alert('Payment verification failed')
          }
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
        theme: {
          color: '#7c3aed',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to create subscription')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-white/60">
            Unlock the full potential of AI with our flexible pricing
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const isCurrentPlan = currentPlan === plan.id

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                
                <Card className={`h-full ${plan.popular ? 'border-purple-500' : ''}`}>
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>
                      <div className="text-4xl font-bold text-white mt-2">
                        {plan.priceInr}
                        <span className="text-lg text-white/50 font-normal">/month</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-white/70">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSubscribe(plan.id, plan.price)}
                      disabled={loading === plan.id || isCurrentPlan}
                      className="w-full"
                      variant={isCurrentPlan ? 'secondary' : 'default'}
                    >
                      {loading === plan.id ? (
                        'Processing...'
                      ) : isCurrentPlan ? (
                        'Current Plan'
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="text-white/60">
            All plans include access to our latest features and regular updates.
            <br />
            Cancel anytime, no questions asked.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
