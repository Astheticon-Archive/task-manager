"use client"
import { useTaskStore } from "@/lib/store"
import TaskCard from "./TaskCard"
import { ClipboardList } from "lucide-react"

export default function TaskList() {
  const getFilteredTasks = useTaskStore((s) => s.getFilteredTasks)
  const tasks = getFilteredTasks()

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-4 border-t border-dashed border-gray-200 mt-4">
        <ClipboardList className="h-8 w-8 text-gray-300" strokeWidth={1.5} />
        <p className="text-sm font-medium">No tasks found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col border-t border-gray-100">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
