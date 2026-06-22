"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PredictionHistory } from "@/components/prediction-history"
import { FileText, Download, Eye } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export default function HistoryPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("imaging")
  const [predictions, setPredictions] = useState<any[]>([])

  // Load predictions from localStorage on mount
  useEffect(() => {
    const storedPredictions = localStorage.getItem("predictions")
    if (storedPredictions) {
      const parsedPredictions = JSON.parse(storedPredictions)
      setPredictions(parsedPredictions)
    }
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Mock medical history data
  const labResults = [
    {
      id: "lab-1",
      date: "2025-03-01",
      type: "Complete Blood Count",
      result: "Normal",
      doctor: "Dr. Jane Smith",
    },
    {
      id: "lab-2",
      date: "2025-02-15",
      type: "Lipid Panel",
      result: "Abnormal",
      doctor: "Dr. Jane Smith",
    },
    {
      id: "lab-3",
      date: "2025-01-20",
      type: "Urinalysis",
      result: "Normal",
      doctor: "Dr. Jane Smith",
    },
  ]

  const medications = [
    {
      id: "med-1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2024-12-01",
      endDate: null,
    },
    {
      id: "med-2",
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      startDate: "2024-11-15",
      endDate: null,
    },
    {
      id: "med-3",
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      startDate: "2024-10-10",
      endDate: "2024-10-20",
    },
  ]

  const appointments = [
    {
      id: "appt-1",
      date: "2025-04-15T10:30:00",
      doctor: "Dr. Jane Smith",
      department: "Radiology",
      reason: "Follow-up consultation",
      status: "Scheduled",
    },
    {
      id: "appt-2",
      date: "2025-03-01T14:00:00",
      doctor: "Dr. John Doe",
      department: "Cardiology",
      reason: "Annual checkup",
      status: "Completed",
    },
    {
      id: "appt-3",
      date: "2025-01-20T09:15:00",
      doctor: "Dr. Sarah Johnson",
      department: "Neurology",
      reason: "Initial consultation",
      status: "Completed",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Medical History</h1>
        <p className="text-muted-foreground">View your complete medical history and records</p>
      </div>

      <Tabs defaultValue="imaging" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="imaging">Imaging History</TabsTrigger>
          <TabsTrigger value="lab">Lab Results</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="appointments">Past Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="imaging" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Imaging Analysis History</CardTitle>
              <CardDescription>Your complete history of medical imaging analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <PredictionHistory predictions={predictions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Test Results</CardTitle>
              <CardDescription>Your laboratory test results and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Ordering Physician</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{formatDate(result.date)}</TableCell>
                      <TableCell>{result.type}</TableCell>
                      <TableCell>
                        <Badge variant={result.result === "Normal" ? "outline" : "secondary"}>{result.result}</Badge>
                      </TableCell>
                      <TableCell>{result.doctor}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Medication History</CardTitle>
              <CardDescription>Your current and past medications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((medication) => (
                    <TableRow key={medication.id}>
                      <TableCell className="font-medium">{medication.name}</TableCell>
                      <TableCell>{medication.dosage}</TableCell>
                      <TableCell>{medication.frequency}</TableCell>
                      <TableCell>{formatDate(medication.startDate)}</TableCell>
                      <TableCell>{medication.endDate ? formatDate(medication.endDate) : "Current"}</TableCell>
                      <TableCell>
                        <Badge variant={medication.endDate ? "outline" : "default"}>
                          {medication.endDate ? "Completed" : "Active"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
              <CardDescription>Your past medical appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {formatDate(appointment.date)}
                        <div className="text-xs text-muted-foreground">
                          {new Date(appointment.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.department}</TableCell>
                      <TableCell>{appointment.reason}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            appointment.status === "Scheduled"
                              ? "default"
                              : appointment.status === "Completed"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Notes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

