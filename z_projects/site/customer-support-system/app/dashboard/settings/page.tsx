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
import { Bell, Lock, User } from "lucide-react"

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
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <form onSubmit={handleSaveSettings}>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your general account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mr">Marathi</option>
                    <option value="gu">Gujarati</option>
                    <option value="ta">Tamil</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <select
                    id="date-format"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="dd-mm-yyyy"
                  >
                    <option value="dd-mm-yyyy">DD-MM-YYYY</option>
                    <option value="mm-dd-yyyy">MM-DD-YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark mode for the dashboard</p>
                  </div>
                  <Switch id="dark-mode" />
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
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                    </div>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Notification Types</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="system-alerts" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="system-alerts">System Alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="maintenance-reminders" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="maintenance-reminders">Maintenance Reminders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="billing-notifications" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="billing-notifications">Billing Notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="performance-reports" className="h-4 w-4" defaultChecked />
                      <Label htmlFor="performance-reports">Performance Reports</Label>
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
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <Label htmlFor="current-password">Current Password</Label>
                  </div>
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
                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <Button variant="outline" type="button">
                      Enable
                    </Button>
                  </div>
                </div>
                <div className="pt-4 space-y-2">
                  <Label>Active Sessions</Label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Windows • Chrome • Mumbai, India</p>
                      </div>
                      <div className="text-sm text-green-600 font-medium">Active Now</div>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-muted-foreground">Android • Last active 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm" type="button">
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
