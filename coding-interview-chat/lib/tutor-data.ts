export type TopicStatus = "mastered" | "in-progress" | "not-started"

export type Topic = {
  id: string
  name: string
  category: string
  status: TopicStatus
  progress: number
  problemsSolved: number
  totalProblems: number
}

export type TopicGroup = {
  category: string
  topics: Topic[]
}

export type ChatRole = "user" | "tutor"

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  timestamp: string
}

export const topicGroups: TopicGroup[] = [
  {
    category: "Data Structures",
    topics: [
      {
        id: "arrays",
        name: "Arrays & Hashing",
        category: "Data Structures",
        status: "mastered",
        progress: 100,
        problemsSolved: 24,
        totalProblems: 24,
      },
      {
        id: "linked-lists",
        name: "Linked Lists",
        category: "Data Structures",
        status: "in-progress",
        progress: 60,
        problemsSolved: 9,
        totalProblems: 15,
      },
      {
        id: "trees",
        name: "Trees & Tries",
        category: "Data Structures",
        status: "in-progress",
        progress: 40,
        problemsSolved: 8,
        totalProblems: 20,
      },
      {
        id: "heaps",
        name: "Heaps & Priority Queues",
        category: "Data Structures",
        status: "not-started",
        progress: 0,
        problemsSolved: 0,
        totalProblems: 12,
      },
    ],
  },
  {
    category: "Algorithms",
    topics: [
      {
        id: "two-pointers",
        name: "Two Pointers",
        category: "Algorithms",
        status: "mastered",
        progress: 100,
        problemsSolved: 10,
        totalProblems: 10,
      },
      {
        id: "sliding-window",
        name: "Sliding Window",
        category: "Algorithms",
        status: "in-progress",
        progress: 70,
        problemsSolved: 7,
        totalProblems: 10,
      },
      {
        id: "binary-search",
        name: "Binary Search",
        category: "Algorithms",
        status: "in-progress",
        progress: 50,
        problemsSolved: 6,
        totalProblems: 12,
      },
      {
        id: "dynamic-programming",
        name: "Dynamic Programming",
        category: "Algorithms",
        status: "not-started",
        progress: 0,
        problemsSolved: 0,
        totalProblems: 25,
      },
      {
        id: "graphs",
        name: "Graph Traversal",
        category: "Algorithms",
        status: "not-started",
        progress: 0,
        problemsSolved: 0,
        totalProblems: 18,
      },
    ],
  },
  {
    category: "System Design",
    topics: [
      {
        id: "fundamentals",
        name: "Scalability Fundamentals",
        category: "System Design",
        status: "in-progress",
        progress: 30,
        problemsSolved: 3,
        totalProblems: 10,
      },
      {
        id: "caching",
        name: "Caching & CDNs",
        category: "System Design",
        status: "not-started",
        progress: 0,
        problemsSolved: 0,
        totalProblems: 8,
      },
    ],
  },
]

export const initialMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "tutor",
    content:
      "Hey! I'm your coding interview tutor. I noticed you've been crushing Arrays & Hashing — nice work. Want to keep building momentum on Linked Lists, or tackle something new today?",
    timestamp: "9:24 AM",
  },
  {
    id: "m2",
    role: "user",
    content:
      "Let's do Linked Lists. I always get tripped up reversing one in place.",
    timestamp: "9:25 AM",
  },
  {
    id: "m3",
    role: "tutor",
    content:
      "Great choice — reversing a linked list in place is a classic. The key insight is using three pointers: `prev`, `curr`, and `next`. You walk through the list once, flipping each node's pointer backward. Want to try writing the loop yourself first, or should I walk you through the intuition step by step?",
    timestamp: "9:25 AM",
  },
]

export const suggestedPrompts: string[] = [
  "Explain the sliding window technique",
  "Give me a medium binary search problem",
  "Review my time complexity analysis",
  "Quiz me on tree traversals",
]
