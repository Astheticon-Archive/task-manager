"use client"
import { useState } from "react"
import { useTaskStore } from "@/lib/store"
import TaskList from "@/components/tasks/TaskList"
import TaskFilters from "@/components/tasks/TaskFilters"
import TaskForm from "@/components/tasks/TaskForm"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Home() {
  const [createOpen, setCreateOpen] = useState(false)
  const tasks = useTaskStore((s) => s.tasks)

  const todo = tasks.filter((t) => t.status === "TODO").length
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length
  const done = tasks.filter((t) => t.status === "DONE").length

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Task Manager</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              {tasks.length} total &middot; <span className="text-slate-700">{todo} to do</span> &middot; <span className="text-blue-600">{inProgress} in progress</span> &middot; <span className="text-green-600">{done} done</span>
            </p>
          </div>
          <Button variant="ghost" onClick={() => setCreateOpen(true)} className="gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">New Task</span>
            <span className="sm:hidden font-medium">New</span>
          </Button>
        </div>

        <TaskFilters />
        
        <div className="pt-2">
          <TaskList />
        </div>
      </div>

      <TaskForm open={createOpen} onClose={() => setCreateOpen(false)} />
    </main>
  )
}
