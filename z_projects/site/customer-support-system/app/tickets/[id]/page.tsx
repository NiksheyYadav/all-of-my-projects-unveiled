"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Paperclip, Send } from "lucide-react"

export default function TicketDetailPage() {
  const params = useParams()
  const ticketId = params.id
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    setIsSending(true)

    // Simulate sending message
    setTimeout(() => {
      setNewMessage("")
      setIsSending(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-2">
          <Link href="/tickets">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ticket #{ticketId}</h1>
            <p className="text-muted-foreground">Login issue with mobile app</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="in-progress">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Close Ticket</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Conversation</CardTitle>
              <CardDescription>Communication history for this support ticket</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <TicketMessage
                  name="John Doe"
                  role="Customer"
                  message="I'm having trouble logging into the mobile app. When I enter my credentials and tap login, it just shows a loading spinner and then nothing happens. I've tried reinstalling the app but the issue persists."
                  timestamp="Apr 28, 2025 at 10:23 AM"
                  isCustomer
                />

                <TicketMessage
                  name="Sarah Johnson"
                  role="Support Agent"
                  message="Hi John, I'm sorry to hear you're having trouble with the mobile app login. Could you please tell me what device and operating system version you're using? Also, have you tried resetting your password recently?"
                  timestamp="Apr 28, 2025 at 10:45 AM"
                />

                <TicketMessage
                  name="John Doe"
                  role="Customer"
                  message="I'm using an iPhone 13 with iOS 16.5. I haven't reset my password recently, but I can log in fine on the website, just not on the mobile app."
                  timestamp="Apr 28, 2025 at 11:02 AM"
                  isCustomer
                />

                <TicketMessage
                  name="Sarah Johnson"
                  role="Support Agent"
                  message="Thank you for that information. We've identified a potential issue with the login process on iOS 16.5. Our development team is working on a fix that should be released in the next app update. In the meantime, could you try clearing the app cache by going to Settings > General > iPhone Storage > Our App > Offload App, and then reinstalling?"
                  timestamp="Apr 28, 2025 at 11:15 AM"
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-2">
                <Textarea
                  placeholder="Type your message here..."
                  className="min-h-[100px]"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div className="flex justify-between">
                  <Button type="button" variant="outline" size="sm">
                    <Paperclip className="mr-2 h-4 w-4" />
                    Attach Files
                  </Button>
                  <Button type="button" onClick={handleSendMessage} disabled={!newMessage.trim() || isSending}>
                    {isSending ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <div className="mt-1">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      In Progress
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Created</div>
                  <div className="text-sm text-muted-foreground mt-1">Apr 28, 2025 at 10:23 AM</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Last Updated</div>
                  <div className="text-sm text-muted-foreground mt-1">Apr 28, 2025 at 11:15 AM</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Category</div>
                  <div className="text-sm text-muted-foreground mt-1">Technical Issue</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Priority</div>
                  <div className="text-sm text-muted-foreground mt-1">Medium</div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium">Assigned Agent</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">Sarah Johnson</div>
                      <div className="text-xs text-muted-foreground">Technical Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq/mobile-app-login-issues" className="text-primary hover:underline">
                    Mobile App Login Troubleshooting
                  </Link>
                </li>
                <li>
                  <Link href="/faq/password-reset" className="text-primary hover:underline">
                    How to Reset Your Password
                  </Link>
                </li>
                <li>
                  <Link href="/faq/app-cache-clearing" className="text-primary hover:underline">
                    Clearing App Cache on iOS Devices
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function TicketMessage({
  name,
  role,
  message,
  timestamp,
  isCustomer = false,
}: {
  name: string
  role: string
  message: string
  timestamp: string
  isCustomer?: boolean
}) {
  return (
    <div className="flex gap-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src="/placeholder.svg?height=40&width=40" />
        <AvatarFallback>
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">({role})</span>
        </div>
        <div className="rounded-md bg-muted p-3">{message}</div>
        <div className="text-xs text-muted-foreground">{timestamp}</div>
      </div>
    </div>
  )
}
