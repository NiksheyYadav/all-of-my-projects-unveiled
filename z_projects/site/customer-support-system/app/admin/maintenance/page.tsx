import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Plus, Calendar } from "lucide-react"
import Link from "next/link"

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Maintenance</h2>
          <p className="text-muted-foreground">Schedule and manage maintenance activities</p>
        </div>
        <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Maintenance
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
          <CardDescription>Upcoming and past maintenance activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search maintenance..." className="pl-10" />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar View
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Maintenance ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">MAINT-2023-001</TableCell>
                  <TableCell>Rahul Sharma</TableCell>
                  <TableCell>Panel Cleaning</TableCell>
                  <TableCell>Pune, Maharashtra</TableCell>
                  <TableCell>May 15, 2023</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                      Completed
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/admin/maintenance/1">View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">MAINT-2023-002</TableCell>
                  <TableCell>Priya Patel</TableCell>
                  <TableCell>System Inspection</TableCell>
                  <TableCell>Mumbai, Maharashtra</TableCell>
                  <TableCell>May 20, 2023</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800">
                      In Progress
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/admin/maintenance/2">View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">MAINT-2023-003</TableCell>
                  <TableCell>Amit Singh</TableCell>
                  <TableCell>Inverter Maintenance</TableCell>
                  <TableCell>Bangalore, Karnataka</TableCell>
                  <TableCell>Jun 10, 2023</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                      Scheduled
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/admin/maintenance/3">View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
