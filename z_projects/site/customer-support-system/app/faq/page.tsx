import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

export default function FAQPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Find answers to common questions about our services</p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search for answers..." className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Questions</CardTitle>
              <CardDescription>Basic information about our services</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What services do you offer?</AccordionTrigger>
                  <AccordionContent>
                    We offer a comprehensive suite of services including product support, technical assistance, billing
                    support, and account management. Our team is available 24/7 to help you with any questions or issues
                    you may have.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How can I contact customer support?</AccordionTrigger>
                  <AccordionContent>
                    You can contact our customer support team through multiple channels: by creating a support ticket,
                    using our live chat feature, or by calling our support hotline at 1-800-123-4567. Our support team
                    is available 24/7 to assist you.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What are your business hours?</AccordionTrigger>
                  <AccordionContent>
                    Our customer support team is available 24 hours a day, 7 days a week, including holidays. Technical
                    support is available from 6 AM to 10 PM Eastern Time, 7 days a week.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How quickly will I receive a response?</AccordionTrigger>
                  <AccordionContent>
                    For live chat, you can expect an immediate response during business hours. For support tickets, our
                    goal is to respond within 2 hours for high-priority issues and within 24 hours for standard issues.
                    Response times may vary based on the complexity of the issue and current support volume.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Do you offer support in languages other than English?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer support in multiple languages including Spanish, French, German, and Mandarin. When
                    creating a support ticket or starting a chat, you can select your preferred language from the
                    dropdown menu.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Questions</CardTitle>
              <CardDescription>Information about account management</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I create an account?</AccordionTrigger>
                  <AccordionContent>
                    To create an account, click on the "Create Account" button on our homepage or login page. You'll
                    need to provide your name, email address, and create a password. After submitting the form, you'll
                    receive a verification email to activate your account.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                  <AccordionContent>
                    If you've forgotten your password, click on the "Forgot Password" link on the login page. Enter the
                    email address associated with your account, and we'll send you a password reset link. Follow the
                    instructions in the email to create a new password.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How can I update my profile information?</AccordionTrigger>
                  <AccordionContent>
                    To update your profile information, log in to your account and navigate to the "Profile" section.
                    Here, you can edit your personal details, contact information, and notification preferences. Don't
                    forget to save your changes before leaving the page.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I have multiple users on one account?</AccordionTrigger>
                  <AccordionContent>
                    Yes, depending on your subscription plan, you can add multiple users to your account. To add users,
                    go to the "Settings" section and select "User Management." From there, you can invite new users and
                    set their permission levels.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I delete my account?</AccordionTrigger>
                  <AccordionContent>
                    To delete your account, go to the "Settings" section and select "Account Settings." At the bottom of
                    the page, you'll find the "Delete Account" option. Please note that account deletion is permanent
                    and will remove all your data from our system.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Questions</CardTitle>
              <CardDescription>Information about payments and subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept various payment methods including credit cards (Visa, MasterCard, American Express,
                    Discover), PayPal, Razorpay, and Stripe. For enterprise customers, we also offer invoice-based
                    payments with net-30 terms.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I update my payment information?</AccordionTrigger>
                  <AccordionContent>
                    To update your payment information, log in to your account and navigate to the "Billing" section.
                    Select "Payment Methods" and click on "Edit" next to the payment method you want to update. You can
                    also add new payment methods from this page.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How often will I be billed?</AccordionTrigger>
                  <AccordionContent>
                    Billing frequency depends on the subscription plan you've chosen. We offer monthly and annual
                    billing cycles. Monthly subscriptions are billed on the same day each month, while annual
                    subscriptions are billed once a year on the anniversary of your sign-up date.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I get a copy of my invoice?</AccordionTrigger>
                  <AccordionContent>
                    Invoices are automatically sent to your registered email address after each payment. You can also
                    access all your invoices by logging into your account and going to the "Billing" section. Select
                    "Billing History" to view and download your invoices.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>What happens if my payment fails?</AccordionTrigger>
                  <AccordionContent>
                    If your payment fails, we'll automatically retry the charge after 24 hours. You'll receive an email
                    notification about the failed payment with instructions on how to update your payment information.
                    If the payment continues to fail after multiple attempts, your account may be temporarily suspended
                    until the payment issue is resolved.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Questions</CardTitle>
              <CardDescription>Technical support and troubleshooting</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I install the mobile app?</AccordionTrigger>
                  <AccordionContent>
                    Our mobile app is available for both iOS and Android devices. For iOS, visit the App Store and
                    search for our app name. For Android, visit the Google Play Store. Once you find our app, tap
                    "Install" and follow the on-screen instructions to complete the installation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Why is the mobile app not working?</AccordionTrigger>
                  <AccordionContent>
                    If you're experiencing issues with the mobile app, try these troubleshooting steps: 1) Ensure you
                    have the latest version of the app installed. 2) Restart the app and your device. 3) Check your
                    internet connection. 4) Clear the app cache in your device settings. If the issue persists, please
                    contact our support team with details about the problem.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What browsers are supported?</AccordionTrigger>
                  <AccordionContent>
                    Our platform supports the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping
                    your browser updated to ensure the best experience and security. Internet Explorer is not supported.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I clear my browser cache?</AccordionTrigger>
                  <AccordionContent>
                    Clearing your browser cache varies by browser. In general, you can access the clear browsing data
                    option in your browser's settings or preferences menu. Select options to clear cache and cookies,
                    then restart your browser. This can help resolve many common browser-related issues.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we take data security very seriously. All data transmitted between your device and our servers
                    is encrypted using industry-standard SSL/TLS protocols. We implement multiple layers of security
                    measures, including firewalls, intrusion detection systems, and regular security audits. Your
                    personal information is stored in secure, encrypted databases with strict access controls.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
        <p className="text-muted-foreground mb-4">
          Our support team is here to help you with any questions you may have.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" className="sm:w-auto">
            Contact Support
          </Button>
          <Button className="sm:w-auto">Create Support Ticket</Button>
        </div>
      </div>
    </div>
  )
}
