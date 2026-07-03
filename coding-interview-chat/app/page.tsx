"use client"

import { useState } from "react"
import { TopicSidebar } from "@/components/topic-sidebar"
import { ChatWindow } from "@/components/chat-window"
import type { Topic } from "@/lib/tutor-data"

export default function Page() {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null)

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <TopicSidebar
        activeTopicId={activeTopic?.id ?? null}
        onSelectTopic={setActiveTopic}
      />
      <ChatWindow activeTopic={activeTopic} />
    </main>
  )
}
