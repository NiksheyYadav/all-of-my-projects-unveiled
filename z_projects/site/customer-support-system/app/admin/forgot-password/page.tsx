"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Sun, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password reset request
    setTimeout(() => {
      setIsLoading(false)
      setSubmitted(true)

      toast({
        title: "Reset link sent",
        description: "If an account exists with this email, you will receive a password reset link.",
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-50">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Sun className="h-8 w-8 text-zinc-800" />
          <span className="text-2xl font-bold">Akshat Udyam</span>
        </Link>

        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              {!submitted
                ? "Enter your email address and we'll send you a link to reset your password"
                : "Check your email for a reset link"}
            </CardDescription>
          </CardHeader>

          {!submitted ? (
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
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full bg-zinc-800 hover:bg-zinc-700 text-white" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <div className="text-center text-sm">
                  <Link
                    href="/admin/login"
                    className="text-primary underline-offset-4 hover:underline flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                <p className="text-green-800">
                  If an account exists with the email <strong>{email}</strong>, you will receive a password reset link
                  shortly.
                </p>
              </div>
              <Button className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white" asChild>
                <Link href="/admin/login">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                </Link>
              </Button>
            </CardContent>
          )}
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Akshat Udyam. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
