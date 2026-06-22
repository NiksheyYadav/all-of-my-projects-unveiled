"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, User, CalendarPlus2Icon as CalendarIcon2, X, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth/auth-provider"

export default function AppointmentsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    department: "",
    doctor: "",
    reason: "",
    notes: "",
  })

  // Mock appointment data
  const upcomingAppointments = [
    {
      id: "appt-1",
      date: new Date("2025-04-15T10:30:00"),
      doctor: "Dr. Jane Smith",
      department: "Radiology",
      location: "Main Hospital, Floor 3, Room 302",
      reason: "Follow-up consultation",
    },
    {
      id: "appt-2",
      date: new Date("2025-05-10T14:00:00"),
      doctor: "Dr. John Doe",
      department: "Cardiology",
      location: "Medical Center, Floor 2, Room 215",
      reason: "Annual checkup",
    },
  ]

  const pastAppointments = [
    {
      id: "past-1",
      date: new Date("2025-03-01T14:00:00"),
      doctor: "Dr. John Doe",
      department: "Cardiology",
      location: "Medical Center, Floor 2, Room 215",
      reason: "Annual checkup",
    },
    {
      id: "past-2",
      date: new Date("2025-01-20T09:15:00"),
      doctor: "Dr. Sarah Johnson",
      department: "Neurology",
      location: "Specialty Clinic, Floor 1, Room 105",
      reason: "Initial consultation",
    },
    {
      id: "past-3",
      date: new Date("2024-12-05T11:30:00"),
      doctor: "Dr. Jane Smith",
      department: "Radiology",
      location: "Main Hospital, Floor 3, Room 302",
      reason: "MRI scan",
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBookingForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setBookingForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleBookAppointment = async () => {
    if (!date || !bookingForm.department || !bookingForm.doctor || !bookingForm.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsBooking(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Appointment Booked",
        description: `Your appointment has been scheduled for ${format(date, "MMMM d, yyyy")} at ${format(date, "h:mm a")}.`,
      })

      // Reset form
      setDate(undefined)
      setBookingForm({
        department: "",
        doctor: "",
        reason: "",
        notes: "",
      })
      setActiveTab("upcoming")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
    }
  }

  const handleCancelAppointment = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">View and manage your medical appointments</p>
      </div>

      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="book">Book Appointment</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upcoming" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled medical appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-6">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col md:flex-row gap-4 border-b pb-6 last:border-0 last:pb-0"
                    >
                      <div className="md:w-1/4 flex flex-col items-center justify-center bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold">{format(appointment.date, "d")}</div>
                        <div className="text-lg">{format(appointment.date, "MMM")}</div>
                        <div className="text-sm text-muted-foreground mt-2">{format(appointment.date, "h:mm a")}</div>
                      </div>
                      <div className="md:w-3/4 space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">{appointment.department}</h3>
                          <p className="text-muted-foreground">{appointment.reason}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.doctor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Duration: 30 minutes</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline">Reschedule</Button>
                          <Button
                            variant="outline"
                            className="text-destructive"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No upcoming appointments.</p>
                  <Button className="mt-4" onClick={() => setActiveTab("book")}>
                    Book an Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
              <CardDescription>Your previous medical appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {pastAppointments.length > 0 ? (
                <div className="space-y-6">
                  {pastAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col md:flex-row gap-4 border-b pb-6 last:border-0 last:pb-0"
                    >
                      <div className="md:w-1/4 flex flex-col items-center justify-center bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold">{format(appointment.date, "d")}</div>
                        <div className="text-lg">{format(appointment.date, "MMM yyyy")}</div>
                        <div className="text-sm text-muted-foreground mt-2">{format(appointment.date, "h:mm a")}</div>
                      </div>
                      <div className="md:w-3/4 space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">{appointment.department}</h3>
                          <p className="text-muted-foreground">{appointment.reason}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.doctor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.location}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline">View Summary</Button>
                          <Button variant="outline">Book Follow-up</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No past appointments found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="book" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Book an Appointment</CardTitle>
              <CardDescription>Schedule a new medical appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Date and Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon2 className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP p") : "Select date and time"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) =>
                          date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                        }
                      />
                      {date && (
                        <div className="p-3 border-t">
                          <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Select
                              onValueChange={(value) =>
                                setDate(
                                  new Date(
                                    date.setHours(
                                      Number.parseInt(value.split(":")[0]),
                                      Number.parseInt(value.split(":")[1]),
                                    ),
                                  ),
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="09:00">9:00 AM</SelectItem>
                                <SelectItem value="09:30">9:30 AM</SelectItem>
                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                <SelectItem value="10:30">10:30 AM</SelectItem>
                                <SelectItem value="11:00">11:00 AM</SelectItem>
                                <SelectItem value="11:30">11:30 AM</SelectItem>
                                <SelectItem value="13:00">1:00 PM</SelectItem>
                                <SelectItem value="13:30">1:30 PM</SelectItem>
                                <SelectItem value="14:00">2:00 PM</SelectItem>
                                <SelectItem value="14:30">2:30 PM</SelectItem>
                                <SelectItem value="15:00">3:00 PM</SelectItem>
                                <SelectItem value="15:30">3:30 PM</SelectItem>
                                <SelectItem value="16:00">4:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={bookingForm.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="radiology">Radiology</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="general">General Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select value={bookingForm.doctor} onValueChange={(value) => handleSelectChange("doctor", value)}>
                    <SelectTrigger id="doctor">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-smith">Dr. Jane Smith</SelectItem>
                      <SelectItem value="dr-doe">Dr. John Doe</SelectItem>
                      <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                      <SelectItem value="dr-patel">Dr. Raj Patel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    name="reason"
                    placeholder="Brief reason for your appointment"
                    value={bookingForm.reason}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any additional information for the doctor"
                    value={bookingForm.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBookAppointment} disabled={isBooking} className="w-full">
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CalendarIcon2 className="mr-2 h-4 w-4" />
                    Book Appointment
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

