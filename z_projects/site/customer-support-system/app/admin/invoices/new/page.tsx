"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, Plus, Trash } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function NewInvoicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0, amount: 0 }])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)) // 14 days from now
  const router = useRouter()
  const { toast } = useToast()

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.rate, 0)
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items]

    if (field === "quantity" || field === "rate") {
      const numValue = typeof value === "string" ? Number.parseFloat(value) || 0 : value
      newItems[index][field as "quantity" | "rate"] = numValue
      newItems[index].amount = newItems[index].quantity * newItems[index].rate
    } else {
      newItems[index][field as "description"] = value as string
    }

    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items]
      newItems.splice(index, 1)
      setItems(newItems)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate invoice creation
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Invoice created",
        description: "The invoice has been created successfully.",
      })
      router.push("/admin/invoices")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Generate New Invoice</h2>
        <p className="text-muted-foreground">Create a new invoice for a customer</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Select the customer for this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select required>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sharma">Sharma Residence</SelectItem>
                    <SelectItem value="patel">Patel Residence</SelectItem>
                    <SelectItem value="green-valley">Green Valley Apartments</SelectItem>
                    <SelectItem value="kumar">Kumar Industries</SelectItem>
                    <SelectItem value="mehta">Mehta Enterprises</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-date">Invoice Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
              <CardDescription>Add items to this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <Label htmlFor={`item-${index}-description`} className="sr-only">
                      Description
                    </Label>
                    <Input
                      id={`item-${index}-description`}
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-${index}-quantity`} className="sr-only">
                      Quantity
                    </Label>
                    <Input
                      id={`item-${index}-quantity`}
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-${index}-rate`} className="sr-only">
                      Rate
                    </Label>
                    <Input
                      id={`item-${index}-rate`}
                      type="number"
                      min="0"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-${index}-amount`} className="sr-only">
                      Amount
                    </Label>
                    <Input id={`item-${index}-amount`} value={`₹${(item.quantity * item.rate).toFixed(2)}`} disabled />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addItem} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-end border-t p-4">
              <div className="space-y-2 text-right">
                <div className="flex justify-between w-48">
                  <span>Subtotal:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48">
                  <span>GST (18%):</span>
                  <span>₹{(calculateTotal() * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-48 font-bold">
                  <span>Total:</span>
                  <span>₹{(calculateTotal() * 1.18).toFixed(2)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Add notes or payment instructions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes or payment instructions..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-terms">Payment Terms</Label>
                <Select defaultValue="14days">
                  <SelectTrigger id="payment-terms">
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                    <SelectItem value="7days">Net 7 Days</SelectItem>
                    <SelectItem value="14days">Net 14 Days</SelectItem>
                    <SelectItem value="30days">Net 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-zinc-800 hover:bg-zinc-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Creating Invoice..." : "Create Invoice"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
