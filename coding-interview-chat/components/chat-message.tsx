import { GraduationCap, User } from "lucide-react"
import type { ChatMessage as ChatMessageType } from "@/lib/tutor-data"
import { cn } from "@/lib/utils"

function renderContent(content: string) {
  // Render inline `code` spans with monospace styling.
  const parts = content.split(/(`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-[0.85em] text-primary"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isTutor = message.role === "tutor"

  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isTutor ? "justify-start" : "justify-end",
      )}
    >
      {isTutor && (
        <div
          className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          aria-hidden
        >
          <GraduationCap className="size-4" />
        </div>
      )}

      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-1",
          isTutor ? "items-start" : "items-end",
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isTutor
              ? "rounded-tl-sm bg-card text-card-foreground"
              : "rounded-tr-sm bg-primary text-primary-foreground",
          )}
        >
          <p className="text-pretty">{renderContent(message.content)}</p>
        </div>
        <span className="px-1 text-xs text-muted-foreground">
          {isTutor ? "Tutor" : "You"} · {message.timestamp}
        </span>
      </div>

      {!isTutor && (
        <div
          className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
          aria-hidden
        >
          <User className="size-4" />
        </div>
      )}
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex w-full gap-3">
      <div
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        aria-hidden
      >
        <GraduationCap className="size-4" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-card px-4 py-4">
        <span className="sr-only">Tutor is typing</span>
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </div>
  )
}
