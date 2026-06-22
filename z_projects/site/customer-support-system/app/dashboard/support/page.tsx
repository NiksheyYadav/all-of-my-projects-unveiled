import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SupportPage() {
  // Sample ticket data
  const tickets = [
    {
      id: "TKT-001",
      date: "2023-06-10",
      subject: "Inverter showing error code E04",
      status: "Open",
      priority: "High",
    },
    {
      id: "TKT-002",
      date: "2023-05-22",
      subject: "Need help understanding my energy report",
      status: "Closed",
      priority: "Medium",
    },
    {
      id: "TKT-003",
      date: "2023-04-15",
      subject: "Solar panels not producing expected output",
      status: "In Progress",
      priority: "High",
    },
    {
      id: "TKT-004",
      date: "2023-03-30",
      subject: "Request for annual maintenance",
      status: "Closed",
      priority: "Low",
    },
    {
      id: "TKT-005",
      date: "2023-02-18",
      subject: "Battery not charging properly",
      status: "Closed",
      priority: "Medium",
    },
  ]

  // Sample FAQ data
  const faqs = [
    {
      question: "How often should I clean my solar panels?",
      answer:
        "We recommend cleaning your solar panels every 3-6 months, depending on your local environment. Areas with more dust, pollen, or bird activity may require more frequent cleaning.",
    },
    {
      question: "What should I do if my system stops working?",
      answer:
        "First, check if there are any error codes on your inverter display. Note these down and contact our support team. You can also check if the circuit breakers are in the correct position.",
    },
    {
      question: "How do I interpret my energy production data?",
      answer:
        "Your energy production data shows how much electricity your solar system is generating. You can compare daily, monthly, and yearly production to understand patterns and ensure your system is performing optimally.",
    },
    {
      question: "When is my next maintenance due?",
      answer:
        "Maintenance schedules are typically annual. You can find your next scheduled maintenance date in the 'My Solar System' section under the 'Maintenance' tab.",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Support</h2>
        <p className="text-muted-foreground">Get help with your solar system</p>
      </div>

      <div className="flex justify-end">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Ticket
        </Button>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>View and manage your support tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.date}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            ticket.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : ticket.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            ticket.status === "Open"
                              ? "bg-blue-100 text-blue-800"
                              : ticket.status === "In Progress"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="icon" title="View Ticket">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Customer Support</h3>
                    <p className="text-muted-foreground mb-2">For general inquiries and support</p>
                    <p>Email: support@akshatudyam.com</p>
                    <p>Phone: +91 1234567890</p>
                    <p>Hours: Mon-Fri, 9am-6pm</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Technical Support</h3>
                    <p className="text-muted-foreground mb-2">For technical issues and emergencies</p>
                    <p>Email: tech@akshatudyam.com</p>
                    <p>Phone: +91 9876543210</p>
                    <p>Hours: 24/7 Emergency Support</p>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Visit Us</h3>
                  <p className="text-muted-foreground mb-2">Our office location</p>
                  <p>Akshat Udyam IT Solutions Pvt. Ltd.</p>
                  <p>123 Solar Street, Green Park</p>
                  <p>New Delhi, India 110001</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
