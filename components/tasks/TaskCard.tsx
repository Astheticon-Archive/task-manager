"use client"
import { useState } from "react"
import { Task } from "@/lib/types"
import { useTaskStore } from "@/lib/store"
import { formatDate, isOverdue } from "@/lib/utils"
import { Pencil, Trash2 } from "lucide-react"

const statusLabels: Record<Task["status"], string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
}

const statusPillStyle: Record<Task["status"], React.CSSProperties> = {
  TODO: {
    backgroundColor: "var(--color-peach-low)",
    color: "var(--color-peach-hover)",
    border: "1px solid var(--color-peach-medium)",
  },
  IN_PROGRESS: {
    backgroundColor: "var(--color-peach-medium)",
    color: "var(--color-peach-hover)",
    border: "1px solid var(--color-peach)",
  },
  DONE: {
    backgroundColor: "var(--color-peach)",
    color: "#FFFFFF",
    border: "none",
  },
}

const priorityPillStyle: Record<Task["priority"], React.CSSProperties> = {
  LOW: {
    backgroundColor: "var(--color-peach-low)",
    color: "var(--color-text)",
    opacity: 0.85,
    border: "1px solid var(--color-divider)",
  },
  MEDIUM: {
    backgroundColor: "var(--color-peach-medium)",
    color: "var(--color-text)",
    border: "1px solid var(--color-peach-medium)",
  },
  HIGH: {
    backgroundColor: "var(--color-peach)",
    color: "#FFFFFF",
    border: "none",
  },
}

type Props = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const { updateTask } = useTaskStore()
  const [hovered, setHovered] = useState(false)
  const overdue = isOverdue(task.dueDate) && task.status !== "DONE"
  const isDone = task.status === "DONE"

  const toggleStatus = () => {
    updateTask(task.id, {
      status: isDone ? "TODO" : "DONE",
    })
  }

  return (
    <div
      style={{ position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.875rem",
          padding: "0.875rem 1rem",
          backgroundColor: "var(--color-card)",
          borderRadius: "10px",
          border: "1px solid var(--color-divider)",
          cursor: "default",
          transition: "box-shadow 200ms ease, transform 200ms ease",
          boxShadow: hovered
            ? "0 4px 12px var(--color-shadow)"
            : "0 1px 3px transparent",
          transform: hovered ? "translateY(-1px)" : "translateY(0)",
          opacity: isDone ? 0.6 : 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Overdue stripe pseudo-element — rendered as inline div */}
        {overdue && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "30%",
              background: `repeating-linear-gradient(
                45deg,
                var(--color-peach-low) 0px,
                var(--color-peach-low) 4px,
                var(--color-card) 4px,
                var(--color-card) 12px
              )`,
              pointerEvents: "none",
              opacity: 0.7,
            }}
          />
        )}

        {/* ── Checkbox ── */}
        <button
          id={`task-checkbox-${task.id}`}
          onClick={toggleStatus}
          aria-label={isDone ? "Mark as to do" : "Mark as done"}
          style={{
            flexShrink: 0,
            width: "20px",
            height: "20px",
            borderRadius: "5px",
            border: isDone ? "none" : "1.5px solid var(--color-divider)",
            backgroundColor: isDone ? "var(--color-peach)" : "var(--color-card)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 150ms ease, border-color 150ms ease",
            zIndex: 1,
          }}
        >
          {isDone && (
            <svg
              width="11"
              height="9"
              viewBox="0 0 11 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4L4 7L10 1"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* ── Center: Task Info ── */}
        <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span
              style={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--color-text)",
                textDecoration: isDone ? "line-through" : "none",
                transition: "text-decoration 150ms ease",
                wordBreak: "break-word",
              }}
            >
              {task.title}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              marginTop: "0.35rem",
              flexWrap: "wrap",
            }}
          >
            {/* Status pill */}
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                padding: "0.15rem 0.55rem",
                borderRadius: "9999px",
                letterSpacing: "0.03em",
                ...statusPillStyle[task.status],
              }}
            >
              {statusLabels[task.status]}
            </span>

            {/* Priority pill */}
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                padding: "0.15rem 0.55rem",
                borderRadius: "9999px",
                letterSpacing: "0.03em",
                ...priorityPillStyle[task.priority],
              }}
            >
              {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
            </span>

            {/* Due date — small, below pills on mobile */}
            {task.dueDate && (
              <span
                suppressHydrationWarning
                style={{
                  fontSize: "0.7rem",
                  opacity: overdue ? 1 : 0.45,
                  fontWeight: overdue ? 600 : 400,
                  color: overdue ? "var(--color-peach-hover)" : "var(--color-text)",
                }}
              >
                {overdue ? "⚠ " : ""}
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* ── Right: Due date (desktop) + hover actions ── */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Actions: fade in on hover */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.125rem",
              opacity: hovered ? 1 : 0,
              transition: "opacity 200ms ease",
              pointerEvents: hovered ? "auto" : "none",
            }}
          >
            <button
              id={`edit-task-${task.id}`}
              onClick={() => onEdit(task)}
              aria-label="Edit task"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text)",
                opacity: 0.6,
                padding: "0.3rem",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                transition: "color 150ms ease, opacity 150ms ease",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.color = "var(--color-peach)"
                btn.style.opacity = "1"
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.color = "var(--color-text)"
                btn.style.opacity = "0.6"
              }}
            >
              <Pencil size={14} strokeWidth={2} />
            </button>

            <button
              id={`delete-task-${task.id}`}
              onClick={() => onDelete(task.id)}
              aria-label="Delete task"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text)",
                opacity: 0.6,
                padding: "0.3rem",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                transition: "color 150ms ease, opacity 150ms ease",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.color = "var(--color-peach)"
                btn.style.opacity = "1"
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.color = "var(--color-text)"
                btn.style.opacity = "0.6"
              }}
            >
              <Trash2 size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
