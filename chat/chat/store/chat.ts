'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model?: string
  createdAt: Date
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatStore {
  conversations: Conversation[]
  currentConversationId: string | null
  selectedModel: string
  isStreaming: boolean
  
  // Actions
  createConversation: () => string
  deleteConversation: (id: string) => void
  setCurrentConversation: (id: string) => void
  addMessage: (conversationId: string, message: Message) => void
  updateMessage: (conversationId: string, messageId: string, content: string) => void
  setSelectedModel: (model: string) => void
  setIsStreaming: (isStreaming: boolean) => void
  clearConversations: () => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
  // Default model set to NVIDIA Nemotron Nano 9B V2 (free)
  selectedModel: 'nvidia/nemotron-nano-9b-v2',
      isStreaming: false,

      createConversation: () => {
        const id = `conv_${Date.now()}`
        const newConversation: Conversation = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }))
        return id
      },

      deleteConversation: (id) => {
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id)
          return {
            conversations: filtered,
            currentConversationId:
              state.currentConversationId === id
                ? filtered[0]?.id || null
                : state.currentConversationId,
          }
        })
      },

      setCurrentConversation: (id) => {
        set({ currentConversationId: id })
      },

      addMessage: (conversationId, message) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  title:
                    conv.messages.length === 0
                      ? message.content.slice(0, 50)
                      : conv.title,
                  updatedAt: new Date(),
                }
              : conv
          ),
        }))
      },

      updateMessage: (conversationId, messageId, content) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, content } : msg
                  ),
                  updatedAt: new Date(),
                }
              : conv
          ),
        }))
      },

      setSelectedModel: (model) => {
        set({ selectedModel: model })
      },

      setIsStreaming: (isStreaming) => {
        set({ isStreaming })
      },

      clearConversations: () => {
        set({ conversations: [], currentConversationId: null })
      },
    }),
    {
      name: 'chat-storage',
      // bump version when changing defaults/migrations
      version: 2,
      // migrate persisted state so older messages using the previous default model
      // (for example 'openai/gpt-3.5-turbo') are updated to the new default.
      migrate: (persistedState) => {
        try {
          // persistedState shape can be either the raw state or { state: rawState }
          const stored = (persistedState && (persistedState as any).state) || persistedState || {}
          const defaultModel = 'nvidia/nemotron-nano-9b-v2'

          if (stored && Array.isArray(stored.conversations)) {
            stored.conversations = stored.conversations.map((conv: any) => ({
              ...conv,
              messages: Array.isArray(conv.messages)
                ? conv.messages.map((m: any) => ({
                    ...m,
                    // replace legacy model id or empty model with the new default
                    model:
                      !m?.model || m.model === 'openai/gpt-3.5-turbo'
                        ? defaultModel
                        : m.model,
                  }))
                : conv.messages,
            }))
          }

          if (!stored.selectedModel || stored.selectedModel === 'openai/gpt-3.5-turbo') {
            stored.selectedModel = defaultModel
          }

          return stored
        } catch (e) {
          // If anything goes wrong, fall back to the raw persisted state
          return persistedState
        }
      },
    }
  )
)
