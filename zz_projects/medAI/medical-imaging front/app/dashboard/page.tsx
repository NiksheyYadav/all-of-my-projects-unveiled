"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { Brain, FileX, Scan, Calendar, Users, Clock, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    mri: 0,
    xray: 0,
    ct: 0,
    patients: 0,
    appointments: 0,
  })

  // Load stats from localStorage on mount
  useEffect(() => {
    const storedPredictions = localStorage.getItem("predictions")
    if (storedPredictions) {
      const parsedPredictions = JSON.parse(storedPredictions)

      // Update stats
      const total = parsedPredictions.length
      const mri = parsedPredictions.filter((p: any) => p.type === "MRI").length
      const xray = parsedPredictions.filter((p: any) => p.type === "XRAY").length
      const ct = parsedPredictions.filter((p: any) => p.type === "CT").length

      setStats({
        total,
        mri,
        xray,
        ct,
        patients: user?.role === "doctor" ? 24 : 0,
        appointments: 3,
      })
    }
  }, [user])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">
          {user?.role === "doctor"
            ? "Here's an overview of your medical imaging analysis and patient data."
            : "Here's an overview of your medical records and appointments."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {user?.role === "doctor" && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.patients}</div>
                <p className="text-xs text-muted-foreground">+4 new this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.appointments}</div>
                <p className="text-xs text-muted-foreground">Next: Today at 2:00 PM</p>
              </CardContent>
            </Card>
          </>
        )}

        {user?.role === "patient" && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">March 18, 2025</div>
                <p className="text-xs text-muted-foreground">Dr. Jane Smith - 10:30 AM</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Results</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Last updated: Today</p>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <FileX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Across all imaging types</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRI Scans</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mri}</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CT Scans</CardTitle>
            <Scan className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ct}</div>
            <p className="text-xs text-muted-foreground">+1 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">X-Ray Scans</CardTitle>
            <FileX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.xray}</div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild>
                <Link href="/dashboard/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Link>
              </Button>
              {user?.role === "doctor" ? (
                <Button asChild>
                  <Link href="/dashboard/patients">
                    <Users className="mr-2 h-4 w-4" />
                    View Patients
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/dashboard/appointments">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/dashboard/history">
                  <Clock className="mr-2 h-4 w-4" />
                  View History
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/settings">
                  <Users className="mr-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileX className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">X-Ray Analysis Completed</p>
                  <p className="text-xs text-muted-foreground">Today at 10:30 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">MRI Scan Uploaded</p>
                  <p className="text-xs text-muted-foreground">Yesterday at 2:15 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Appointment Scheduled</p>
                  <p className="text-xs text-muted-foreground">March 15, 2025 at 9:00 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

