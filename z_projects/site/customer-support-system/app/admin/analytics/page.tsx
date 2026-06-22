import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">View detailed analytics and performance metrics</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="installations">Installations</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹24,50,000</div>
                <p className="text-xs text-muted-foreground">↑ 15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground">↑ 12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Installations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">987</div>
                <p className="text-xs text-muted-foreground">↑ 8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">↓ 5% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <LineChart className="h-8 w-8 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Revenue Chart</p>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Sales Distribution</CardTitle>
                <CardDescription>Sales by product category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <PieChart className="h-8 w-8 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Sales Distribution Chart</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New customers over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <BarChart className="h-8 w-8 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Customer Growth Chart</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Installation Metrics</CardTitle>
                <CardDescription>Installation performance</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <BarChart className="h-8 w-8 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Installation Metrics Chart</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Support Performance</CardTitle>
                <CardDescription>Ticket resolution metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <LineChart className="h-8 w-8 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Support Performance Chart</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Detailed sales performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <BarChart className="h-8 w-8 text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">Sales Analytics Dashboard</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="installations">
          <Card>
            <CardHeader>
              <CardTitle>Installation Analytics</CardTitle>
              <CardDescription>Detailed installation performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <LineChart className="h-8 w-8 text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">Installation Analytics Dashboard</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>Detailed customer metrics and insights</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <PieChart className="h-8 w-8 text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">Customer Analytics Dashboard</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
