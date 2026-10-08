import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LogIn, MessageCircle, Send, Trash2, X } from 'lucide-react'
import { useChat, type ChatMode } from './useChat'
import { useAuth } from '../../hooks/useAuth'
import { usePageContext } from '../../hooks/usePageContext'
import { useNavigate } from 'react-router-dom'

const MEMBER_PROMPTS = [
  'How much protein should I eat?',
  'Explain my workout plan',
  'How do I break a weight plateau?',
  'Quick home workout ideas',
]

const PUBLIC_PROMPTS = [
  'What is FitWise?',
  'How does the AI plan work?',
  'Is it free?',
  'Do I need an account?',
  'Is my data private?',
]

const PUBLIC_OPENING = "Hi! I can answer questions about FitWise. What would you like to know?"

export function ChatWidget() {
  const { user, signInWithGoogle, loggingOut } = useAuth()
  const pageContext = usePageContext()
  const navigate = useNavigate()

  const isPublic = pageContext !== 'app'
  const mode: ChatMode = isPublic ? 'public' : 'member'
  const { messages, loading, error, sendMessage, clearChat, retry } = useChat(mode)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [errorDismissed, setErrorDismissed] = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const floatingButtonRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const shouldScrollRef = useRef(true)

  const prompts = isPublic ? PUBLIC_PROMPTS : MEMBER_PROMPTS
  const maxChars = isPublic ? 500 : 1000

  useEffect(() => {
    if (open) {
      textareaRef.current?.focus()
    } else {
      floatingButtonRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (shouldScrollRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading])

  useEffect(() => {
    if (!user) {
      setOpen(false)
      clearChat()
    }
  }, [user, clearChat])

  useEffect(() => {
    setOpen(false)
  }, [mode])

  useEffect(() => {
    if (!isPublic) return
    let dismissed = false
    try {
      dismissed = sessionStorage.getItem('fitwise-teaser-dismissed') === 'true'
    } catch {
      // Ignore.
    }
    if (dismissed) return
    const timer = setTimeout(() => {
      if (!open) setShowTeaser(true)
    }, 6000)
    return () => clearTimeout(timer)
  }, [isPublic, open])

  const handleScroll = () => {
    if (!panelRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = panelRef.current
    shouldScrollRef.current = scrollHeight - scrollTop - clientHeight < 80
  }

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    setInput('')
    setErrorDismissed(false)
    shouldScrollRef.current = true
    await sendMessage(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleRetry = async () => {
    setErrorDismissed(false)
    shouldScrollRef.current = true
    await retry()
  }

  const dismissTeaser = () => {
    setShowTeaser(false)
    try {
      sessionStorage.setItem('fitwise-teaser-dismissed', 'true')
    } catch {
      // Ignore.
    }
  }

  const handleSignIn = async () => {
    setOpen(false)
    if (isPublic) {
      navigate('/login')
    } else {
      await signInWithGoogle()
    }
  }

  if (isPublic && user) return null
  if (!isPublic && !user) return null
  if (loggingOut) return null

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label={isPublic ? 'FitWise Assistant chat' : 'FitWise Coach chat'}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85svh] flex-col overflow-hidden border-t border-ink-800 bg-ink-950 shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-4 sm:max-h-none sm:h-[560px] sm:w-[380px] sm:rounded-2xl sm:border md:bottom-28"
          >
            <div className="flex items-center justify-between border-b border-ink-800 px-4 py-3">
              <h2 className="font-display text-lg font-semibold tracking-wide text-ink-100">
                {isPublic ? 'FitWise Assistant' : 'FitWise Coach'}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  aria-label="Clear chat"
                  className="cursor-pointer rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-100 focus-visible:outline-2 focus-visible:outline-brand-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="cursor-pointer rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-100 focus-visible:outline-2 focus-visible:outline-brand-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={panelRef}
              onScroll={handleScroll}
              aria-live="polite"
              className="flex-1 overflow-y-auto px-4 py-4"
            >
              {isPublic && messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <MessageCircle className="h-10 w-10 text-ink-600" aria-hidden="true" />
                  <p className="text-center text-sm text-ink-400">{PUBLIC_OPENING}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {prompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="cursor-pointer rounded-full border border-ink-700 px-3 py-1.5 text-xs font-medium text-ink-300 transition-colors hover:border-brand-500 hover:text-brand-400 focus-visible:outline-2 focus-visible:outline-brand-500"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {isPublic && messages.length === 0 && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl bg-ink-800 px-4 py-2.5 text-sm leading-relaxed text-ink-100">
                        <p className="whitespace-pre-wrap">{PUBLIC_OPENING}</p>
                      </div>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-brand-500 text-ink-950'
                            : 'bg-ink-800 text-ink-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-ink-800 px-4 py-2.5">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-ink-400" style={{ animationDelay: '0ms' }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-ink-400" style={{ animationDelay: '150ms' }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-ink-400" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {error && !errorDismissed && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl border border-red-900 bg-red-950/50 px-4 py-2.5">
                        <p className="text-sm text-red-200">{error}</p>
                        <button
                          type="button"
                          onClick={handleRetry}
                          className="mt-2 cursor-pointer rounded-lg bg-red-900/50 px-3 py-1 text-xs font-semibold text-red-100 transition-colors hover:bg-red-900 focus-visible:outline-2 focus-visible:outline-red-500"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {isPublic && (
              <div className="border-t border-ink-800 px-4 py-2">
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400 focus-visible:outline-2 focus-visible:outline-brand-500"
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Sign in with Google to get your plan
                </button>
              </div>
            )}

            <div className="border-t border-ink-800 px-4 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
                  onKeyDown={handleKeyDown}
                  placeholder={isPublic ? 'Ask about FitWise...' : 'Ask about your plan...'}
                  rows={1}
                  className="max-h-32 flex-1 resize-none rounded-xl border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="cursor-pointer rounded-xl bg-brand-500 p-2.5 text-ink-950 transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-brand-500"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-ink-500">
                  {isPublic
                    ? 'General info only, not medical advice. Please don\'t share personal details.'
                    : 'General fitness guidance only, not medical advice.'}
                </p>
                {input.length > maxChars - 100 && (
                  <p className="text-xs text-ink-400">
                    {input.length}/{maxChars}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTeaser && !open && (
          <motion.button
            type="button"
            onClick={() => {
              setShowTeaser(false)
              setOpen(true)
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 z-50 flex cursor-pointer items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-medium text-ink-100 shadow-lg transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-brand-500 sm:right-6"
          >
            Questions? Ask me
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                dismissTeaser()
              }}
              aria-label="Dismiss"
              className="cursor-pointer rounded-full p-0.5 text-ink-400 hover:text-ink-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        ref={floatingButtonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={isPublic ? 'Open FitWise Assistant' : 'Open FitWise Coach'}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: open ? 0 : 1, scale: open ? 0.8 : 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-brand-500 text-ink-950 shadow-lg transition-colors hover:bg-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:right-6"
        style={{ marginBottom: 'env(safe-area-inset-bottom)', pointerEvents: open ? 'none' : 'auto' }}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </>
  )
}
