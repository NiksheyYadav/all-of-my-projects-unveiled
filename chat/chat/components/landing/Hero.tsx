"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import AppStoreBadges from '@/components/landing/AppStoreBadges'

export default function Hero() {
  return (
    <section className="bg-background/5 backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-10 lg:p-12 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-foreground">FlowMind - AI-Powered Productivity</h1>
          <p className="text-base sm:text-lg md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">Enhance your workflow efficiency with intelligent task automation and real-time collaboration. Available on Android with seamless cross-platform synchronization.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/app/chat">Get Started Free</Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
              <Link href="/app/pricing">View Pricing</Link>
            </Button>
          </div>
          
          <AppStoreBadges size="medium" showLabel={true} />
        </div>
        
        <div className="w-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-4 sm:p-6">
          <div className="h-40 sm:h-48 md:h-56 lg:h-64 bg-background/20 rounded-lg flex items-center justify-center text-muted-foreground">
            <div className="text-center px-4">
              <p className="font-medium text-sm sm:text-base">FlowMind Dashboard Preview</p>
              <p className="text-xs sm:text-sm mt-2">Experience intelligent task automation and real-time collaboration</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
