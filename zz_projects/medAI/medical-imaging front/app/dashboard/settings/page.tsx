"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)
  const [generalSettings, setGeneralSettings] = useState({
    language: "english",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    resultNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
  })
  const [privacySettings, setPrivacySettings] = useState({
    shareDataForResearch: false,
    allowAnonymousUsage: true,
  })

  const handleSaveSettings = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })

    setIsLoading(false)
  }

  const handleToggleChange = (setting: string, value: boolean) => {
    if (setting.startsWith("notification")) {
      setNotificationSettings((prev) => ({
        ...prev,
        [setting.replace("notification", "").charAt(0).toLowerCase() + setting.replace("notification", "").slice(1)]:
          value,
      }))
    } else if (setting.startsWith("privacy")) {
      setPrivacySettings((prev) => ({
        ...prev,
        [setting.replace("privacy", "").charAt(0).toLowerCase() + setting.replace("privacy", "").slice(1)]: value,
      }))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general application preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={generalSettings.language}
                  onChange={(e) => setGeneralSettings((prev) => ({ ...prev, language: e.target.value }))}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="chinese">Chinese</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings((prev) => ({ ...prev, timezone: e.target.value }))}
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-7">Mountain Time (UTC-7)</option>
                  <option value="UTC-6">Central Time (UTC-6)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC+0">Greenwich Mean Time (UTC+0)</option>
                  <option value="UTC+1">Central European Time (UTC+1)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <select
                  id="dateFormat"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={generalSettings.dateFormat}
                  onChange={(e) => setGeneralSettings((prev) => ({ ...prev, dateFormat: e.target.value }))}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
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
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notificationEmailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="notificationEmailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleToggleChange("notificationEmailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notificationResultNotifications">Result Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when new analysis results are available</p>
                </div>
                <Switch
                  id="notificationResultNotifications"
                  checked={notificationSettings.resultNotifications}
                  onCheckedChange={(checked) => handleToggleChange("notificationResultNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notificationAppointmentReminders">Appointment Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive reminders about upcoming appointments</p>
                </div>
                <Switch
                  id="notificationAppointmentReminders"
                  checked={notificationSettings.appointmentReminders}
                  onCheckedChange={(checked) => handleToggleChange("notificationAppointmentReminders", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notificationMarketingEmails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and services</p>
                </div>
                <Switch
                  id="notificationMarketingEmails"
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) => handleToggleChange("notificationMarketingEmails", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
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
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="privacyShareDataForResearch">Share Data for Research</Label>
                  <p className="text-sm text-muted-foreground">Allow anonymized data to be used for medical research</p>
                </div>
                <Switch
                  id="privacyShareDataForResearch"
                  checked={privacySettings.shareDataForResearch}
                  onCheckedChange={(checked) => handleToggleChange("privacyShareDataForResearch", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="privacyAllowAnonymousUsage">Anonymous Usage Statistics</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow collection of anonymous usage statistics to improve the application
                  </p>
                </div>
                <Switch
                  id="privacyAllowAnonymousUsage"
                  checked={privacySettings.allowAnonymousUsage}
                  onCheckedChange={(checked) => handleToggleChange("privacyAllowAnonymousUsage", checked)}
                />
              </div>

              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm font-medium">Data Privacy Notice</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We take your privacy seriously. Your medical data is encrypted and stored securely. You can request a
                  copy of your data or deletion of your account at any time by contacting support.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

