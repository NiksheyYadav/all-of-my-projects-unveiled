"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Camera } from "lucide-react"

export default function ProfilePage() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)

    // Simulate profile update
    setTimeout(() => {
      setIsUpdating(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    }, 1500)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <Tabs defaultValue="personal-info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal-info">
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal information and profile picture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-primary-foreground">
                      <Camera className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="font-medium">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">Upload a new profile picture</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm">
                        Upload
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" defaultValue="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    className="min-h-[100px]"
                    defaultValue="I'm a software developer with a passion for building great products."
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <form onSubmit={(e) => e.preventDefault()}>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input id="confirm-password" type="password" />
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Login Sessions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage your active sessions and sign out from other devices
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Windows 11 • Chrome • New York, USA</p>
                      </div>
                      <div className="text-sm text-green-600 font-medium">Active Now</div>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-muted-foreground">iOS 16 • iPhone • Last active 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <form onSubmit={(e) => e.preventDefault()}>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your notification and display preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Notification Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about your support tickets
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email-notifications" className="h-4 w-4" defaultChecked />
                        <Label htmlFor="email-notifications" className="sr-only">
                          Email Notifications
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive text messages for urgent updates</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="sms-notifications" className="h-4 w-4" />
                        <Label htmlFor="sms-notifications" className="sr-only">
                          SMS Notifications
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Browser Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="browser-notifications" className="h-4 w-4" defaultChecked />
                        <Label htmlFor="browser-notifications" className="sr-only">
                          Browser Notifications
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Language and Region</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        defaultValue="en"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        defaultValue="america-new_york"
                      >
                        <option value="america-new_york">Eastern Time (US & Canada)</option>
                        <option value="america-chicago">Central Time (US & Canada)</option>
                        <option value="america-denver">Mountain Time (US & Canada)</option>
                        <option value="america-los_angeles">Pacific Time (US & Canada)</option>
                        <option value="europe-london">London</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
