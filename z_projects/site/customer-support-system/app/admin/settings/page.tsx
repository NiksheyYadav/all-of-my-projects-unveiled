"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    // Simulate saving settings
    setTimeout(() => {
      setIsUpdating(false)
      toast({
        title: "Settings updated",
        description: "Your settings have been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage system settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <form onSubmit={handleSaveSettings}>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage general system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input id="site-name" defaultValue="Akshat Udyam Solar Solutions" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" type="email" defaultValue="info@auitspl.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input id="contact-phone" defaultValue="+91 1234567890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <select
                    id="timezone"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="asia-kolkata"
                  >
                    <option value="asia-kolkata">India (GMT+5:30)</option>
                    <option value="america-new_york">Eastern Time (US & Canada)</option>
                    <option value="europe-london">London</option>
                    <option value="asia-dubai">Dubai</option>
                    <option value="asia-singapore">Singapore</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Put the site in maintenance mode</p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <form onSubmit={handleSaveSettings}>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Manage your company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Akshat Udyam IT Solutions Pvt. Ltd." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">Address</Label>
                  <Textarea id="company-address" defaultValue="123 Solar Street, Pune, Maharashtra, India" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-gstin">GSTIN</Label>
                  <Input id="company-gstin" defaultValue="27AABCA1234A1Z5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-pan">PAN</Label>
                  <Input id="company-pan" defaultValue="AABCA1234A" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <form onSubmit={handleSaveSettings}>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure system notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
                <div className="space-y-2">
                  <Label>Notification Types</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="new-customer" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="new-customer">New Customer Registration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="new-ticket" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="new-ticket">New Support Ticket</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="payment-received" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="payment-received">Payment Received</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="installation-complete" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="installation-complete">Installation Complete</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <form onSubmit={handleSaveSettings}>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin logins</p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                  </div>
                  <select
                    id="session-timeout"
                    className="w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="30"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="0">Never</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
