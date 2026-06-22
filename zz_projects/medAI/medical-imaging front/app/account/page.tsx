"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Loader2, LogOut, Shield } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Dr. Jane Smith",
    email: "jane.smith@example.com",
    institution: "General Hospital",
    specialty: "Radiology",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    // Show success message
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // Show error
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    // Show success message

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleDeleteAccount = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to login page
    router.push("/login")
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <CardTitle>{profileData.name}</CardTitle>
                <CardDescription>{profileData.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Institution</p>
                  <p className="text-sm text-muted-foreground">{profileData.institution}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Specialty</p>
                  <p className="text-sm text-muted-foreground">{profileData.specialty}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Account Type</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="h-4 w-4 text-primary" />
                    <p className="text-sm text-muted-foreground">Professional</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2" asChild>
                <Link href="/login">
                  <LogOut className="h-4 w-4" />
                  Log out
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="flex-1">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input
                        id="institution"
                        name="institution"
                        value={profileData.institution}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        name="specialty"
                        value={profileData.specialty}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delete Account</CardTitle>
                  <CardDescription>Permanently delete your account and all associated data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. All your data, including analysis history and
                    uploaded images, will be permanently removed.
                  </p>
                </CardContent>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your
                          data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Preferences</CardTitle>
                  <CardDescription>Customize your application experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Display Settings</h3>
                      <div className="mt-2 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="theme">Theme</Label>
                            <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
                          </div>
                          <select
                            id="theme"
                            className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                            defaultValue="system"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="density">Display Density</Label>
                            <p className="text-sm text-muted-foreground">Adjust the spacing of UI elements</p>
                          </div>
                          <select
                            id="density"
                            className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                            defaultValue="normal"
                          >
                            <option value="compact">Compact</option>
                            <option value="normal">Normal</option>
                            <option value="comfortable">Comfortable</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Notification Preferences</h3>
                      <div className="mt-2 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="emailNotifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive email updates about your analyses</p>
                          </div>
                          <select
                            id="emailNotifications"
                            className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                            defaultValue="important"
                          >
                            <option value="all">All notifications</option>
                            <option value="important">Important only</option>
                            <option value="none">None</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="resultFormat">Result Format</Label>
                            <p className="text-sm text-muted-foreground">Choose how analysis results are displayed</p>
                          </div>
                          <select
                            id="resultFormat"
                            className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                            defaultValue="detailed"
                          >
                            <option value="simple">Simple</option>
                            <option value="detailed">Detailed</option>
                            <option value="technical">Technical</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

