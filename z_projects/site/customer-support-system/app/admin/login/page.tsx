"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Sun, ShieldAlert } from "lucide-react"

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate login verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would be a secure authentication process
      // For demo purposes, we'll accept any credentials
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard.",
      })

      // Redirect to the admin dashboard
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Banner - Removed */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-50">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Sun className="h-8 w-8 text-zinc-800" />
          <span className="text-2xl font-bold">Akshat Udyam</span>
        </Link>

        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <ShieldAlert className="h-10 w-10 text-zinc-800" />
            </div>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/admin/forgot-password"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-zinc-800 hover:bg-zinc-700 text-white" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="text-center text-sm">
                <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                  Customer Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Akshat Udyam. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
