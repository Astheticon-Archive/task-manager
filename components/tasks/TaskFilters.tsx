"use client"
import { useTaskStore } from "@/lib/store"
import { TaskStatus, TaskPriority } from "@/lib/types"

const statusOptions: { label: string; value: TaskStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "To Do", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
]

const priorityOptions: { label: string; value: TaskPriority | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
]

export default function TaskFilters() {
  const { filters, setFilter } = useTaskStore()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-2">
      {/* Status tabs */}
      <div className="flex items-center gap-1 -ml-2">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter({ status: opt.value })}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              filters.status === opt.value
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-slate-500 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Priority pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mr-1">Priority</span>
        {priorityOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter({ priority: opt.value })}
            className={`px-2 py-1 text-xs font-medium rounded-full border transition-colors ${
              filters.priority === opt.value
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
