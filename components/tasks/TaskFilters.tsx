"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTaskStore } from "@/lib/store"
import { TaskStatus, TaskPriority } from "@/lib/types"

const statusOptions: { label: string; value: TaskStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "To Do", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
]

const priorityOptions: { label: string; value: TaskPriority | "ALL"; bg: string; activeBg: string }[] = [
  { label: "All", value: "ALL", bg: "transparent", activeBg: "var(--color-peach-low)" },
  { label: "Low", value: "LOW", bg: "transparent", activeBg: "var(--color-peach-low)" },
  { label: "Medium", value: "MEDIUM", bg: "transparent", activeBg: "var(--color-peach-medium)" },
  { label: "High", value: "HIGH", bg: "transparent", activeBg: "var(--color-peach)" },
]

const sortOptions = [
  { label: "Created At", value: "createdAt" as const },
  { label: "Due Date", value: "dueDate" as const },
  { label: "Priority", value: "priority" as const },
]

export default function TaskFilters() {
  const { filters, setFilter, searchQuery, setSearch, sortBy, setSort } =
    useTaskStore()
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = useCallback(
    (value: string) => {
      setLocalSearch(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        setSearch(value)
      }, 200)
    },
    [setSearch]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "0 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {/* ── Row 1: Status Tabs ── */}
      <div
        className="scrollbar-none"
        style={{
          display: "flex",
          gap: "0.375rem",
          overflowX: "auto",
          paddingBottom: "0.125rem",
        }}
      >
        {statusOptions.map((opt) => {
          const active = filters.status === opt.value
          return (
            <button
              key={opt.value}
              id={`status-filter-${opt.value}`}
              onClick={() => setFilter({ status: opt.value })}
              style={{
                padding: "0.35rem 1rem",
                borderRadius: "9999px",
                border: active
                  ? "1px solid var(--color-peach)"
                  : "1px solid transparent",
                backgroundColor: active ? "var(--color-peach-low)" : "transparent",
                color: active ? "var(--color-peach)" : "var(--color-text)",
                opacity: active ? 1 : 0.6,
                fontSize: "0.8rem",
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 150ms ease",
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* ── Row 2: Priority Pills + Search + Sort ── */}
      <div
        className="scrollbar-none"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          overflowX: "auto",
        }}
      >
        {/* Priority pills */}
        {priorityOptions.map((opt) => {
          const active = filters.priority === opt.value
          return (
            <button
              key={opt.value}
              id={`priority-filter-${opt.value}`}
              onClick={() => setFilter({ priority: opt.value })}
              style={{
                padding: "0.3rem 0.85rem",
                borderRadius: "9999px",
                border: active
                  ? "1px solid var(--color-peach)"
                  : "1px solid var(--color-divider)",
                backgroundColor: active ? opt.activeBg : "transparent",
                color: "var(--color-text)",
                opacity: active ? 1 : 0.6,
                fontSize: "0.75rem",
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 150ms ease",
              }}
            >
              {opt.label}
            </button>
          )
        })}

        {/* Spacer */}
        <div style={{ flex: 1, minWidth: "0.5rem" }} />

        {/* Search */}
        <input
          id="task-search-input"
          type="text"
          placeholder="Search tasks..."
          value={localSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="st-input"
          style={{ width: "180px", flexShrink: 0 }}
        />

        {/* Sort */}
        <div className="st-select-wrapper" style={{ flexShrink: 0 }}>
          <select
            id="task-sort-select"
            value={sortBy}
            onChange={(e) =>
              setSort(e.target.value as "dueDate" | "priority" | "createdAt")
            }
            className="st-input"
            style={{ width: "130px" }}
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
