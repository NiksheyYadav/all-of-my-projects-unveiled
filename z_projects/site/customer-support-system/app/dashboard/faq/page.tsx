import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">Find answers to common questions about our solar products and services</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search for answers..." className="pl-10" />
      </div>

      <Tabs defaultValue="solar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="solar">Solar Systems</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
          <TabsTrigger value="subsidy">Government Subsidies</TabsTrigger>
        </TabsList>

        <TabsContent value="solar">
          <Card>
            <CardHeader>
              <CardTitle>Solar System Questions</CardTitle>
              <CardDescription>Information about our solar panel systems</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What types of solar panels does Akshat Udyam offer?</AccordionTrigger>
                  <AccordionContent>
                    Akshat Udyam offers a range of high-efficiency solar panels including monocrystalline,
                    polycrystalline, and thin-film options. Our most popular panels are monocrystalline with efficiency
                    ratings of 20-22%, which are ideal for residential and commercial installations where space may be
                    limited. We also offer bifacial panels that can capture sunlight from both sides, increasing energy
                    production.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How much energy will my solar system generate?</AccordionTrigger>
                  <AccordionContent>
                    The energy generation of your solar system depends on several factors including the system size,
                    panel efficiency, geographical location, roof orientation, shading, and local weather patterns. On
                    average, a 1kW solar system in India can generate approximately 4-5 units (kWh) of electricity per
                    day, or about 1,400-1,800 units annually. During your consultation, our engineers will provide a
                    detailed estimate based on your specific circumstances.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    What is the difference between on-grid, off-grid, and hybrid solar systems?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      <strong>On-grid systems:</strong> Connected to the utility grid, allowing you to export excess
                      power and receive credits (net metering). These systems shut down during power outages for safety
                      reasons.
                    </p>
                    <p>
                      <strong>Off-grid systems:</strong> Completely independent of the utility grid and include battery
                      storage to provide power when the sun isn't shining. Ideal for remote locations without grid
                      access.
                    </p>
                    <p>
                      <strong>Hybrid systems:</strong> Connected to the grid but also include battery storage, offering
                      the best of both worlds. You can store excess energy for use during outages or peak rate periods.
                    </p>
                    <p>
                      Akshat Udyam offers all three types of systems, and our experts can help you determine which is
                      best for your needs.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How long do solar panels last?</AccordionTrigger>
                  <AccordionContent>
                    The solar panels we install are designed to last 25-30 years or more. We provide a 25-year
                    performance warranty on all our panels, guaranteeing that they will produce at least 80% of their
                    rated output after 25 years. The inverters typically have a warranty of 5-10 years, though they may
                    last longer. Our installation workmanship is guaranteed for 5 years.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I expand my solar system in the future?</AccordionTrigger>
                  <AccordionContent>
                    Yes, most solar systems can be expanded in the future. When designing your initial system, our
                    engineers can plan for potential expansion by selecting appropriate inverters and leaving space for
                    additional panels. However, there may be limitations based on your roof space, electrical panel
                    capacity, and utility regulations. If you anticipate increasing your energy needs in the future,
                    please discuss this with our team during the consultation phase.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installation">
          <Card>
            <CardHeader>
              <CardTitle>Installation Questions</CardTitle>
              <CardDescription>Information about the solar installation process</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How long does the installation process take?</AccordionTrigger>
                  <AccordionContent>
                    The installation timeline varies depending on the system size and complexity. For residential
                    installations, the actual mounting of panels and equipment typically takes 1-3 days. However, the
                    complete process including site assessment, design, permitting, and final grid connection can take
                    2-4 weeks. Commercial installations may take longer. Our team will provide you with a specific
                    timeline during your consultation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What is the installation process?</AccordionTrigger>
                  <AccordionContent>
                    <p>Our installation process follows these steps:</p>
                    <ol className="list-decimal pl-5 space-y-1 mt-2">
                      <li>Initial consultation and site assessment</li>
                      <li>Custom system design and proposal</li>
                      <li>Contract signing and permitting</li>
                      <li>Equipment procurement</li>
                      <li>Installation of mounting hardware, panels, inverters, and electrical components</li>
                      <li>System testing and commissioning</li>
                      <li>Final inspection and grid connection (for grid-tied systems)</li>
                      <li>Customer training on system monitoring and maintenance</li>
                    </ol>
                    <p className="mt-2">
                      Throughout this process, our project manager will keep you informed and answer any questions you
                      may have.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Do I need to make any modifications to my home before installation?
                  </AccordionTrigger>
                  <AccordionContent>
                    In most cases, no major modifications are needed before solar installation. However, if your roof is
                    older or in poor condition, we may recommend roof repairs or replacement before installing solar
                    panels. Similarly, if your electrical panel is outdated or at capacity, an upgrade might be
                    necessary. Our site assessment will identify any such requirements, and we'll discuss them with you
                    before proceeding.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Will the installation damage my roof?</AccordionTrigger>
                  <AccordionContent>
                    Our installation teams are trained to install solar systems without damaging your roof. We use
                    industry-standard mounting systems that securely attach to your roof's structural elements. All roof
                    penetrations are properly sealed and waterproofed to prevent leaks. In fact, solar panels can
                    actually protect the portion of roof they cover from weather and UV exposure, potentially extending
                    its life. We provide a 5-year workmanship warranty that covers any installation-related issues,
                    including roof damage.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>What permits and approvals are needed for solar installation?</AccordionTrigger>
                  <AccordionContent>
                    In India, several permits and approvals may be required for solar installation, including:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Net metering application with your local DISCOM (for grid-tied systems)</li>
                      <li>Building permits from local municipal authorities</li>
                      <li>NOC (No Objection Certificate) from your housing society or RWA, if applicable</li>
                      <li>Structural stability certificate for rooftop installations</li>
                    </ul>
                    <p className="mt-2">
                      Akshat Udyam handles all permitting and paperwork on your behalf as part of our turnkey service,
                      making the process hassle-free for you.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Questions</CardTitle>
              <CardDescription>Information about maintaining your solar system</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How often does my solar system need maintenance?</AccordionTrigger>
                  <AccordionContent>
                    Solar systems are generally low-maintenance, but we recommend:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Panel cleaning: 3-4 times per year (more frequently in dusty areas)</li>
                      <li>Visual inspection: Once every 6 months</li>
                      <li>Comprehensive system check: Annually</li>
                      <li>Inverter maintenance: As recommended by the manufacturer</li>
                    </ul>
                    <p className="mt-2">
                      Akshat Udyam offers maintenance packages that include regular cleaning, inspection, and
                      performance monitoring to ensure your system operates at peak efficiency.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I clean my solar panels?</AccordionTrigger>
                  <AccordionContent>
                    If you choose to clean your panels yourself:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Clean early morning or evening when panels are cool</li>
                      <li>Use soft water (deionized if possible) and a soft brush or sponge</li>
                      <li>Avoid harsh chemicals, abrasive materials, or pressure washers</li>
                      <li>Never walk on panels or apply excessive pressure</li>
                    </ul>
                    <p className="mt-2">
                      For safety and optimal results, we recommend using our professional cleaning service, which is
                      included in our maintenance packages.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What should I do if my solar system isn't producing as expected?</AccordionTrigger>
                  <AccordionContent>
                    If you notice a significant drop in energy production:
                    <ol className="list-decimal pl-5 space-y-1 mt-2">
                      <li>Check if panels are dirty or shaded</li>
                      <li>Verify that the inverter is on and showing normal operation</li>
                      <li>Review your monitoring app for error messages</li>
                      <li>Check if there have been recent weather changes (cloudy days will reduce production)</li>
                    </ol>
                    <p className="mt-2">
                      If you can't identify the issue, contact our support team at support@auitspl.com or call our
                      service hotline. Our monitoring system may already have detected the issue, and our technicians
                      can often diagnose problems remotely.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>What maintenance packages does Akshat Udyam offer?</AccordionTrigger>
                  <AccordionContent>
                    We offer three maintenance packages:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>
                        <strong>Basic:</strong> Quarterly panel cleaning, annual inspection, and performance monitoring
                      </li>
                      <li>
                        <strong>Standard:</strong> Bi-monthly panel cleaning, semi-annual inspection, performance
                        monitoring, and priority support
                      </li>
                      <li>
                        <strong>Premium:</strong> Monthly panel cleaning, quarterly inspection, continuous performance
                        monitoring, priority support, and extended warranty options
                      </li>
                    </ul>
                    <p className="mt-2">
                      All packages include performance monitoring through our customer portal. You can view your
                      maintenance schedule and history in the dashboard.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How long do inverters last and when should they be replaced?</AccordionTrigger>
                  <AccordionContent>
                    Inverters typically have a lifespan of 10-15 years, shorter than the 25+ years for solar panels.
                    Signs that an inverter may need replacement include:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Frequent error messages or shutdowns</li>
                      <li>Significant decrease in energy production not related to weather or panel issues</li>
                      <li>Unusual noises or physical damage</li>
                      <li>Age beyond warranty period with declining performance</li>
                    </ul>
                    <p className="mt-2">
                      Our maintenance team monitors inverter performance and will recommend replacement when necessary.
                      Upgrading to newer inverter technology can often improve system efficiency and add modern
                      features.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Payment Questions</CardTitle>
              <CardDescription>Information about billing, payments, and financing</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    Akshat Udyam accepts multiple payment methods for your convenience:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Credit and debit cards (Visa, MasterCard, American Express, RuPay)</li>
                      <li>UPI payments (Google Pay, PhonePe, Paytm)</li>
                      <li>Net banking</li>
                      <li>NEFT/RTGS transfers</li>
                      <li>Cheques (for certain payment amounts)</li>
                    </ul>
                    <p className="mt-2">
                      All payments can be made securely through our customer portal or directly to our authorized
                      representatives.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What financing options are available for solar installation?</AccordionTrigger>
                  <AccordionContent>
                    We offer several financing options to make solar accessible:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>
                        <strong>Solar loans:</strong> We've partnered with leading banks to offer solar-specific loans
                        with competitive interest rates and terms up to 7 years
                      </li>
                      <li>
                        <strong>EMI options:</strong> 0% interest EMI plans available for up to 12 months with select
                        credit cards
                      </li>
                      <li>
                        <strong>CAPEX model:</strong> One-time payment with maximum savings over the system lifetime
                      </li>
                      <li>
                        <strong>RESCO/PPA model:</strong> For commercial customers, with no upfront cost and payment
                        based on energy consumed
                      </li>
                    </ul>
                    <p className="mt-2">
                      Our financial advisors can help you determine which option best suits your needs and calculate
                      your return on investment.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How is billing handled for maintenance services?</AccordionTrigger>
                  <AccordionContent>
                    Maintenance services are billed according to your selected package:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Annual maintenance packages are billed yearly, with options to pay quarterly or monthly</li>
                      <li>One-time services (like repairs outside warranty) are billed after service completion</li>
                      <li>For customers under warranty, covered services are provided at no additional cost</li>
                    </ul>
                    <p className="mt-2">
                      All maintenance charges appear in your customer portal, where you can view service history,
                      upcoming scheduled maintenance, and make payments.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>What is the payment schedule for solar installation?</AccordionTrigger>
                  <AccordionContent>
                    Our standard payment schedule for installations is:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>10% booking amount at contract signing</li>
                      <li>60% before equipment delivery</li>
                      <li>25% after installation completion</li>
                      <li>5% after final commissioning and grid connection</li>
                    </ul>
                    <p className="mt-2">
                      For customers using financing options, the schedule will align with your loan disbursement. We
                      also offer flexible payment terms for large commercial projects.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I access my invoices and payment history?</AccordionTrigger>
                  <AccordionContent>
                    All your financial records are available in the customer portal:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Log in to your account at portal.auitspl.com</li>
                      <li>Navigate to the "Payments" section</li>
                      <li>View, download, or print invoices and receipts</li>
                      <li>Track payment history and upcoming payments</li>
                    </ul>
                    <p className="mt-2">
                      Invoices are also sent to your registered email address. If you need assistance accessing your
                      records, our support team is available to help.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subsidy">
          <Card>
            <CardHeader>
              <CardTitle>Government Subsidy Questions</CardTitle>
              <CardDescription>Information about available solar subsidies and incentives</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What government subsidies are available for solar installation?</AccordionTrigger>
                  <AccordionContent>
                    The Indian government offers several subsidies for solar adoption:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>
                        <strong>Residential subsidy:</strong> Up to 40% subsidy on solar system costs for systems up to
                        3kW, and 20% for systems between 3kW and 10kW under the PM-KUSUM and National Solar Mission
                      </li>
                      <li>
                        <strong>Net metering benefits:</strong> Credit for excess power generated and exported to the
                        grid
                      </li>
                      <li>
                        <strong>Accelerated depreciation:</strong> For commercial and industrial customers, allowing 40%
                        depreciation on solar assets
                      </li>
                      <li>
                        <strong>State-specific incentives:</strong> Additional subsidies and benefits vary by state
                      </li>
                    </ul>
                    <p className="mt-2">
                      Subsidy amounts and eligibility criteria are subject to change based on government policies. Our
                      team stays updated with the latest regulations to maximize your benefits.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I apply for solar subsidies?</AccordionTrigger>
                  <AccordionContent>
                    Akshat Udyam handles the entire subsidy application process for you:
                    <ol className="list-decimal pl-5 space-y-1 mt-2">
                      <li>During system design, we assess your eligibility for various subsidies</li>
                      <li>We prepare and submit all required documentation to the relevant authorities</li>
                      <li>We track the application status and follow up as needed</li>
                      <li>
                        Once approved, the subsidy amount is either deducted from your system cost or reimbursed to you,
                        depending on the specific program
                      </li>
                    </ol>
                    <p className="mt-2">
                      You'll need to provide some basic documentation like identity proof, address proof, and
                      electricity bills. Our team will guide you through the specific requirements.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How long does it take to receive the subsidy?</AccordionTrigger>
                  <AccordionContent>
                    The subsidy processing timeline varies:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Initial approval: 4-8 weeks after application submission</li>
                      <li>Subsidy disbursement: 2-3 months after system installation and inspection</li>
                    </ul>
                    <p className="mt-2">
                      These timelines can vary based on government processing speeds and the specific subsidy program.
                      Akshat Udyam offers flexible payment options that account for expected subsidy timelines, so you
                      don't have to pay the full amount upfront in most cases.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Am I eligible for solar subsidies?</AccordionTrigger>
                  <AccordionContent>
                    Eligibility for solar subsidies typically depends on:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Type of property (residential, commercial, industrial, institutional)</li>
                      <li>System size and capacity</li>
                      <li>Connection type (on-grid, off-grid, hybrid)</li>
                      <li>Location (state and local jurisdiction)</li>
                      <li>Whether the building is newly constructed or existing</li>
                    </ul>
                    <p className="mt-2">
                      Residential customers with grid-connected systems typically have the highest eligibility for
                      subsidies. During your consultation, we'll assess your specific situation and provide detailed
                      information about the subsidies you qualify for.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>What documents are required for subsidy application?</AccordionTrigger>
                  <AccordionContent>
                    Common documents required for subsidy applications include:
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Identity proof (Aadhaar card, PAN card)</li>
                      <li>Address proof</li>
                      <li>Property ownership documents</li>
                      <li>Recent electricity bills</li>
                      <li>Photographs of installation site (before installation)</li>
                      <li>Bank account details for subsidy disbursement</li>
                      <li>Technical specifications of the solar system</li>
                    </ul>
                    <p className="mt-2">
                      Additional documents may be required based on specific program requirements. Our team will provide
                      a comprehensive checklist and assist you in preparing all necessary paperwork.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
        <p className="text-muted-foreground mb-4">
          Our support team is here to help you with any questions you may have.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/support">Contact Support</Link>
          </Button>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" asChild>
            <Link href="/dashboard/support/new">Create Support Ticket</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
