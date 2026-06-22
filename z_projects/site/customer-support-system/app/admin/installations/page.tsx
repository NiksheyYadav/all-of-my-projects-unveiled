import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import Link from "next/link"

export default function InstallationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Installations</h2>
          <p className="text-muted-foreground">Manage solar system installations and schedules</p>
        </div>
        <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Installation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Installations</CardTitle>
          <CardDescription>A list of all solar system installations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search installations..." className="pl-10" />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Installation ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>System Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INST-2023-001</TableCell>
                  <TableCell>Rahul Sharma</TableCell>
                  <TableCell>Pune, Maharashtra</TableCell>
                  <TableCell>5 kW</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                      Completed
                    </div>
                  </TableCell>
                  <TableCell>Apr 15, 2023</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/admin/installations/1">View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INST-2023-002</TableCell>
                  <TableCell>Priya Patel</TableCell>
                  <TableCell>Mumbai, Maharashtra</TableCell>
                  <TableCell>3 kW</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800">
                      In Progress
                    </div>
                  </TableCell>
                  <TableCell>May 20, 2023</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/admin/installations/2">View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INST-2023-003</TableCell>
                  <TableCell>Amit Singh</TableCell>
                  <TableCell>Bangalore, Karnataka</TableCell>
                  <TableCell>10 kW</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                      Scheduled
                    </div>
                  </TableCell>
                  <TableCell>Jun 10, 2023</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/admin/installations/3">View</Link>
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
