"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Calendar, Clock, Eye, FileText, Heart, LogOut, MessageSquare, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PatientPortalPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
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

  const getResultBadgeVariant = (result: string) => {
    switch (result.toLowerCase()) {
      case "normal":
        return "outline"
      case "abnormal":
        return "secondary"
      case "tumor":
      case "mass":
      case "fracture":
        return "destructive"
      default:
        return "default"
    }
  }

  // Mock patient data
  const patientData = {
    name: "John Doe",
    id: "P-12345",
    dob: "1985-06-15",
    gender: "Male",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    insurance: "HealthPlus Insurance",
    policyNumber: "HP-987654321",
    primaryDoctor: "Dr. Jane Smith",
    upcomingAppointment: {
      date: "2025-04-01T10:30:00",
      doctor: "Dr. Jane Smith",
      department: "Radiology",
      reason: "Follow-up consultation",
    },
    vitals: {
      bloodPressure: "120/80",
      heartRate: "72",
      temperature: "98.6",
      respiratoryRate: "16",
      oxygenSaturation: "98%",
      lastUpdated: "2025-03-10",
    },
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold">MedVision Patient Portal</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Link>
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="Patient" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="flex flex-col items-center mb-4">
                  <Avatar className="h-20 w-20 mb-2">
                    <AvatarImage src="/placeholder-user.jpg" alt="Patient" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-base">{patientData.name}</h3>
                  <p className="text-muted-foreground">ID: {patientData.id}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date of Birth:</span>
                    <span>{formatDate(patientData.dob)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender:</span>
                    <span>{patientData.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Primary Doctor:</span>
                    <span>{patientData.primaryDoctor}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Appointment</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{formatDate(patientData.upcomingAppointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>
                      {new Date(patientData.upcomingAppointment.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span>{patientData.upcomingAppointment.doctor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>{patientData.upcomingAppointment.department}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Reason for visit:</p>
                    <p>{patientData.upcomingAppointment.reason}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline" className="w-full">
                  Reschedule
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Records
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Activity className="mr-2 h-4 w-4" />
                    Vitals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="results">Test Results</TabsTrigger>
                <TabsTrigger value="images">Medical Images</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Health Summary</CardTitle>
                    <CardDescription>Your recent health information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Latest Vitals</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Blood Pressure:</span>
                            <span>{patientData.vitals.bloodPressure}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Heart Rate:</span>
                            <span>{patientData.vitals.heartRate} bpm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Temperature:</span>
                            <span>{patientData.vitals.temperature}°F</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Respiratory Rate:</span>
                            <span>{patientData.vitals.respiratoryRate} breaths/min</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Oxygen Saturation:</span>
                            <span>{patientData.vitals.oxygenSaturation}</span>
                          </div>
                          <div className="pt-1 text-xs text-muted-foreground">
                            Last updated: {formatDate(patientData.vitals.lastUpdated)}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Activity className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Medical Imaging Analysis</p>
                              <p className="text-xs text-muted-foreground">{formatDate(new Date().toISOString())}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Doctor's Appointment</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Lab Results Received</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Medical Images</CardTitle>
                    <CardDescription>Your recent imaging studies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {predictions.length > 0 ? (
                      <div className="space-y-4">
                        {predictions.slice(0, 3).map((prediction) => (
                          <div key={prediction.id} className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-4">
                              <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                                <img
                                  src={prediction.imageUrl || "/placeholder.svg?height=64&width=64"}
                                  alt={`${prediction.type} scan`}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">
                                  {prediction.type} - {prediction.category}
                                </h4>
                                <p className="text-xs text-muted-foreground">{formatDate(prediction.date)}</p>
                                <Badge variant={getResultBadgeVariant(prediction.result)} className="mt-1">
                                  {prediction.result}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/analysis/result?id=${prediction.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                          </div>
                        ))}

                        <div className="text-center pt-2">
                          <Button variant="link" size="sm" onClick={() => setActiveTab("images")}>
                            View all medical images
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>No medical images available.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Results</CardTitle>
                    <CardDescription>Your laboratory and diagnostic test results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Test Type</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString())}
                          </TableCell>
                          <TableCell>Complete Blood Count</TableCell>
                          <TableCell>Normal</TableCell>
                          <TableCell>
                            <Badge variant="outline">Completed</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            {formatDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString())}
                          </TableCell>
                          <TableCell>Lipid Panel</TableCell>
                          <TableCell>Abnormal</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Reviewed</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            {formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())}
                          </TableCell>
                          <TableCell>Urinalysis</TableCell>
                          <TableCell>Normal</TableCell>
                          <TableCell>
                            <Badge variant="outline">Completed</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Images</CardTitle>
                    <CardDescription>Your imaging studies and analysis results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {predictions.length > 0 ? (
                      <div className="space-y-4">
                        {predictions.map((prediction) => (
                          <div
                            key={prediction.id}
                            className="flex items-center justify-between border-b pb-4 last:border-0"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                                <img
                                  src={prediction.imageUrl || "/placeholder.svg?height=80&width=80"}
                                  alt={`${prediction.type} scan`}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">
                                  {prediction.type} - {prediction.category}
                                </h4>
                                <p className="text-xs text-muted-foreground">{formatDate(prediction.date)}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={getResultBadgeVariant(prediction.result)}>{prediction.result}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/analysis/result?id=${prediction.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm">
                                <FileText className="mr-2 h-4 w-4" />
                                Report
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>No medical images available.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={patientData.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={patientData.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue={patientData.phone} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue={patientData.address} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="insurance">Insurance Provider</Label>
                        <Input id="insurance" defaultValue={patientData.insurance} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policyNumber">Policy Number</Label>
                        <Input id="policyNumber" defaultValue={patientData.policyNumber} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Change Password</Label>
                      <Input id="password" type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Update Password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

