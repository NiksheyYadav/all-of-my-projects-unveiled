// Payment gateway utility functions

export type PaymentGateway = "paypal" | "razorpay" | "stripe"

export interface PaymentDetails {
  amount: number
  currency: string
  description: string
  invoiceId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  redirectUrl: string
}

// Function to generate a payment URL for the selected gateway
export function getPaymentGatewayUrl(gateway: PaymentGateway, details: PaymentDetails): string {
  // In a real implementation, these would be proper URLs with query parameters
  // For demonstration purposes, we're using placeholder URLs
  switch (gateway) {
    case "paypal":
      return `https://www.paypal.com/checkoutnow?token=${encodeURIComponent(
        details.invoiceId,
      )}&amount=${details.amount}&currency=${details.currency}&description=${encodeURIComponent(
        details.description,
      )}&redirect=${encodeURIComponent(details.redirectUrl)}`

    case "razorpay":
      return `https://api.razorpay.com/v1/checkout/embedded?key_id=YOUR_KEY_ID&order_id=${encodeURIComponent(
        details.invoiceId,
      )}&amount=${details.amount * 100}&currency=${details.currency}&name=${encodeURIComponent(
        "Akshat Udyam",
      )}&description=${encodeURIComponent(details.description)}&prefill[name]=${encodeURIComponent(
        details.customerName,
      )}&prefill[email]=${encodeURIComponent(details.customerEmail)}&prefill[contact]=${encodeURIComponent(
        details.customerPhone || "",
      )}&callback_url=${encodeURIComponent(details.redirectUrl)}`

    case "stripe":
      return `https://checkout.stripe.com/pay/${encodeURIComponent(
        details.invoiceId,
      )}?amount=${details.amount * 100}&currency=${details.currency}&description=${encodeURIComponent(
        details.description,
      )}&client_reference_id=${encodeURIComponent(
        details.invoiceId,
      )}&customer_email=${encodeURIComponent(details.customerEmail)}&redirect_url=${encodeURIComponent(
        details.redirectUrl,
      )}`

    default:
      throw new Error(`Unsupported payment gateway: ${gateway}`)
  }
}

// Function to record a payment transaction
export async function recordTransaction(
  gateway: PaymentGateway,
  details: PaymentDetails,
  transactionId: string,
  status: "success" | "pending" | "failed",
): Promise<void> {
  // In a real implementation, this would save to a database
  console.log("Recording transaction:", {
    gateway,
    details,
    transactionId,
    status,
    timestamp: new Date().toISOString(),
  })

  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(resolve, 500)
  })
}

// Function to generate a PDF invoice
export async function generateInvoicePdf(invoiceId: string): Promise<string> {
  // In a real implementation, this would generate a PDF and return its URL
  console.log("Generating PDF for invoice:", invoiceId)

  // For demonstration purposes, we'll return a direct URL that would work in a browser
  // In a real app, this would be a server endpoint that generates and serves the PDF
  return `/api/invoices/${invoiceId}/download`
}
