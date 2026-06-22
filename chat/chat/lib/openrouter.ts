// OpenRouter API configuration and models
export const AI_MODELS = [
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    description: 'Most advanced GPT-4 model',
    tier: 'premium'
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Fast and efficient GPT-4',
    tier: 'pro'
  },
  {
    id: 'anthropic/claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Anthropic\'s latest model',
    tier: 'premium'
  },
  {
    id: 'nvidia/nemotron-nano-9b-v2',
    name: 'Nemotron Nano 9B V2',
    description: 'NVIDIA Nemotron Nano 9B V2 (free)',
    tier: 'free'
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and capable',
    tier: 'basic'
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    description: 'Google\'s advanced model',
    tier: 'pro'
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    description: 'Meta\'s large language model',
    tier: 'pro'
  },
  {
    id: 'mistralai/mixtral-8x7b-instruct',
    name: 'Mixtral 8x7B',
    description: 'Mistral\'s mixture of experts',
    tier: 'basic'
  },
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and reliable',
    tier: 'free'
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance',
    tier: 'pro'
  }
]

export async function streamChatCompletion(messages: any[], model: string) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'ChatGPT Clone'
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true
    })
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`)
  }

  return response
}