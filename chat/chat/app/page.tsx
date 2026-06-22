import Features from '@/components/landing/Features'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import PricingCTA from '@/components/landing/PricingCTA'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center py-8">
        <div className="w-full">
          <Hero />
          <Features />
          <PricingCTA />
        </div>
      </div>
      <Footer />
    </main>
  )
}