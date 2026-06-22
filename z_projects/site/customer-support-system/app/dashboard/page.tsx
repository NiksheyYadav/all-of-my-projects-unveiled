import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, Battery, CreditCard, FileText, CloudSunIcon as SolarPanel, Sun, Zap } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, Rahul! Here's an overview of your solar system performance.
          </p>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" asChild>
          <Link href="/dashboard/support">Contact Support</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          icon={<Sun className="h-5 w-5 text-yellow-500" />}
          title="Total Generation"
          value="1,245 kWh"
          description="This month"
        />
        <DashboardCard
          icon={<Zap className="h-5 w-5 text-yellow-500" />}
          title="Current Output"
          value="4.8 kW"
          description="As of now"
        />
        <DashboardCard
          icon={<Battery className="h-5 w-5 text-yellow-500" />}
          title="Battery Status"
          value="85%"
          description="Estimated 12 hrs backup"
        />
        <DashboardCard
          icon={<CreditCard className="h-5 w-5 text-yellow-500" />}
          title="Savings"
          value="₹8,750"
          description="This month"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="generation">Generation</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Energy Production</CardTitle>
                <CardDescription>Daily solar energy generation for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Energy Production Chart</p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current status of your solar installation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">Solar Panels</span>
                    </div>
                    <span className="text-sm">Operational</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">Inverter</span>
                    </div>
                    <span className="text-sm">Operational</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">Battery</span>
                    </div>
                    <span className="text-sm">Charging (85%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">Grid Connection</span>
                    </div>
                    <span className="text-sm">Connected</span>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/solar-systems">View System Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Invoices</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">INV-001</p>
                      <p className="text-xs text-muted-foreground">Apr 2023</p>
                    </div>
                    <p className="text-sm font-medium">₹12,500</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">INV-002</p>
                      <p className="text-xs text-muted-foreground">May 2023</p>
                    </div>
                    <p className="text-sm font-medium">₹1,200</p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/dashboard/invoices" className="flex items-center justify-center">
                      View All
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Maintenance Schedule</CardTitle>
                <SolarPanel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Panel Cleaning</p>
                      <p className="text-xs text-muted-foreground">Scheduled: 15 May 2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">System Inspection</p>
                      <p className="text-xs text-muted-foreground">Scheduled: 30 Jun 2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/dashboard/maintenance" className="flex items-center justify-center">
                      View Schedule
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">TKT-2023-042</p>
                      <p className="text-xs text-muted-foreground">Inverter Error - In Progress</p>
                    </div>
                    <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">In Progress</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">TKT-2023-039</p>
                      <p className="text-xs text-muted-foreground">Battery Inquiry - Resolved</p>
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Resolved</div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/dashboard/support" className="flex items-center justify-center">
                      View All Tickets
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="generation">
          <Card>
            <CardHeader>
              <CardTitle>Energy Generation</CardTitle>
              <CardDescription>Detailed view of your solar energy production</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Detailed Energy Generation Chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="consumption">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption</CardTitle>
              <CardDescription>Detailed view of your energy usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Detailed Energy Consumption Chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Overview</CardTitle>
              <CardDescription>Summary of your billing and payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Billing and Payment History Chart</p>
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
}: {
  icon: React.ReactNode
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
