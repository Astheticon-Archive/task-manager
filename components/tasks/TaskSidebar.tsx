"use client"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useTaskStore } from "@/lib/store"
import { Task, TaskPriority, TaskStatus } from "@/lib/types"

type Props = {
  open: boolean
  task: Task | null
  onClose: (toastMessage: string | null) => void
}

const priorityOptions: { value: TaskPriority; label: string; bg: string }[] = [
  { value: "LOW", label: "Low", bg: "var(--color-peach-low)" },
  { value: "MEDIUM", label: "Medium", bg: "var(--color-peach-medium)" },
  { value: "HIGH", label: "High", bg: "var(--color-peach)" },
]

export default function TaskSidebar({ open, task, onClose }: Props) {
  const { addTask, updateTask } = useTaskStore()
  const isEditing = !!task

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus>("TODO")
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM")
  const [dueDate, setDueDate] = useState("")
  const [titleError, setTitleError] = useState(false)
  const [visible, setVisible] = useState(false)

  // Sync open → visible with a tick so CSS transition fires
  useEffect(() => {
    if (open) setVisible(true)
  }, [open])

  // Reset / populate form when sidebar opens
  useEffect(() => {
    if (!open) return
    if (isEditing && task) {
      setTitle(task.title)
      setDescription(task.description)
      setStatus(task.status)
      setPriority(task.priority)
      setDueDate(task.dueDate)
    } else {
      setTitle("")
      setDescription("")
      setStatus("TODO")
      setPriority("MEDIUM")
      setDueDate("")
    }
    setTitleError(false)
  }, [open, isEditing, task])

  const handleClose = (msg: string | null = null) => {
    setVisible(false)
    setTimeout(() => onClose(msg), 200)
  }

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError(true)
      return
    }
    if (isEditing && task) {
      updateTask(task.id, { title, description, status, priority, dueDate })
      handleClose("Task updated")
    } else {
      addTask({ title, description, status, priority, dueDate })
      handleClose("Task created")
    }
  }

  if (!open && !visible) return null

  const labelStyle: React.CSSProperties = {
    fontSize: "0.7rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "var(--color-text)",
    opacity: 0.5,
    marginBottom: "0.375rem",
    display: "block",
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="sidebar-overlay"
        style={{ display: visible && open ? "block" : "none" }}
        onClick={() => handleClose(null)}
      />

      {/* Panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(400px, 100vw)",
          backgroundColor: "var(--color-card)",
          borderLeft: "1px solid var(--color-divider)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transform: visible && open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 200ms ease-out",
          boxShadow: "-4px 0 24px var(--color-shadow)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--color-divider)",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontSize: "0.8rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--color-text)",
            }}
          >
            {isEditing ? "Edit Task" : "Add Task"}
          </h2>
          <button
            id="sidebar-close-btn"
            onClick={() => handleClose(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text)",
              opacity: 0.5,
              display: "flex",
              alignItems: "center",
              padding: "0.25rem",
              borderRadius: "4px",
              transition: "opacity 150ms ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.5")}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable form body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Title */}
          <div>
            <label htmlFor="sidebar-title" style={labelStyle}>
              Title <span style={{ color: "var(--color-peach)" }}>*</span>
            </label>
            <input
              id="sidebar-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (e.target.value.trim()) setTitleError(false)
              }}
              placeholder="What needs to be done?"
              className="st-input"
              style={{
                borderColor: titleError ? "var(--color-peach)" : undefined,
              }}
              autoFocus
            />
            {titleError && (
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "var(--color-peach)",
                  marginTop: "0.3rem",
                }}
              >
                Title is required.
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="sidebar-description" style={labelStyle}>
              Description
            </label>
            <textarea
              id="sidebar-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              className="st-input"
              style={{ resize: "none" }}
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="sidebar-status" style={labelStyle}>
              Status
            </label>
            <div className="st-select-wrapper">
              <select
                id="sidebar-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="st-input"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          {/* Priority — 3-box selector */}
          <div>
            <span style={labelStyle}>Priority</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
              {priorityOptions.map((opt) => {
                const selected = priority === opt.value
                return (
                  <button
                    key={opt.value}
                    id={`priority-btn-${opt.value}`}
                    onClick={() => setPriority(opt.value)}
                    style={{
                      backgroundColor: opt.bg,
                      border: selected
                        ? "2px solid var(--color-peach)"
                        : "1px solid var(--color-divider)",
                      borderRadius: "8px",
                      padding: "0.6rem 0",
                      fontSize: "0.78rem",
                      fontWeight: selected ? 700 : 500,
                      color: "var(--color-text)",
                      cursor: "pointer",
                      transition: "border-color 150ms ease, font-weight 150ms ease",
                      textAlign: "center",
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="sidebar-due-date" style={labelStyle}>
              Due Date
            </label>
            <input
              id="sidebar-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="st-input"
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            padding: "1rem 1.5rem",
            borderTop: "1px solid var(--color-divider)",
            flexShrink: 0,
          }}
        >
          <button
            id="sidebar-cancel-btn"
            onClick={() => handleClose(null)}
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid var(--color-divider)",
              backgroundColor: "var(--color-card)",
              color: "var(--color-text)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "border-color 150ms ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--color-peach)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--color-divider)")
            }
          >
            Cancel
          </button>
          <button
            id="sidebar-save-btn"
            onClick={handleSave}
            style={{
              flex: 2,
              padding: "0.6rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--color-peach)",
              color: "#FFFFFF",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "background-color 150ms ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-peach-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-peach)")
            }
          >
            {isEditing ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </aside>
    </>
  )
}
