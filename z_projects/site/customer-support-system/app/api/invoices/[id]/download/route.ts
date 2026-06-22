import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const invoiceId = params.id

  try {
    // In a real implementation, this would generate a PDF based on invoice data
    // For this demo, we'll return a simple text file as a downloadable

    // Create a simple text content for the invoice
    const invoiceContent = `
    INVOICE #${invoiceId}
    ===============================
    
    Akshat Udyam IT Solutions Pvt. Ltd.
    
    Date: ${new Date().toLocaleDateString()}
    
    Customer: Sample Customer
    
    Items:
    - Solar Panel Installation: ₹45,000
    - Maintenance Package: ₹5,000
    - Consultation Fee: ₹2,500
    
    Subtotal: ₹52,500
    Tax (18%): ₹9,450
    
    Total: ₹61,950
    
    Thank you for your business!
    `

    // Create response with headers for file download
    return new NextResponse(invoiceContent, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="invoice-${invoiceId}.txt"`,
      },
    })
  } catch (error) {
    console.error("Error generating invoice:", error)
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
  }
}
