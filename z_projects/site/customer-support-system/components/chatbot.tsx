"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, X, Sun } from "lucide-react"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm the Akshat Udyam Solar Assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  },
]

// Solar-specific responses for common questions
const solarResponses: Record<string, string> = {
  "solar panel":
    "Akshat Udyam offers high-efficiency solar panels for residential, commercial, and industrial applications. Our panels are designed to maximize energy production even in low-light conditions.",
  installation:
    "Our professional installation team handles everything from site assessment to final setup. We typically complete residential installations within 2-3 days, ensuring minimal disruption to your daily life.",
  cost: "The cost of solar installation varies based on system size and your energy needs. However, with government subsidies and our financing options, you can start saving immediately. Would you like a free consultation for a personalized quote?",
  maintenance:
    "We offer comprehensive maintenance plans to ensure your solar system operates at peak efficiency. Our plans include regular cleaning, performance monitoring, and priority support.",
  warranty:
    "All our solar panels come with a 25-year performance warranty. Inverters typically have a 10-year warranty, and our installation work is guaranteed for 5 years.",
  subsidy:
    "Yes, government subsidies are available for solar installations. Currently, you can avail up to 40% subsidy on residential installations. Our team can help you with the paperwork to claim these benefits.",
  "energy saving":
    "Most of our customers see a reduction of 70-90% in their electricity bills after installing our solar systems. The exact savings depend on your energy consumption and system size.",
  grid: "We offer both on-grid and off-grid solar solutions. On-grid systems allow you to sell excess power back to the utility company, while off-grid systems with battery storage provide complete energy independence.",
  battery:
    "We offer high-quality lithium-ion battery storage solutions that allow you to store excess solar energy for use during nighttime or power outages.",
  commercial:
    "Our commercial solar solutions are designed for businesses looking to reduce operational costs and meet sustainability goals. We offer custom designs based on your facility's energy requirements.",
  default:
    "Thank you for your question. Our team would be happy to provide more detailed information. Would you like me to arrange for a solar expert to contact you?",
}

export function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [input, setInput] = React.useState("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Generate bot response
    setTimeout(() => {
      const botResponse = generateResponse(input)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    // Check for matches in our solar-specific responses
    for (const [keyword, response] of Object.entries(solarResponses)) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        return response
      }
    }

    return solarResponses.default
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chatbot toggle button */}
      <Button
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 shadow-lg bg-yellow-500 hover:bg-yellow-600 text-black"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Open chat</span>
      </Button>

      {/* Chatbot dialog */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] shadow-lg flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b bg-yellow-500 text-black">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              <span className="font-medium">Akshat Udyam Solar Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-black hover:bg-yellow-600"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-8 w-8">
                      {message.sender === "bot" ? (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback className="bg-yellow-500 text-black">AU</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>U</AvatarFallback>
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
                        {message.timestamp.toLocaleTimeString([], {
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
          <div className="border-t p-3 flex gap-2">
            <Input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </Card>
      )}
    </>
  )
}
