'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useChatStore, type Message } from '@/store/chat'
import { useUserStore } from '@/store/user'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Send, Sparkles, User } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import vs from 'react-syntax-highlighter/dist/styles/vs'

interface ChatInterfaceProps {
  conversationId: string
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const { conversations, addMessage, updateMessage, selectedModel, isStreaming, setIsStreaming } = useChatStore()
  const { incrementMessageCount } = useUserStore()
  
  const conversation = conversations.find(c => c.id === conversationId)
  const messages = conversation?.messages || []

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    }

    addMessage(conversationId, userMessage)
    setInput('')
    setIsStreaming(true)
    incrementMessageCount()

    const assistantMessageId = nanoid()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      model: selectedModel,
      createdAt: new Date(),
    }
    
    addMessage(conversationId, assistantMessage)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          fullContent += chunk
          setStreamingContent(fullContent)
          updateMessage(conversationId, assistantMessageId, fullContent)
        }
      }

      setStreamingContent('')
    } catch (error) {
      console.error('Chat error:', error)
      updateMessage(conversationId, assistantMessageId, 'Sorry, I encountered an error. Please try again.')
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="shrink-0">
                  <AvatarFallback>
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white/5 backdrop-blur-xl border-2 border-white/10'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="markdown-content prose prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vs}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-xl"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
                {message.model && (
                  <div className="text-xs text-white/40 mt-2">
                    {message.model.split('/').pop()}
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <Avatar className="shrink-0">
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <Avatar className="shrink-0">
              <AvatarFallback>
                <Bot className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Skeleton className="w-2 h-2 rounded-full animate-pulse" />
              <Skeleton className="w-2 h-2 rounded-full animate-pulse [animation-delay:0.2s]" />
              <Skeleton className="w-2 h-2 rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 border-t-2 border-white/10 backdrop-blur-xl"
      >
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[60px] max-h-[200px] resize-none"
            disabled={isStreaming}
          />
          <Button
            type="submit"
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
            disabled={!input.trim() || isStreaming}
          >
            {isStreaming ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
