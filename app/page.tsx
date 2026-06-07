"use client"
import { useCallback, useState } from "react"
import { useTaskStore } from "@/lib/store"
import { Task } from "@/lib/types"
import Header from "@/components/tasks/Header"
import TaskFilters from "@/components/tasks/TaskFilters"
import TaskList from "@/components/tasks/TaskList"
import TaskSidebar from "@/components/tasks/TaskSidebar"
import Toast from "@/components/ui/Toast"

export default function Home() {
  const { deleteTask } = useTaskStore()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const openNewTask = useCallback(() => {
    setEditTask(null)
    setSidebarOpen(true)
  }, [])

  const openEditTask = useCallback((task: Task) => {
    setEditTask(task)
    setSidebarOpen(true)
  }, [])

  const handleSidebarClose = useCallback((message: string | null) => {
    setSidebarOpen(false)
    if (message) {
      // Wait for sidebar slide-out to complete before showing toast
      setTimeout(() => setToast(message), 300)
    }
  }, [])

  const handleDelete = useCallback(
    (id: string) => {
      deleteTask(id)
      setTimeout(() => setToast("Task deleted"), 100)
    },
    [deleteTask]
  )

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <Header onNewTask={openNewTask} />

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "1.5rem 1.5rem 6rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <TaskFilters />

        <TaskList onEdit={openEditTask} onDelete={handleDelete} />
      </div>

      <TaskSidebar
        open={sidebarOpen}
        task={editTask}
        onClose={handleSidebarClose}
      />

      <Toast message={toast} onDone={() => setToast(null)} />
    </main>
  )
}
