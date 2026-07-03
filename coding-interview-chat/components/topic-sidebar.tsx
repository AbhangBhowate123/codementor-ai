"use client"

import { CheckCircle2, Circle, CircleDot, GraduationCap } from "lucide-react"
import { topicGroups, type Topic, type TopicStatus } from "@/lib/tutor-data"
import { cn } from "@/lib/utils"

const statusConfig: Record<
  TopicStatus,
  { icon: typeof Circle; className: string; label: string }
> = {
  mastered: {
    icon: CheckCircle2,
    className: "text-primary",
    label: "Mastered",
  },
  "in-progress": {
    icon: CircleDot,
    className: "text-chart-4",
    label: "In progress",
  },
  "not-started": {
    icon: Circle,
    className: "text-muted-foreground/50",
    label: "Not started",
  },
}

function TopicRow({
  topic,
  active,
  onSelect,
}: {
  topic: Topic
  active: boolean
  onSelect: (topic: Topic) => void
}) {
  const config = statusConfig[topic.status]
  const Icon = config.icon

  return (
    <button
      type="button"
      onClick={() => onSelect(topic)}
      aria-current={active ? "true" : undefined}
      className={cn(
        "group flex w-full flex-col gap-2 rounded-lg px-3 py-2.5 text-left transition-colors",
        active
          ? "bg-sidebar-accent"
          : "hover:bg-sidebar-accent/60",
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={cn("size-4 shrink-0", config.className)} aria-hidden />
        <span className="flex-1 truncate text-sm font-medium text-sidebar-foreground">
          {topic.name}
        </span>
        <span className="text-xs tabular-nums text-muted-foreground">
          {topic.problemsSolved}/{topic.totalProblems}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-sidebar-border">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${topic.progress}%` }}
        />
      </div>
    </button>
  )
}

export function TopicSidebar({
  activeTopicId,
  onSelectTopic,
}: {
  activeTopicId: string | null
  onSelectTopic: (topic: Topic) => void
}) {
  const allTopics = topicGroups.flatMap((g) => g.topics)
  const mastered = allTopics.filter((t) => t.status === "mastered").length
  const totalSolved = allTopics.reduce((sum, t) => sum + t.problemsSolved, 0)

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="size-5" aria-hidden />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-sidebar-foreground">
            Interview Tutor
          </span>
          <span className="text-xs text-muted-foreground">
            Coding prep, guided
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4 py-4">
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2.5">
          <p className="text-lg font-semibold tabular-nums text-sidebar-foreground">
            {totalSolved}
          </p>
          <p className="text-xs text-muted-foreground">Problems solved</p>
        </div>
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2.5">
          <p className="text-lg font-semibold tabular-nums text-sidebar-foreground">
            {mastered}
          </p>
          <p className="text-xs text-muted-foreground">Topics mastered</p>
        </div>
      </div>

      <nav
        aria-label="Topics studied"
        className="flex-1 space-y-5 overflow-y-auto px-3 pb-6"
      >
        {topicGroups.map((group) => (
          <div key={group.category}>
            <h2 className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.category}
            </h2>
            <div className="space-y-0.5">
              {group.topics.map((topic) => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  active={topic.id === activeTopicId}
                  onSelect={onSelectTopic}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
