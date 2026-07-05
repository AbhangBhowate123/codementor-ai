"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles } from "lucide-react"
import {
  initialMessages,
  suggestedPrompts,
  type ChatMessage as ChatMessageType,
  type Topic,
} from "@/lib/tutor-data"
import { ChatMessage, TypingIndicator } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

export function ChatWindow({ activeTopic }: { activeTopic: Topic | null }) {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string>("student_1")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isTyping])

  function handleSend(text: string) {
    // 1. Add user message immediately
    const userMessage: ChatMessageType = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: formatTime(new Date()),
    }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // 2. Call backend
    const sendMessage = async () => {
      try {
        const payloadMessage = activeTopic
          ? `[Topic: ${activeTopic.name}] ${text}`
          : text

        const res = await fetch("https://codementor-ai-production-627e.up.railway.app/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: payloadMessage, user_id: sessionId }),
        })

        const data = await res.json().catch(() => ({ reply: "Could not parse response." }))

        if (!res.ok) throw new Error(data.reply || "Server error")

        // 3. Add tutor reply
        setMessages(prev => [...prev, {
          id: `t-${Date.now()}`,
          role: "tutor",
          content: data.reply ?? "No reply received.",
          timestamp: formatTime(new Date()),
        }])

      } catch (error) {
        const msg = error instanceof Error ? error.message : "Could not connect to backend."
        setMessages(prev => [...prev, {
          id: `t-${Date.now()}`,
          role: "tutor",
          content: `Error: ${msg}`,
          timestamp: formatTime(new Date()),
        }])
      } finally {
        setIsTyping(false)
      }
    }

    sendMessage().catch(() => { })
  }

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-base font-semibold text-foreground">
            {activeTopic ? activeTopic.name : "Practice Session"}
          </h1>
          <p className="truncate text-xs text-muted-foreground">
            {activeTopic
              ? `${activeTopic.category} · ${activeTopic.progress}% complete`
              : "Ask anything — concepts, problems, or code review"}
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="size-2 rounded-full bg-primary" aria-hidden />
          Online
        </span>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6" aria-live="polite">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </div>

      <div className="border-t border-border px-6 py-4">
        <div className="mx-auto max-w-3xl space-y-3">
          {messages.length <= initialMessages.length && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="size-3.5" aria-hidden />
                Try
              </span>
              {suggestedPrompts.map(prompt => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-card-foreground transition-colors hover:border-primary/60 hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </section>
  )
}