import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Shield,
  CloudSunIcon as SolarPanel,
  Star,
  Zap,
} from "lucide-react"
import Link from "next/link"
import type React from "react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 py-3 px-4 text-center text-sm font-medium text-black">
        <span className="inline-block animate-pulse rounded-full bg-white px-2 py-1 text-xs font-semibold mr-2">
          NEW
        </span>
        Government Subsidy for Solar Services Now Available!{" "}
        <Link
          href="/subsidy-info"
          className="font-bold underline underline-offset-2 ml-1 hover:text-zinc-800 transition-colors"
        >
          Learn More <ChevronRight className="inline h-3 w-3" />
        </Link>
      </div>

      {/* Navigation */}
      <header className="bg-zinc-900 text-white sticky top-0 z-50 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <SolarPanel className="h-7 w-7 text-yellow-400" />
            <span>Akshat Udyam</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium border-b-2 border-yellow-400 py-1 transition-colors hover:text-yellow-400"
            >
              HOME
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium py-1 transition-colors hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400"
            >
              ABOUT
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium py-1 transition-colors hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400"
            >
              SERVICES
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium py-1 transition-colors hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400"
            >
              PRODUCTS
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium py-1 transition-colors hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400"
            >
              BLOG
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium py-1 transition-colors hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400"
            >
              CONTACT
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-yellow-400 hover:text-black transition-colors"
              asChild
            >
              <Link href="/login">Customer Login</Link>
            </Button>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-yellow-400 hover:text-black transition-colors"
              asChild
            >
              <Link href="/admin/login">Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-zinc-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://www.kloecknermetals.com/wp-content/uploads/2023/01/Website-Images-1.png')" }}
        ></div>
        <div className="container mx-auto px-4 py-32 relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Powering India's <span className="text-yellow-400">Sustainable</span> Future
            </h1>
            <div className="w-24 h-1 bg-yellow-400 mb-8 mx-auto"></div>
            <p className="text-xl mb-10 text-zinc-200 leading-relaxed">
              AUITS is a leader in sustainable solar energy solutions since 2013. Specializing in efficient solar
              systems, we provide seamless services for residential, commercial, and industrial applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-8 py-6 rounded-full"
                size="lg"
                asChild
              >
                <Link href="/get-started">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white hover:bg-white hover:text-black transition-colors px-8 py-6 rounded-full"
                size="lg"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-900 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-zinc-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold text-yellow-400 mb-2">10+</div>
              <div className="text-sm uppercase tracking-wider">Years Experience</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-yellow-400 mb-2">1,200+</div>
              <div className="text-sm uppercase tracking-wider">Installations</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-yellow-400 mb-2">98%</div>
              <div className="text-sm uppercase tracking-wider">Customer Satisfaction</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-yellow-400 mb-2">15MW+</div>
              <div className="text-sm uppercase tracking-wider">Power Generated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Solar Solutions</h2>
            <div className="w-16 h-1 bg-yellow-400 mb-6 mx-auto"></div>
            <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
              Discover how our solar energy solutions can help you save money and contribute to a sustainable future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<SolarPanel className="h-12 w-12 text-yellow-500" />}
              title="Solar Installations"
              description="Professional installation of high-efficiency solar panels for homes and businesses with 25-year warranty."
            />
            <FeatureCard
              icon={<Zap className="h-12 w-12 text-yellow-500" />}
              title="Energy Efficiency"
              description="Maximize your energy savings with our advanced solar technology and smart systems that adapt to your needs."
            />
            <FeatureCard
              icon={<Shield className="h-12 w-12 text-yellow-500" />}
              title="Maintenance & Support"
              description="Comprehensive maintenance plans and dedicated 24/7 customer support for all your solar needs."
            />
          </div>

          <div className="mt-16 text-center">
            <Button
              variant="outline"
              className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-colors rounded-full px-8 py-6"
              size="lg"
              asChild
            >
              <Link href="/services" className="flex items-center">
                View All Services <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Akshat Udyam?</h2>
              <div className="w-16 h-1 bg-yellow-400 mb-8"></div>
              <p className="text-zinc-600 mb-8 text-lg">
                With over a decade of experience in the solar industry, we've established ourselves as a trusted partner
                for sustainable energy solutions across India.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">Quality Assurance</h3>
                    <p className="text-zinc-600">
                      We use only the highest quality solar panels and components with industry-leading warranties.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">Expert Team</h3>
                    <p className="text-zinc-600">
                      Our team of certified professionals ensures flawless installation and ongoing support.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">Customized Solutions</h3>
                    <p className="text-zinc-600">
                      We design solar systems tailored to your specific energy needs and property requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">Government Subsidy Assistance</h3>
                    <p className="text-zinc-600">
                      We help you navigate and apply for all available government subsidies and incentives.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img src="data:image/jpeg;base64,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" alt="Solar installation" className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-yellow-400 rounded-lg p-6 shadow-xl">
                <div className="text-3xl font-bold">30%</div>
                <div className="text-sm font-medium">Average Energy Bill Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <div className="w-16 h-1 bg-yellow-400 mb-6 mx-auto"></div>
            <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
              Don't just take our word for it. Here's what our satisfied customers have to say about our services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Rajesh Sharma"
              role="Homeowner, Pune"
              quote="The team at Akshat Udyam made the entire process seamless. From consultation to installation, everything was handled professionally. My electricity bills have reduced by 40%!"
              rating={5}
            />
            <TestimonialCard
              name="Priya Mehta"
              role="Business Owner, Mumbai"
              quote="Installing solar panels through Akshat Udyam was the best decision for our business. The ROI has been impressive, and their after-sales service is exceptional."
              rating={5}
            />
            <TestimonialCard
              name="Amit Patel"
              role="Apartment Complex Manager, Ahmedabad"
              quote="Managing a large residential complex, we needed a reliable solar solution. Akshat Udyam delivered a custom system that has significantly reduced our maintenance costs."
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-amber-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Switch to Solar?</h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have reduced their energy bills and carbon footprint with our
            solar solutions. Get a free consultation today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-8 py-6" size="lg" asChild>
              <Link href="/contact">Get Free Consultation</Link>
            </Button>
            <Button
              variant="outline"
              className="border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors rounded-full px-8 py-6"
              size="lg"
              asChild
            >
              <Link href="/calculator">Solar Savings Calculator</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <SolarPanel className="h-8 w-8 text-yellow-400" />
                <span className="text-2xl font-bold">Akshat Udyam</span>
              </Link>
              <p className="text-zinc-400 mb-6">
                A leader in sustainable solar energy solutions since 2013, providing seamless services for residential,
                commercial, and industrial applications.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-yellow-400 transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-yellow-400 transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-yellow-400 transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-yellow-400 transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Our Services</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/services/residential" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    Residential Solar
                  </Link>
                </li>
                <li>
                  <Link href="/services/commercial" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    Commercial Solar
                  </Link>
                </li>
                <li>
                  <Link href="/services/industrial" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    Industrial Solar
                  </Link>
                </li>
                <li>
                  <Link href="/services/maintenance" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    Maintenance & Support
                  </Link>
                </li>
                <li>
                  <Link href="/services/consulting" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    Energy Consulting
                  </Link>
                </li>
                <li>
                  <Link href="/services/subsidy" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    Subsidy Assistance
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <span className="text-zinc-400">
                    123 Solar Street
                    <br />
                    Pune, Maharashtra
                    <br />
                    India
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <a href="tel:+911234567890" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    +91 1234567890
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <a href="mailto:info@auitspl.com" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                    info@auitspl.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-zinc-400">
            <p>&copy; {new Date().getFullYear()} Akshat Udyam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-xl border border-zinc-100 hover:shadow-xl transition-shadow group">
      <div className="mb-6 bg-yellow-50 p-4 rounded-lg inline-block group-hover:bg-yellow-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-zinc-600">{description}</p>
      <div className="mt-6">
        <Link
          href="#"
          className="text-yellow-500 font-medium flex items-center hover:text-yellow-600 transition-colors"
        >
          Learn more <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

function TestimonialCard({ name, role, quote, rating }: { name: string; role: string; quote: string; rating: number }) {
  return (
    <div className="bg-white p-8 rounded-xl border border-zinc-100 hover:shadow-xl transition-shadow">
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400" : "text-zinc-200"}`} />
        ))}
      </div>
      <p className="text-zinc-600 mb-6 italic">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-bold">{name}</div>
          <div className="text-sm text-zinc-500">{role}</div>
        </div>
      </div>
    </div>
  )
}
