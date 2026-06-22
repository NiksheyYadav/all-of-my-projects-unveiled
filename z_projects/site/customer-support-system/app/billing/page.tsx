"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Download, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function BillingPage() {
  const [isAddingCard, setIsAddingCard] = useState(false)
  const { toast } = useToast()

  const handleAddCard = () => {
    setIsAddingCard(true)
    setTimeout(() => {
      setIsAddingCard(false)
      toast({
        title: "Payment method added",
        description: "Your new payment method has been added successfully.",
      })
    }, 1500)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Manage your payment methods and view billing history</p>
      </div>

      <Tabs defaultValue="payment-methods" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="billing-history">Billing History</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods for billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <PaymentMethodCard type="Visa" last4="4242" expiry="04/2026" isDefault />
                <PaymentMethodCard type="PayPal" email="john@example.com" isDefault={false} />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription>Add a new credit card or payment method to your account.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="payment-type">Payment Type</Label>
                        <Select defaultValue="credit-card">
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit-card">Credit Card</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="razorpay">Razorpay</SelectItem>
                            <SelectItem value="stripe">Stripe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name on Card</Label>
                        <Input id="name" placeholder="John Doe" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="default" className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor="default">Set as default payment method</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCard} disabled={isAddingCard}>
                        {isAddingCard ? "Adding..." : "Add Payment Method"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing-history">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV-001</TableCell>
                    <TableCell>Apr 23, 2025</TableCell>
                    <TableCell>$49.99</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Paid
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV-002</TableCell>
                    <TableCell>Mar 23, 2025</TableCell>
                    <TableCell>$49.99</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Paid
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV-003</TableCell>
                    <TableCell>Feb 23, 2025</TableCell>
                    <TableCell>$49.99</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Paid
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV-004</TableCell>
                    <TableCell>Jan 23, 2025</TableCell>
                    <TableCell>$49.99</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Paid
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Manage your subscription and billing cycle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Premium Plan</h3>
                    <p className="text-muted-foreground">$49.99/month, billed monthly</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4 text-green-500"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Unlimited support tickets
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4 text-green-500"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Priority support response
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4 text-green-500"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        24/7 live chat access
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4 text-green-500"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Advanced reporting
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2 justify-center">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline" className="text-red-500 hover:text-red-600">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Billing Cycle</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="monthly" name="billing-cycle" className="h-4 w-4" defaultChecked />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="annually" name="billing-cycle" className="h-4 w-4" />
                    <Label htmlFor="annually">
                      Annually <span className="text-green-600 font-medium">(Save 20%)</span>
                    </Label>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Your next billing date is May 23, 2025</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PaymentMethodCard({
  type,
  last4,
  expiry,
  email,
  isDefault,
}: {
  type: string
  last4?: string
  expiry?: string
  email?: string
  isDefault: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">
              {type} {last4 ? `ending in ${last4}` : ""}
            </p>
            {isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
          </div>
          <p className="text-sm text-muted-foreground">{expiry ? `Expires ${expiry}` : email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">
          Edit
        </Button>
        {!isDefault && (
          <Button variant="ghost" size="sm">
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}
