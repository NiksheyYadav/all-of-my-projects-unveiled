"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Download, ShoppingCartIcon as PaypalIcon } from "lucide-react"
import { getPaymentGatewayUrl, type PaymentGateway, type PaymentDetails } from "@/lib/payment-utils"
import ErrorBoundary from "@/components/error-boundary"

// Custom icons for payment methods
function RazorpayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.5 3L4.5 18H14.5L22.5 3H12.5Z"
        fill="#072654"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StripeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="#635BFF"
      />
      <path
        d="M7 15L17 9M9.5 11.5C9.5 12.3284 8.82843 13 8 13C7.17157 13 6.5 12.3284 6.5 11.5C6.5 10.6716 7.17157 10 8 10C8.82843 10 9.5 10.6716 9.5 11.5ZM17.5 13.5C17.5 14.3284 16.8284 15 16 15C15.1716 15 14.5 14.3284 14.5 13.5C14.5 12.6716 15.1716 12 16 12C16.8284 12 17.5 12.6716 17.5 13.5Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function PaymentsPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("razorpay")
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Mock invoice data
  const pendingInvoices = [
    {
      id: "INV-2023-003",
      date: "Jun 01, 2023",
      amount: 1200.0,
      dueDate: "Jun 15, 2023",
      description: "Monthly maintenance fee",
    },
    {
      id: "INV-2023-004",
      date: "Jun 05, 2023",
      amount: 3500.0,
      dueDate: "Jun 20, 2023",
      description: "Solar panel cleaning and inspection",
    },
  ]

  const handleInitiatePayment = (invoiceId: string) => {
    setSelectedInvoice(invoiceId)
    setPaymentDialogOpen(true)
  }

  const handlePayment = () => {
    setIsProcessing(true)

    // Find the selected invoice
    const invoice = pendingInvoices.find((inv) => inv.id === selectedInvoice)

    if (!invoice) {
      toast({
        title: "Error",
        description: "Invoice not found",
        variant: "destructive",
      })
      setIsProcessing(false)
      return
    }

    // Prepare payment details
    const paymentDetails: PaymentDetails = {
      amount: invoice.amount,
      currency: "INR",
      description: invoice.description,
      invoiceId: invoice.id,
      customerName: "Rahul Sharma",
      customerEmail: "rahul@example.com",
      customerPhone: "+919876543210",
      redirectUrl: `${window.location.origin}/dashboard/payments/confirmation`,
    }

    try {
      // Get the payment gateway URL
      const gatewayUrl = getPaymentGatewayUrl(selectedGateway, paymentDetails)

      // In a real implementation, we would record the payment attempt here

      // Redirect to the payment gateway
      setTimeout(() => {
        setIsProcessing(false)
        setPaymentDialogOpen(false)

        // Show a toast before redirecting
        toast({
          title: "Redirecting to payment gateway",
          description: `You will be redirected to ${selectedGateway} to complete your payment.`,
        })

        // Simulate redirect (in a real app, we would actually redirect)
        setTimeout(() => {
          window.open(gatewayUrl, "_blank")
        }, 1500)
      }, 1000)
    } catch (error) {
      console.error("Payment error:", error)
      setIsProcessing(false)
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">Manage your payments and view transaction history</p>
        </div>

        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="pending">Pending Payments</TabsTrigger>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all your past transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">TXN-2023-001</TableCell>
                      <TableCell>Apr 15, 2023</TableCell>
                      <TableCell>₹12,500.00</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                          Completed
                        </span>
                      </TableCell>
                      <TableCell>Credit Card (ending in 4242)</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">TXN-2023-002</TableCell>
                      <TableCell>May 15, 2023</TableCell>
                      <TableCell>₹1,200.00</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                          Completed
                        </span>
                      </TableCell>
                      <TableCell>UPI (rahul@upi)</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Payments</CardTitle>
                <CardDescription>Invoices that require payment</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>₹{invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            className="bg-yellow-500 hover:bg-yellow-600 text-black"
                            onClick={() => handleInitiatePayment(invoice.id)}
                          >
                            Pay Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 04/2025</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">UPI - rahul@upi</p>
                        <p className="text-sm text-muted-foreground">Default payment method</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Add Payment Method</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Make a Payment</DialogTitle>
            <DialogDescription>Choose your preferred payment method to complete the transaction.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Invoice Details</Label>
              <div className="rounded-md border p-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Invoice ID:</span>
                  <span className="text-sm">{selectedInvoice}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm font-medium">Amount:</span>
                  <span className="text-sm">
                    ₹{pendingInvoices.find((inv) => inv.id === selectedInvoice)?.amount.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm font-medium">Description:</span>
                  <span className="text-sm">
                    {pendingInvoices.find((inv) => inv.id === selectedInvoice)?.description || ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Gateway</Label>
              <RadioGroup
                value={selectedGateway}
                onValueChange={(value) => setSelectedGateway(value as PaymentGateway)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="flex items-center cursor-pointer">
                    <RazorpayIcon />
                    <span className="ml-2">Razorpay</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                    <PaypalIcon className="h-5 w-5 text-[#003087]" />
                    <span className="ml-2">PayPal</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex items-center cursor-pointer">
                    <StripeIcon />
                    <span className="ml-2">Stripe</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You will be redirected to the selected payment gateway to complete your payment securely. After payment,
                you will be redirected back to this site.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  )
}
