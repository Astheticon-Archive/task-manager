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

  const stats = [
    { label: "Total", value: total },
    { label: "To Do", value: todo },
    { label: "In Progress", value: inProgress },
    { label: "Done", value: done },
  ]

  return (
    <header className="border-b border-[var(--color-divider)]">
      <div className="max-w-[900px] mx-auto px-6 py-5">
        
        {/* ── Desktop & Tablet Layout (>= 640px) ── */}
        <div className="hidden sm:flex w-full items-center">
          
          {/* Left: Branding */}
          <div className="shrink-0">
            <h1 className="text-[1.125rem] font-[800] tracking-[0.08em] uppercase text-[var(--color-text)] leading-[1.2]">
              Simple Tasker
            </h1>
            <p className="text-[0.75rem] text-[var(--color-text)] opacity-50 mt-[0.2rem]">
              Get things done with minimal fuss.
            </p>
          </div>

          {/* Center: Counters */}
          <div className="flex-1 overflow-hidden flex justify-center px-4">
            <div className="flex items-center overflow-x-auto scrollbar-none">
              {stats.map((item, i) => (
                <div key={item.label} className="flex items-center">
                  <div className="shrink-0 min-w-[52px] lg:min-w-[64px] flex flex-col items-center text-center">
                    <span 
                      suppressHydrationWarning 
                      className="text-[1.5rem] font-[700] text-[var(--color-peach)] leading-none"
                    >
                      {item.value}
                    </span>
                    <span className="text-[0.65rem] font-[500] uppercase tracking-[0.06em] text-[var(--color-text)] opacity-50 mt-[0.2rem] whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                  {/* Divider */}
                  {i < stats.length - 1 && (
                    <div className="shrink-0 w-[1px] h-[32px] bg-[var(--color-divider)] mx-3 lg:mx-5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onNewTask}
              className="shrink-0 bg-[var(--color-peach)] text-[#FFFFFF] rounded-[8px] px-3 lg:px-5 py-2 text-[0.8rem] font-[700] tracking-[0.06em] uppercase flex items-center gap-[0.4rem] whitespace-nowrap transition-colors hover:bg-[var(--color-peach-hover)]"
            >
              <Plus size={14} strokeWidth={2.5} />
              New Task
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              suppressHydrationWarning
              className="shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-[6px] text-[var(--color-text)] opacity-70 hover:opacity-100 transition-opacity relative"
            >
              <Sun size={18} strokeWidth={2} style={{ position: "absolute", opacity: isDark ? 1 : 0, transition: "opacity 150ms ease" }} />
              <Moon size={18} strokeWidth={2} style={{ position: "absolute", opacity: isDark ? 0 : 1, transition: "opacity 150ms ease" }} />
            </button>
          </div>

        </div>

        {/* ── Mobile Layout (< 640px) ── */}
        <div className="flex flex-col sm:hidden gap-6">
          
          {/* Row 1: Branding & Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[1.125rem] font-[800] tracking-[0.08em] uppercase text-[var(--color-text)] leading-[1.2]">
                Simple Tasker
              </h1>
              <p className="text-[0.75rem] text-[var(--color-text)] opacity-50 mt-[0.2rem]">
                Get things done with minimal fuss.
              </p>
            </div>
            
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              suppressHydrationWarning
              className="shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-[6px] text-[var(--color-text)] opacity-70 active:opacity-100 transition-opacity relative"
            >
              <Sun size={18} strokeWidth={2} style={{ position: "absolute", opacity: isDark ? 1 : 0, transition: "opacity 150ms ease" }} />
              <Moon size={18} strokeWidth={2} style={{ position: "absolute", opacity: isDark ? 0 : 1, transition: "opacity 150ms ease" }} />
            </button>
          </div>

          {/* Row 2: Counters Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((item) => (
              <div 
                key={item.label} 
                className="flex flex-col items-center py-3 bg-[var(--color-card)] rounded-[8px] border border-[var(--color-divider)]"
              >
                <span 
                  suppressHydrationWarning 
                  className="text-[1.5rem] font-[700] text-[var(--color-peach)] leading-none"
                >
                  {item.value}
                </span>
                <span className="text-[0.65rem] font-[500] uppercase tracking-[0.06em] text-[var(--color-text)] opacity-50 mt-[0.2rem]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Row 3: New Task */}
          <button
            onClick={onNewTask}
            className="w-full bg-[var(--color-peach)] text-[#FFFFFF] rounded-[8px] py-3 text-[0.8rem] font-[700] tracking-[0.06em] uppercase flex items-center justify-center gap-[0.4rem] transition-colors active:bg-[var(--color-peach-hover)]"
          >
            <Plus size={16} strokeWidth={2.5} />
            New Task
          </button>

        </div>

      </div>
    </header>
  )
}
