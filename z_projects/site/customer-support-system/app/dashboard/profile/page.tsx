import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg?height=80&width=80" />
          <AvatarFallback>CU</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">Rahul Sharma</h3>
          <p className="text-muted-foreground">rahul.sharma@example.com</p>
          <p className="text-sm text-muted-foreground">Customer since: January 2023</p>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="Rahul" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="Sharma" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="rahul.sharma@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+91 9876543210" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Green Park, New Delhi" />
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium">System Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about system performance and issues
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Email
                    </Button>
                    <Button variant="outline" size="sm">
                      SMS
                    </Button>
                    <Button variant="outline" size="sm">
                      Push
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium">Billing Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications about invoices and payments</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Email
                    </Button>
                    <Button variant="outline" size="sm">
                      SMS
                    </Button>
                    <Button variant="outline" size="sm">
                      Push
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium">Maintenance Updates</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications about scheduled maintenance</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Email
                    </Button>
                    <Button variant="outline" size="sm">
                      SMS
                    </Button>
                    <Button variant="outline" size="sm">
                      Push
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium">Data Sharing</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow us to share anonymized usage data to improve our services
                    </p>
                  </div>
                  <Button variant="outline">Enabled</Button>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium">Marketing Communications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates about new products and services</p>
                  </div>
                  <Button variant="outline">Disabled</Button>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium">Third-Party Access</h4>
                    <p className="text-sm text-muted-foreground">Allow third-party applications to access your data</p>
                  </div>
                  <Button variant="outline">Disabled</Button>
                </div>
                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
