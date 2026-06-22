'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { AI_MODELS } from '@/lib/openrouter'
import { useChatStore } from '@/store/chat'
import { useUserStore } from '@/store/user'
import { motion } from 'framer-motion'
import { Menu, Settings, Sparkles, User, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [showModelSelector, setShowModelSelector] = useState(false)
  const { selectedModel, setSelectedModel } = useChatStore()
  const { plan, messagesUsedToday } = useUserStore()

  const currentModel = Object.values(AI_MODELS).find(m => m.id === selectedModel)

  return (
    <div className="h-16 border-b-2 border-white/10 backdrop-blur-xl flex items-center justify-between px-4">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 className="font-bold text-lg">AI Chat</h1>
            <p className="text-xs text-white/50">{plan.toUpperCase()} Plan</p>
          </div>
        </div>
      </div>

      {/* Center - Model Selector */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowModelSelector(!showModelSelector)}
          className="gap-2"
        >
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">{currentModel?.name || 'Select Model'}</span>
        </Button>

        {showModelSelector && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 w-80 bg-black/90 backdrop-blur-xl border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
          >
            <div className="p-2 space-y-1">
              {Object.entries(AI_MODELS).map(([key, model]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedModel(model.id)
                    setShowModelSelector(false)
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                    selectedModel === model.id
                      ? 'bg-linear-to-r from-purple-600 to-blue-600'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-white/50">{model.description}</div>
                  <div className="text-xs text-purple-400 mt-1">{model.tier.toUpperCase()}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:block text-right mr-3">
          <div className="text-sm font-medium">{messagesUsedToday} messages</div>
          <div className="text-xs text-white/50">used today</div>
        </div>
        
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </Link>

        <Avatar className="cursor-pointer">
          <AvatarFallback>
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
