import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, FileX, Shield, User, Scan } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">MedVision AI</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Advanced Medical Imaging Analysis
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Leverage AI-powered diagnostics for MRI, CT, and X-ray analysis with state-of-the-art classification
                    and segmentation models.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="group">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-square rounded-lg overflow-hidden border shadow-xl bg-background/50 backdrop-blur">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 p-6">
                      <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-background/80 backdrop-blur shadow-sm">
                        <Brain className="h-8 w-8 text-primary" />
                        <h3 className="text-sm font-medium">MRI Analysis</h3>
                      </div>
                      <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-background/80 backdrop-blur shadow-sm">
                        <Scan className="h-8 w-8 text-primary" />
                        <h3 className="text-sm font-medium">CT Scan Analysis</h3>
                      </div>
                      <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-background/80 backdrop-blur shadow-sm">
                        <FileX className="h-8 w-8 text-primary" />
                        <h3 className="text-sm font-medium">X-Ray Analysis</h3>
                      </div>
                      <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-background/80 backdrop-blur shadow-sm">
                        <User className="h-8 w-8 text-primary" />
                        <h3 className="text-sm font-medium">Patient Portal</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers comprehensive tools for medical imaging analysis
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">MRI Classification</h3>
                <p className="text-muted-foreground text-center">
                  Advanced neural networks for accurate MRI classification and diagnosis assistance.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Scan className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">CT Scan Analysis</h3>
                <p className="text-muted-foreground text-center">
                  Detailed CT scan analysis for enhanced diagnostic capabilities.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <FileX className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">X-Ray Analysis</h3>
                <p className="text-muted-foreground text-center">
                  Fracture detection and segmentation for enhanced diagnostic capabilities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MedVision AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

