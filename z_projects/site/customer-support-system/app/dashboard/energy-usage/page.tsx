import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, TrendingDown, TrendingUp, Clock } from "lucide-react"

export default function EnergyUsagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Energy Usage</h2>
        <p className="text-muted-foreground">Monitor and analyze your energy consumption</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Usage</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Usage</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Usage</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.8 kW</div>
                <p className="text-xs text-muted-foreground">↓ 5% from average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Usage</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.4 kWh</div>
                <p className="text-xs text-muted-foreground">↓ 8% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grid Consumption</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2 kWh</div>
                <p className="text-xs text-muted-foreground">↓ 65% from pre-solar</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solar Utilization</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">↑ 5% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Energy Consumption</CardTitle>
                <CardDescription>Daily energy consumption for the current month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-muted-foreground">Energy Consumption Chart</div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Usage Breakdown</CardTitle>
                <CardDescription>Energy usage by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-muted-foreground">Usage Breakdown Chart</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Energy Usage</CardTitle>
              <CardDescription>Detailed view of your daily energy consumption</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-muted-foreground">Daily Energy Usage Chart</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Energy Usage</CardTitle>
              <CardDescription>Monthly energy consumption patterns</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-muted-foreground">Monthly Energy Usage Chart</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="savings">
          <Card>
            <CardHeader>
              <CardTitle>Energy Savings</CardTitle>
              <CardDescription>Financial and environmental impact of your solar system</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-muted-foreground">Energy Savings Details</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
