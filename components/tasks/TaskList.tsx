"use client"
import { useTaskStore } from "@/lib/store"
import TaskCard from "./TaskCard"
import { Task } from "@/lib/types"

type Props = {
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const emptyMessages: Record<string, string> = {
  ALL: "No tasks yet. Add your first task.",
  TODO: "Nothing to do. Enjoy the moment.",
  IN_PROGRESS: "Nothing in progress right now.",
  DONE: "No completed tasks yet.",
}

function ClipboardSVG() {
  return (
    <svg
      width="72"
      height="88"
      viewBox="0 0 72 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Clipboard body */}
      <rect
        x="6"
        y="14"
        width="60"
        height="68"
        rx="6"
        fill="var(--color-peach-low)"
        stroke="var(--color-text)"
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />
      {/* Clip at top */}
      <rect x="24" y="8" width="24" height="14" rx="4" fill="var(--color-peach-medium)" />
      {/* Clip border */}
      <rect
        x="24"
        y="8"
        width="24"
        height="14"
        rx="4"
        stroke="var(--color-text)"
        strokeWidth="1.2"
        strokeOpacity="0.2"
        fill="none"
      />
      {/* Task line 1 — with checkmark */}
      <line x1="20" y1="38" x2="52" y2="38" stroke="var(--color-peach)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Checkmark on line 1 */}
      <path
        d="M20 38 L23.5 41.5 L29 35"
        stroke="var(--color-peach-hover)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Task line 2 */}
      <line x1="20" y1="52" x2="52" y2="52" stroke="var(--color-peach)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
      {/* Task line 3 */}
      <line x1="20" y1="64" x2="44" y2="64" stroke="var(--color-peach)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.35" />
    </svg>
  )
}

export default function TaskList({ onEdit, onDelete }: Props) {
  const hasHydrated = useTaskStore((s) => s._hasHydrated)
  const getFilteredTasks = useTaskStore((s) => s.getFilteredTasks)
  const filters = useTaskStore((s) => s.filters)
  const searchQuery = useTaskStore((s) => s.searchQuery)
  const tasks = getFilteredTasks()

  if (!hasHydrated) {
    return <div style={{ minHeight: "200px" }} />
  }

  if (tasks.length === 0) {
    let message = emptyMessages[filters.status] ?? emptyMessages.ALL
    if (searchQuery.trim()) message = "No tasks match your search."
    else if (filters.priority !== "ALL") message = "No tasks match this priority."

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem 1.5rem",
          gap: "1rem",
        }}
      >
        <ClipboardSVG />
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text)",
            opacity: 0.5,
            textAlign: "center",
            maxWidth: "280px",
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
