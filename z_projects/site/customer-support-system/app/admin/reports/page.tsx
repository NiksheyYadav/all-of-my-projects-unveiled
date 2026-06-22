"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, FileText, BarChart } from "lucide-react"

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Generate and view transaction reports</p>
        </div>
        <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transaction Reports</TabsTrigger>
          <TabsTrigger value="invoices">Invoice Reports</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Reports</CardTitle>
              <CardDescription>View and filter transaction data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="space-y-2 flex-1">
                  <span className="text-sm font-medium">Start Date</span>
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
                <div className="space-y-2 flex-1">
                  <span className="text-sm font-medium">End Date</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Payment Gateway</span>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Gateways</SelectItem>
                      <SelectItem value="razorpay">Razorpay</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Status</span>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Apply Filters</Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Gateway</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">TXN-2023-001</TableCell>
                      <TableCell>Jun 10, 2023</TableCell>
                      <TableCell>Rahul Sharma</TableCell>
                      <TableCell>INV-2023-003</TableCell>
                      <TableCell>₹1,200.00</TableCell>
                      <TableCell>Razorpay</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                          Success
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">TXN-2023-002</TableCell>
                      <TableCell>Jun 08, 2023</TableCell>
                      <TableCell>Priya Patel</TableCell>
                      <TableCell>INV-2023-002</TableCell>
                      <TableCell>₹3,500.00</TableCell>
                      <TableCell>PayPal</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                          Success
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">TXN-2023-003</TableCell>
                      <TableCell>Jun 05, 2023</TableCell>
                      <TableCell>Amit Singh</TableCell>
                      <TableCell>INV-2023-001</TableCell>
                      <TableCell>₹2,800.00</TableCell>
                      <TableCell>Stripe</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">TXN-2023-004</TableCell>
                      <TableCell>Jun 02, 2023</TableCell>
                      <TableCell>Neha Gupta</TableCell>
                      <TableCell>INV-2023-000</TableCell>
                      <TableCell>₹5,000.00</TableCell>
                      <TableCell>Razorpay</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
                          Failed
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Reports</CardTitle>
              <CardDescription>View and analyze invoice data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Invoice Report Dashboard</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Analyze revenue trends and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹12,50,000</div>
                      <p className="text-xs text-muted-foreground">↑ 12% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹3,200</div>
                      <p className="text-xs text-muted-foreground">↑ 5% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">98.5%</div>
                      <p className="text-xs text-muted-foreground">↑ 1.2% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground ml-2">Revenue Trend Chart</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Payment Gateway Distribution</p>
                  </div>
                  <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Monthly Revenue Comparison</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
