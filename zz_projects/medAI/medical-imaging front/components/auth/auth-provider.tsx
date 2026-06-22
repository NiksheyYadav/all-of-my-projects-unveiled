"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export type UserRole = "patient" | "doctor" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phoneNumber?: string
  specialization?: string // For doctors
  hospital?: string // For doctors
  medicalHistory?: string // For patients
  profileImage?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: Partial<User> & { password: string }) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Check if user should be redirected based on auth status and role
  useEffect(() => {
    if (isLoading) return

    const publicPaths = ["/", "/login", "/register"]
    const isPublicPath = publicPaths.includes(pathname)

    if (!user && !isPublicPath) {
      router.push("/login")
    } else if (user && pathname === "/login") {
      router.push("/dashboard")
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data - in a real app, this would come from the API
      const mockUsers = [
        {
          id: "doctor-1",
          name: "Dr. Jane Smith",
          email: "doctor@example.com",
          role: "doctor" as UserRole,
          phoneNumber: "+1 (555) 123-4567",
          specialization: "Radiology",
          hospital: "General Hospital",
          profileImage: "/placeholder-user.jpg",
          createdAt: new Date().toISOString(),
        },
        {
          id: "patient-1",
          name: "John Doe",
          email: "patient@example.com",
          role: "patient" as UserRole,
          phoneNumber: "+1 (555) 987-6543",
          medicalHistory: "No significant medical history",
          profileImage: "/placeholder-user.jpg",
          createdAt: new Date().toISOString(),
        },
      ]

      const foundUser = mockUsers.find((u) => u.email === email)

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // Set user in state and localStorage
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))

      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "patient",
        phoneNumber: userData.phoneNumber,
        specialization: userData.role === "doctor" ? userData.specialization : undefined,
        hospital: userData.role === "doctor" ? userData.hospital : undefined,
        medicalHistory: userData.role === "patient" ? userData.medicalHistory : undefined,
        profileImage: "/placeholder-user.jpg",
        createdAt: new Date().toISOString(),
      }

      // Set user in state and localStorage
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))

      toast({
        title: "Registration successful",
        description: `Welcome, ${newUser.name}!`,
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return Promise.reject(new Error("No user logged in"))

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      return Promise.resolve()
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An error occurred while updating your profile",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

