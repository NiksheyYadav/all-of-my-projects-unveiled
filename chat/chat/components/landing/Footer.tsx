import AppStoreBadges from '@/components/landing/AppStoreBadges'

export default function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 lg:mt-20 py-8 sm:py-12 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-foreground">FlowMind</h3>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              AI-powered productivity tool that enhances workflow efficiency through intelligent automation.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-foreground">Product</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><a href="/app/features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="/app/pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-foreground">Resources</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-foreground">Download App</h4>
            <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Experience FlowMind on the go with our mobile app.
            </p>
            <AppStoreBadges size="small" showLabel={false} />
          </div>
        </div>
        
        <div className="border-t border-border mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          <p className="text-muted-foreground text-xs sm:text-sm">
            © {new Date().getFullYear()} FlowMind. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
            <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
