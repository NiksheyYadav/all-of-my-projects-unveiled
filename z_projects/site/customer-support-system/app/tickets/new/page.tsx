"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Paperclip } from "lucide-react"

export default function NewTicketPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate ticket creation
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Ticket created",
        description: "Your support ticket has been created successfully.",
      })
      router.push("/tickets")
    }, 1500)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Ticket</h1>
        <p className="text-muted-foreground">Submit a new support ticket to get help with your issue</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>
              Please provide as much detail as possible to help us resolve your issue quickly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Brief description of your issue" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing & Payments</SelectItem>
                  <SelectItem value="account">Account Management</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please describe your issue in detail..."
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments (optional)</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Paperclip className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>
                <Input id="file-upload" type="file" multiple className="hidden" />
              </div>
              <p className="text-xs text-muted-foreground">
                You can upload up to 5 files (max 5MB each). Supported formats: JPG, PNG, PDF, DOC, DOCX.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Ticket..." : "Create Ticket"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
