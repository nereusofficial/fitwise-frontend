import { useCallback, useEffect, useRef, useState } from 'react'
import { sendChatMessage, sendPublicChatMessage } from '../../lib/api'
import type { ChatMessage } from '../../types'

export type ChatMode = 'member' | 'public'

const STORAGE_KEYS: Record<ChatMode, string> = {
  member: 'fitwise-chat',
  public: 'fitwise-chat-public',
}

const MAX_MESSAGES: Record<ChatMode, number> = {
  member: 20,
  public: 10,
}

const MAX_CHARS: Record<ChatMode, number> = {
  member: 1000,
  public: 500,
}

interface UseChatResult {
  messages: ChatMessage[]
  loading: boolean
  error: string
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
  retry: () => Promise<void>
}

function loadMessages(mode: ChatMode): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS[mode])
    if (!raw) return []
    const parsed = JSON.parse(raw) as ChatMessage[]
    return Array.isArray(parsed) ? parsed.slice(-MAX_MESSAGES[mode]) : []
  } catch {
    return []
  }
}

function saveMessages(mode: ChatMode, messages: ChatMessage[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEYS[mode], JSON.stringify(messages.slice(-MAX_MESSAGES[mode])))
  } catch {
    // Storage full or unavailable; ignore.
  }
}

export function useChat(mode: ChatMode): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages(mode))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const lastUserMessage = useRef<string>('')
  const requestId = useRef(0)

  useEffect(() => {
    saveMessages(mode, messages)
  }, [mode, messages])

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed || loading) return
    if (trimmed.length > MAX_CHARS[mode]) return

    lastUserMessage.current = trimmed
    const userMessage: ChatMessage = { role: 'user', content: trimmed }
    setMessages((prev): ChatMessage[] => [...prev, userMessage].slice(-MAX_MESSAGES[mode]))
    setLoading(true)
    setError('')

    const currentRequestId = ++requestId.current

    try {
      const apiFn = mode === 'member' ? sendChatMessage : sendPublicChatMessage
      const reply = await apiFn([...messages, userMessage].slice(-MAX_MESSAGES[mode]))
      if (currentRequestId !== requestId.current) return
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }].slice(-MAX_MESSAGES[mode]))
    } catch (err) {
      if (currentRequestId !== requestId.current) return
      if (err instanceof Error) {
        if (err.name === 'ApiError') {
          const apiErr = err as unknown as { status: number }
          if (apiErr.status === 429) {
            setError('The assistant is busy, please try again in a bit.')
          } else if (apiErr.status === 503) {
            setError('The assistant is currently unavailable.')
          } else {
            setError(err.message)
          }
        } else {
          setError("Couldn't reach the server.")
        }
      } else {
        setError("Couldn't reach the server.")
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setLoading(false)
      }
    }
  }, [mode, messages, loading])

  const clearChat = useCallback(() => {
    requestId.current++
    setMessages([])
    setError('')
    setLoading(false)
    lastUserMessage.current = ''
    try {
      sessionStorage.removeItem(STORAGE_KEYS[mode])
    } catch {
      // Ignore.
    }
  }, [mode])

  const retry = useCallback(async () => {
    if (!lastUserMessage.current || loading) return
    setError('')
    await sendMessage(lastUserMessage.current)
  }, [loading, sendMessage])

  return { messages, loading, error, sendMessage, clearChat, retry }
}
