import { supabase } from './supabaseClient'
import { getLoggingOut } from './logoutFlag'
import type { BillingStatus, ChatMessage, Recommendation, RecommendationInput } from '../types'

export class ApiError extends Error {
  status: number
  code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
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
    if (!getLoggingOut()) {
      await supabase.auth.signOut()
    }
    throw new ApiError(401, 'Your session has expired. Please log in again.')
  }

  if (!res.ok) {
    let body: ErrorBody | null = null
    try {
      body = (await res.json()) as ErrorBody
    } catch {
      // Response wasn't JSON; fall back to a generic message.
    }
    throw new ApiError(res.status, friendlyMessage(res.status, body), body?.error)
  }

  const data = (await res.json()) as { recommendation: Recommendation }
  return data.recommendation
}

export async function getBillingStatus(): Promise<BillingStatus> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new ApiError(401, 'You must be logged in.')

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/billing/status`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  })

  if (!res.ok) throw new ApiError(res.status, 'Failed to load billing status.')
  return (await res.json()) as BillingStatus
}

export async function demoSubscribe(interval: 'month' | 'year'): Promise<BillingStatus> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new ApiError(401, 'You must be logged in.')

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/billing/demo-subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ interval }),
  })

  if (!res.ok) throw new ApiError(res.status, 'Failed to subscribe.')
  return (await res.json()) as BillingStatus
}

export async function demoCancel(): Promise<BillingStatus> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new ApiError(401, 'You must be logged in.')

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/billing/demo-cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}` },
  })

  if (!res.ok) throw new ApiError(res.status, 'Failed to cancel subscription.')
  return (await res.json()) as BillingStatus
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
    if (!getLoggingOut()) {
      await supabase.auth.signOut()
    }
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
