"use client"
import { Sun, Moon, Plus } from "lucide-react"
import { useTheme } from "@/lib/useTheme"
import { useTaskStore } from "@/lib/store"

type Props = {
  onNewTask: () => void
}

export default function Header({ onNewTask }: Props) {
  const { isDark, toggleTheme } = useTheme()
  const tasks = useTaskStore((s) => s.tasks)

  const total = tasks.length
  const todo = tasks.filter((t) => t.status === "TODO").length
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length
  const done = tasks.filter((t) => t.status === "DONE").length

  return (
    <header style={{ borderBottom: "1px solid var(--color-divider)" }}>
      {/* 3-col desktop → 2-col mobile grid */}
      <div className="header-grid max-w-[900px] mx-auto px-6 py-5 grid grid-cols-3 sm:grid-cols-3 gap-4 items-center">

        {/* ── Left: Branding ── */}
        <div className="col-span-1">
          <h1
            style={{
              fontSize: "1.125rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text)",
              lineHeight: 1.2,
            }}
          >
            Simple Tasker
          </h1>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text)",
              opacity: 0.5,
              marginTop: "0.2rem",
            }}
          >
            Get things done with minimal fuss.
          </p>
        </div>

        {/* ── Center: Counters ── */}
        <div className="header-counters col-span-3 sm:col-span-1 grid grid-cols-2 sm:flex items-center">
          {[
            { label: "Total", value: total },
            { label: "To Do", value: todo },
            { label: "In Progress", value: inProgress },
            { label: "Done", value: done },
          ].map((item, i) => (
            <div
              key={item.label}
              className="header-counter-item"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0.5rem 1.25rem",
                borderLeft: i > 0 ? "1px solid var(--color-divider)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--color-peach)",
                  lineHeight: 1,
                }}
                suppressHydrationWarning
              >
                {item.value}
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--color-text)",
                  opacity: 0.5,
                  marginTop: "0.2rem",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Right: Actions ── */}
        <div className="col-span-1 flex items-center justify-end gap-3">
          <button
            id="new-task-btn"
            onClick={onNewTask}
            style={{
              backgroundColor: "var(--color-peach)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1.25rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "background-color 150ms ease",
              whiteSpace: "nowrap",
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
            <Plus size={14} strokeWidth={2.5} />
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">New</span>
          </button>

          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.375rem",
              borderRadius: "6px",
              transition: "opacity 150ms ease",
              opacity: 0.7,
              position: "relative",
              width: "30px",
              height: "30px",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")
            }
            suppressHydrationWarning
          >
            <Sun size={18} strokeWidth={2} style={{ position: "absolute", opacity: isDark ? 1 : 0, transition: "opacity 150ms ease" }} />
            <Moon size={18} strokeWidth={2} style={{ position: "absolute", opacity: isDark ? 0 : 1, transition: "opacity 150ms ease" }} />
          </button>
        </div>
      </div>
    </header>
  )
}
