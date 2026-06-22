'use client'

import { ChatInterface } from '@/components/chat/chat-interface'
import { Header } from '@/components/chat/header'
import { Sidebar } from '@/components/chat/sidebar'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/chat'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ChatPage() {
  const [showSidebar, setShowSidebar] = useState(true)
  const { conversations, currentConversationId, createConversation } = useChatStore()

  useEffect(() => {
    // Create first conversation if none exist
    if (conversations.length === 0) {
      createConversation()
    }
  }, [])

  // Client-side migration: update any persisted messages that still reference
  // the old default model id (openai/gpt-3.5-turbo) to the new Nemotron id.
  useEffect(() => {
    try {
      const key = 'chat-storage'
      const raw = localStorage.getItem(key)
      if (!raw) return

      const parsed = JSON.parse(raw)
      // Zustand persisted shape may be { state: { ... } }
      const stored = parsed.state || parsed
      const defaultModel = 'nvidia/nemotron-nano-9b-v2'

      let mutated = false

      if (stored && Array.isArray(stored.conversations)) {
        stored.conversations = stored.conversations.map((conv: any) => {
          if (!Array.isArray(conv.messages)) return conv
          const messages = conv.messages.map((m: any) => {
            if (!m) return m
            if (!m.model || m.model === 'openai/gpt-3.5-turbo') {
              mutated = true
              return { ...m, model: defaultModel }
            }
            return m
          })
          return { ...conv, messages }
        })
      }

      if (!stored.selectedModel || stored.selectedModel === 'openai/gpt-3.5-turbo') {
        stored.selectedModel = defaultModel
        mutated = true
      }

      if (mutated) {
        const out = parsed.state ? { ...parsed, state: stored } : stored
        localStorage.setItem(key, JSON.stringify(out))
        // Reload to ensure the app picks up the migrated state
        window.location.reload()
      }
    } catch (e) {
      // ignore migration errors
      console.warn('Client migration failed', e)
    }
  }, [])

  const currentConv = currentConversationId || conversations[0]?.id

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header onMenuClick={() => setShowSidebar(!showSidebar)} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="hidden lg:block"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConv ? (
            <ChatInterface conversationId={currentConv} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Start a New Conversation</h2>
                  <p className="text-white/60 mb-6">Choose a model and begin chatting</p>
                  <Button onClick={createConversation} size="lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    New Chat
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
