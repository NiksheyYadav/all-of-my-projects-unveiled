"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Paperclip, Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! How can I help you today?",
      sender: "agent",
      timestamp: new Date(Date.now() - 60000).toISOString(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    setIsSending(true)

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      content: newMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate agent response after a delay
    setTimeout(() => {
      const agentMessage = {
        id: messages.length + 2,
        content:
          "Thank you for your message. One of our support agents will be with you shortly. How else can I assist you today?",
        sender: "agent",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, agentMessage])
      setIsSending(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Live Chat Support</h1>
        <p className="text-muted-foreground">Chat with our support team in real-time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader>
              <CardTitle>Chat Session</CardTitle>
              <CardDescription>You are chatting with our support team</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-8 w-8">
                          {message.sender === "agent" ? (
                            <>
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback>CS</AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback>JD</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div>
                          <div
                            className={`rounded-lg p-3 ${
                              message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {message.content}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-3">
              <div className="flex w-full items-center gap-2">
                <Button variant="outline" size="icon" className="shrink-0">
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSending}
                />
                <Button
                  size="icon"
                  className="shrink-0"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chat Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Support Agent</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>CS</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">Customer Support</div>
                      <div className="text-xs text-muted-foreground">Online</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Chat Started</div>
                  <div className="text-sm text-muted-foreground mt-1">{new Date().toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Estimated Wait Time</div>
                  <div className="text-sm text-muted-foreground mt-1">Less than 2 minutes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Create Support Ticket
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View FAQ
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  End Chat Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
