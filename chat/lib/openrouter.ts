export const AI_MODELS = {
  'gpt-4-turbo': {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Most capable model, best for complex tasks',
    tier: 'premium',
  },
  'gpt-4': {
    id: 'openai/gpt-4',
    name: 'GPT-4',
    description: 'Advanced reasoning and analysis',
    tier: 'pro',
  },
  'gpt-3.5-turbo': {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for everyday tasks',
    tier: 'free',
  },
  'claude-3-opus': {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic\'s most intelligent model',
    tier: 'premium',
  },
  'claude-3-sonnet': {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance and speed',
    tier: 'pro',
  },
  'claude-3-haiku': {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and compact',
    tier: 'basic',
  },
  'gemini-pro': {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    description: 'Google\'s powerful AI model',
    tier: 'pro',
  },
  'llama-3-70b': {
    id: 'meta-llama/llama-3-70b-instruct',
    name: 'Llama 3 70B',
    description: 'Open source powerhouse',
    tier: 'basic',
  },
  'mixtral-8x7b': {
    id: 'mistralai/mixtral-8x7b-instruct',
    name: 'Mixtral 8x7B',
    description: 'Fast mixture of experts model',
    tier: 'basic',
  },
} as const

export type ModelKey = keyof typeof AI_MODELS

export async function streamChatCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string,
  onChunk: (text: string) => void,
  onError: (error: string) => void
) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || '',
        'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'AI Chat',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) throw new Error('No reader available')

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices[0]?.delta?.content
            if (content) {
              onChunk(content)
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Unknown error')
  }
}
