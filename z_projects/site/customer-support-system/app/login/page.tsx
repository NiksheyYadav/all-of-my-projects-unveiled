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
import { Sun } from "lucide-react"
import { Chatbot } from "@/components/chatbot"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Login successful",
        description: "Welcome to your Akshat Udyam customer portal.",
      })
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Banner */}
      <div className="bg-yellow-400 py-2 px-4 text-center text-sm font-medium">
        Avail Government Subsidy for Solar Services{" "}
        <Link href="/subsidy-info" className="underline underline-offset-2 ml-1">
          Learn More
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-50">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Sun className="h-8 w-8 text-yellow-500" />
          <span className="text-2xl font-bold">Akshat Udyam</span>
        </Link>

        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Customer Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your solar dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
                  Contact us to get started
                </Link>
                <div className="mt-2">
                  <Link href="/admin/login" className="text-primary underline-offset-4 hover:underline">
                    Admin Login
                  </Link>
                </div>
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

      <Chatbot />
    </div>
  )
}
