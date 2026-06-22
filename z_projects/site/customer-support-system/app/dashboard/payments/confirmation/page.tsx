"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { recordTransaction, generateInvoicePdf, type PaymentGateway } from "@/lib/payment-utils"

export default function PaymentConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"success" | "failed" | "processing">("processing")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        // Get parameters from URL
        const paymentStatus = searchParams.get("status") || "success" // Default to success for demo
        const invoiceId = searchParams.get("invoice_id") || "INV-2023-003"
        const transactionId = searchParams.get("transaction_id") || `TXN-${Date.now()}`
        const gateway = (searchParams.get("gateway") || "razorpay") as PaymentGateway

        // Set the payment status
        setStatus(paymentStatus === "success" ? "success" : "failed")

        // Record the transaction
        await recordTransaction(
          gateway,
          {
            amount: 1200.0, // This would come from the actual invoice in a real app
            currency: "INR",
            description: "Monthly maintenance fee",
            invoiceId,
            customerName: "Rahul Sharma",
            customerEmail: "rahul@example.com",
            redirectUrl: window.location.href,
          },
          transactionId,
          paymentStatus === "success" ? "success" : "failed",
        )

        // Generate PDF receipt if payment was successful
        if (paymentStatus === "success") {
          const url = await generateInvoicePdf(invoiceId)
          setPdfUrl(url)
        }
      } catch (error) {
        console.error("Error processing payment result:", error)
        setStatus("failed")
      } finally {
        setIsLoading(false)
      }
    }

    processPaymentResult()
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">Processing your payment...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto my-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Payment {status === "success" ? "Successful" : "Failed"}</CardTitle>
          <CardDescription className="text-center">
            {status === "success"
              ? "Your payment has been processed successfully."
              : "There was an issue processing your payment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {status === "success" ? (
            <CheckCircle className="h-24 w-24 text-green-500 mb-4" />
          ) : (
            <XCircle className="h-24 w-24 text-red-500 mb-4" />
          )}

          <div className="text-center space-y-2">
            <p className="text-lg font-medium">
              {status === "success" ? "Thank you for your payment!" : "Payment was not completed"}
            </p>
            <p className="text-muted-foreground">
              {status === "success"
                ? "A receipt has been generated and sent to your email."
                : "Please try again or contact support if the issue persists."}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {status === "success" && pdfUrl && (
            <Button className="w-full" asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </a>
            </Button>
          )}

          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/payments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Payments
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
