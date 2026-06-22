import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PricingCTA() {
  return (
    <section className="max-w-4xl mx-auto mt-12 sm:mt-16 lg:mt-20 p-6 sm:p-8 lg:p-10 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm rounded-lg text-center border border-border mx-4 sm:mx-6 lg:mx-auto">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight text-foreground">Flexible Pricing for Every Need</h2>
      <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
        Start for free and upgrade as your productivity needs grow.
        Our plans are designed to scale with individuals, teams, and enterprises.
      </p>
      <Button size="lg" asChild className="w-full sm:w-auto">
        <Link href="/app/pricing">View Plans & Pricing</Link>
      </Button>
    </section>
  )
}
