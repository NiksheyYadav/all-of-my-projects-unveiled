"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Download, FileText, Plus } from "lucide-react"
import { generateInvoicePdf } from "@/lib/payment-utils"

// Sample invoice data
const invoices = [
  {
    id: "INV-001",
    customer: "Rajesh Kumar",
    amount: 12500,
    status: "paid",
    date: "2023-04-15",
  },
  {
    id: "INV-002",
    customer: "Priya Sharma",
    amount: 8750,
    status: "pending",
    date: "2023-04-18",
  },
  {
    id: "INV-003",
    customer: "Amit Patel",
    amount: 15000,
    status: "paid",
    date: "2023-04-20",
  },
  {
    id: "INV-004",
    customer: "Sunita Verma",
    amount: 9200,
    status: "overdue",
    date: "2023-04-10",
  },
  {
    id: "INV-005",
    customer: "Vikram Singh",
    amount: 11800,
    status: "paid",
    date: "2023-04-22",
  },
]

export default function InvoicesPage() {
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDownload = async (invoiceId: string) => {
    setIsDownloading(invoiceId)
    try {
      const pdfUrl = await generateInvoicePdf(invoiceId)

      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = pdfUrl
      link.setAttribute("download", `invoice-${invoiceId}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download started",
        description: `Invoice ${invoiceId} is being downloaded.`,
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the invoice. Please try again.",
        variant: "destructive",
      })
      console.error("Error downloading invoice:", error)
    } finally {
      setIsDownloading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage customer invoices and payments</p>
        </div>
        <Button asChild>
          <Link href="/admin/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>View and manage all customer invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "paid"
                            ? "success"
                            : invoice.status === "pending"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDownload(invoice.id)}
                          disabled={isDownloading === invoice.id}
                        >
                          {isDownloading === invoice.id ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/admin/invoices/${invoice.id}`}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
