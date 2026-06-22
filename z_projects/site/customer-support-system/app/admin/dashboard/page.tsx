import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  BarChart,
  CreditCard,
  FileText,
  CloudSunIcon as SolarPanel,
  Users,
  TrendingUp,
  AlertCircle,
  Calendar,
} from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, Admin! Here's an overview of Akshat Udyam's operations.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" asChild>
            <Link href="/admin/invoices/new">
              <FileText className="mr-2 h-4 w-4" />
              Generate Invoice
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/reports">
              <BarChart className="mr-2 h-4 w-4" />
              View Reports
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          icon={<Users className="h-5 w-5 text-blue-500" />}
          title="Total Customers"
          value="1,245"
          description="↑ 12% from last month"
          trend="up"
        />
        <DashboardCard
          icon={<SolarPanel className="h-5 w-5 text-yellow-500" />}
          title="Active Installations"
          value="987"
          description="↑ 8% from last month"
          trend="up"
        />
        <DashboardCard
          icon={<FileText className="h-5 w-5 text-green-500" />}
          title="Support Tickets"
          value="24"
          description="↓ 5% from last month"
          trend="down"
        />
        <DashboardCard
          icon={<CreditCard className="h-5 w-5 text-purple-500" />}
          title="Monthly Revenue"
          value="₹24,50,000"
          description="↑ 15% from last month"
          trend="up"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="installations">Installations</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Revenue Chart</p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ActivityItem
                    title="New Installation"
                    description="Solar system installation completed for Sharma Residence"
                    timestamp="2 hours ago"
                  />
                  <ActivityItem
                    title="Invoice Generated"
                    description="Invoice #INV-2023-042 generated for ₹85,000"
                    timestamp="4 hours ago"
                  />
                  <ActivityItem
                    title="Support Ticket"
                    description="New support ticket #TKT-2023-018 opened"
                    timestamp="Yesterday"
                  />
                  <ActivityItem
                    title="Payment Received"
                    description="Payment of ₹1,25,000 received from Mehta Enterprises"
                    timestamp="Yesterday"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">INV-2023-041</p>
                      <p className="text-xs text-muted-foreground">Patel Residence</p>
                    </div>
                    <p className="text-sm font-medium">₹45,000</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">INV-2023-040</p>
                      <p className="text-xs text-muted-foreground">Green Valley Apartments</p>
                    </div>
                    <p className="text-sm font-medium">₹1,85,000</p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/admin/invoices" className="flex items-center justify-center">
                      View All
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Installations</CardTitle>
                <SolarPanel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Singh Residence</p>
                      <p className="text-xs text-muted-foreground">Scheduled: 15 May 2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Sunrise Apartments</p>
                      <p className="text-xs text-muted-foreground">Scheduled: 18 May 2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/admin/installations" className="flex items-center justify-center">
                      View Schedule
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Performance</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Average Generation</p>
                      <p className="text-xs text-muted-foreground">All systems</p>
                    </div>
                    <p className="text-sm font-medium">4.8 kWh/kWp</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">System Alerts</p>
                      <p className="text-xs text-muted-foreground">Last 24 hours</p>
                    </div>
                    <p className="text-sm font-medium">12</p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/admin/analytics" className="flex items-center justify-center">
                      View Analytics
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Overview</CardTitle>
              <CardDescription>Detailed view of customer data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Customer Analytics Dashboard</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="installations">
          <Card>
            <CardHeader>
              <CardTitle>Installation Overview</CardTitle>
              <CardDescription>Detailed view of installation data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Installation Analytics Dashboard</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Detailed view of revenue data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Revenue Analytics Dashboard</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DashboardCard({
  icon,
  title,
  value,
  description,
  trend = "neutral",
}: {
  icon: React.ReactNode
  title: string
  value: string
  description: string
  trend?: "up" | "down" | "neutral"
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
          } flex items-center mt-2`}
        >
          {trend === "up" ? (
            <TrendingUp className="mr-1 h-3 w-3" />
          ) : trend === "down" ? (
            <TrendingUp className="mr-1 h-3 w-3 rotate-180" />
          ) : null}
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function ActivityItem({
  title,
  description,
  timestamp,
}: {
  title: string
  description: string
  timestamp: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-md p-3 hover:bg-accent transition-colors">
      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
        {title.includes("Installation") ? (
          <SolarPanel className="h-4 w-4" />
        ) : title.includes("Invoice") ? (
          <FileText className="h-4 w-4" />
        ) : title.includes("Support") ? (
          <AlertCircle className="h-4 w-4" />
        ) : title.includes("Payment") ? (
          <CreditCard className="h-4 w-4" />
        ) : (
          <Calendar className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-xs text-muted-foreground">{timestamp}</div>
    </div>
  )
}
