import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'

type ChatRole = 'user' | 'assistant' | 'error'

type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/chat'

const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = localStorage.getItem('chatLog')
    if (!stored) return []
    try {
      return JSON.parse(stored) as ChatMessage[]
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem('chatLog', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading])

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMessage: ChatMessage = { id: createId(), role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const assistantMessage: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content: data?.reply ?? 'No response received.',
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error fetching chat response:', error)
      const errorMessage: ChatMessage = {
        id: createId(),
        role: 'error',
        content: 'Sorry, something went wrong. Please try again.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const hasMessages = messages.length > 0

  const headerStatus = useMemo(
    () => (loading ? 'Thinking...' : hasMessages ? 'Ready' : 'Ask me anything'),
    [loading, hasMessages],
  )

  return (
    <div className="min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[360px,1fr]">
        <aside className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-950 font-semibold">
              AI
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-muted">Simple chatbot</p>
              <p className="text-lg font-semibold text-white">FastAPI + React</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Chat with the backend at{' '}
            <span className="font-medium text-emerald-300">{API_URL}</span>. Your messages stay in
            this browser until you clear them.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Tips</p>
              <ul className="mt-2 space-y-1 text-slate-200">
                <li>• Shift+Enter for new lines.</li>
                <li>• Responses stream after submit.</li>
                <li>• Use the backend `.env` to switch providers.</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setMessages([])}
              className="w-full rounded-xl border border-slate-800 bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-300 hover:text-white hover:shadow-[0_10px_30px_-18px_rgba(16,185,129,0.6)] focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            >
              Clear conversation
            </button>
          </div>
        </aside>

        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl backdrop-blur">
          <div className="border-b border-slate-800 px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-3 w-3 rounded-full ${loading ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}
                />
                <div>
                  <p className="text-sm font-semibold text-white">Assistant</p>
                  <p className="text-xs text-muted">{headerStatus}</p>
                </div>
              </div>
              <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                Tailwind + Vite + TS
              </span>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto px-6 py-6 sm:max-h-[72vh]"
          >
            {!hasMessages && (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-300">
                Start a conversation to see replies from the API.
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-900'
                      : message.role === 'assistant'
                        ? 'bg-slate-800/80 text-slate-100 border border-slate-700'
                        : 'bg-rose-500/15 text-rose-100 border border-rose-300/40'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                  <span className="h-2.5 w-2.5 animate-ping rounded-full bg-emerald-300" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <textarea
                rows={1}
                name="message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder="Ask anything about your data or code..."
                className="min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Sending' : 'Send'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

export default App
