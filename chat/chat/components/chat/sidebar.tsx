'use client'

import { Button } from '@/components/ui/button'
import { ListItem } from '@/components/ui/list-item'
import { formatTime } from '@/lib/utils'
import { useChatStore } from '@/store/chat'
import { MessageSquare, Plus, Trash2 } from 'lucide-react'

export function Sidebar() {
  const { conversations, currentConversationId, createConversation, setCurrentConversation, deleteConversation } = useChatStore()

  return (
    <div className="w-80 border-r-2 border-white/10 backdrop-blur-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b-2 border-white/10">
        <Button onClick={createConversation} className="w-full" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {conversations.map((conv) => (
          <ListItem
            key={conv.id}
            onActivate={() => setCurrentConversation(conv.id)}
            className={
              currentConversationId === conv.id
                ? 'bg-linear-to-r from-purple-600/20 to-blue-600/20 border-2 border-purple-500/50'
                : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
            }
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 shrink-0 text-purple-400" />
                  <p className="font-medium truncate">{conv.title}</p>
                </div>
                <p className="text-xs text-white/50">
                  {formatTime(conv.updatedAt)} • {conv.messages.length} messages
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteConversation(conv.id)
                }}
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          </ListItem>
        ))}
      </div>
    </div>
  )
}
