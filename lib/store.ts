import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Task, TaskStatus, TaskPriority } from "./types"
import { generateId } from "./utils"

type FilterState = {
  status: TaskStatus | "ALL"
  priority: TaskPriority | "ALL"
}

type TaskStore = {
  tasks: Task[]
  filters: FilterState
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => void
  deleteTask: (id: string) => void
  setFilter: (filters: Partial<FilterState>) => void
  getFilteredTasks: () => Task[]
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      filters: {
        status: "ALL",
        priority: "ALL",
      },
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ tasks: [newTask, ...state.tasks] }))
      },
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }))
      },
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },
      setFilter: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }))
      },
      getFilteredTasks: () => {
        const { tasks, filters } = get()
        return tasks.filter((task) => {
          const statusMatch = filters.status === "ALL" || task.status === filters.status
          const priorityMatch = filters.priority === "ALL" || task.priority === filters.priority
          return statusMatch && priorityMatch
        })
      },
    }),
    {
      name: "task-manager-storage",
    }
  )
)
