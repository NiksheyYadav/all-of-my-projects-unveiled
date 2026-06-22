'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/store/chat'
import { useUserStore } from '@/store/user'
import { motion } from 'framer-motion'
import { Download, Moon, Shield, Sun, Trash2, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SettingsPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const { email, name, plan, messagesUsedToday, clearUser } = useUserStore()
  const { conversations, clearConversations } = useChatStore()

  const handleExportData = () => {
    const data = {
      conversations,
      user: { email, name, plan },
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-chat-backup-${Date.now()}.json`
    a.click()
  }

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to delete all conversations? This cannot be undone.')) {
      clearConversations()
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-white/60">Manage your account and preferences</p>
          </div>
          <Link href="/chat">
            <Button variant="outline">Back to Chat</Button>
          </Link>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account
              </CardTitle>
              <CardDescription>Your account information and subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">Email</label>
                <Input value={email || 'user@example.com'} disabled />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">Name</label>
                <Input value={name || 'User'} placeholder="Enter your name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Current Plan</label>
                  <div className="text-2xl font-bold capitalize">{plan}</div>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Messages Today</label>
                  <div className="text-2xl font-bold">{messagesUsedToday}</div>
                </div>
              </div>
              <Link href="/pricing">
                <Button className="w-full">Upgrade Plan</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="flex-1"
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </Button>
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="flex-1"
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Data & Privacy
              </CardTitle>
              <CardDescription>Manage your data and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleExportData} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
              <Button onClick={handleClearHistory} variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Conversations
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-400">{conversations.length}</div>
                  <div className="text-sm text-white/60 mt-1">Conversations</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">
                    {conversations.reduce((acc, conv) => acc + conv.messages.length, 0)}
                  </div>
                  <div className="text-sm text-white/60 mt-1">Total Messages</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">{messagesUsedToday}</div>
                  <div className="text-sm text-white/60 mt-1">Today's Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
