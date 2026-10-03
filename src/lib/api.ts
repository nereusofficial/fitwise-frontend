import { supabase } from './supabaseClient'
import type { ChatMessage, Recommendation, RecommendationInput } from '../types'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface ErrorBody {
  error?: string
  details?: string[]
}

function friendlyMessage(status: number, body: ErrorBody | null): string {
  const serverMessage = body?.error
  switch (status) {
    case 400:
      return serverMessage
        ? `Invalid input: ${serverMessage}`
        : 'Please check your stats and try again.'
    case 401:
      return 'Your session has expired. Please log in again.'
    case 429:
      return 'Too many requests. Please wait a bit before generating another plan.'
    case 502:
      return 'The AI service is temporarily unavailable. Please try again in a moment.'
    default:
      return serverMessage ?? 'Something went wrong. Please try again.'
  }
}

export async function fetchRecommendation(input: RecommendationInput): Promise<Recommendation> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new ApiError(401, 'You must be logged in to generate a plan.')
  }

  const apiUrl = import.meta.env.VITE_API_URL
  const res = await fetch(`${apiUrl}/api/recommend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(input),
  })

  if (res.status === 401) {
    await supabase.auth.signOut()
    throw new ApiError(401, 'Your session has expired. Please log in again.')
  }

  if (!res.ok) {
    let body: ErrorBody | null = null
    try {
      body = (await res.json()) as ErrorBody
    } catch {
      // Response wasn't JSON; fall back to a generic message.
    }
    throw new ApiError(res.status, friendlyMessage(res.status, body))
  }

  const data = (await res.json()) as { recommendation: Recommendation }
  return data.recommendation
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new ApiError(401, 'You must be logged in to chat.')
  }

  const apiUrl = import.meta.env.VITE_API_URL
  const res = await fetch(`${apiUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ messages }),
  })

  if (res.status === 401) {
    await supabase.auth.signOut()
    throw new ApiError(401, 'Your session has expired. Please log in again.')
  }

  if (!res.ok) {
    let body: ErrorBody | null = null
    try {
      body = (await res.json()) as ErrorBody
    } catch {
      // Response wasn't JSON; fall back to a generic message.
    }
    throw new ApiError(res.status, friendlyMessage(res.status, body))
  }

  const data = (await res.json()) as { reply: string }
  return data.reply
}

export async function sendPublicChatMessage(messages: ChatMessage[]): Promise<string> {
  const apiUrl = import.meta.env.VITE_API_URL
  const res = await fetch(`${apiUrl}/api/chat/public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!res.ok) {
    let body: ErrorBody | null = null
    try {
      body = (await res.json()) as ErrorBody
    } catch {
      // Response wasn't JSON; fall back to a generic message.
    }
    throw new ApiError(res.status, friendlyMessage(res.status, body))
  }

  const data = (await res.json()) as { reply: string }
  return data.reply
}
