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
  searchQuery: string
  sortBy: "dueDate" | "priority" | "createdAt"
  _hasHydrated: boolean
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => void
  deleteTask: (id: string) => void
  setFilter: (filters: Partial<FilterState>) => void
  setSearch: (query: string) => void
  setSort: (sort: "dueDate" | "priority" | "createdAt") => void
  setHasHydrated: (state: boolean) => void
  getFilteredTasks: () => Task[]
}

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      filters: {
        status: "ALL",
        priority: "ALL",
      },
      searchQuery: "",
      sortBy: "createdAt",
      _hasHydrated: false,
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
      setSearch: (query) => {
        set({ searchQuery: query })
      },
      setSort: (sort) => {
        set({ sortBy: sort })
      },
      setHasHydrated: (state) => {
        set({ _hasHydrated: state })
      },
      getFilteredTasks: () => {
        const { tasks, filters, searchQuery, sortBy } = get()

        let result = tasks.filter((task) => {
          const statusMatch =
            filters.status === "ALL" || task.status === filters.status
          const priorityMatch =
            filters.priority === "ALL" || task.priority === filters.priority
          const q = searchQuery.trim().toLowerCase()
          const searchMatch =
            !q ||
            task.title.toLowerCase().includes(q) ||
            task.description.toLowerCase().includes(q)
          return statusMatch && priorityMatch && searchMatch
        })

        result = [...result].sort((a, b) => {
          if (sortBy === "priority") {
            return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
          }
          if (sortBy === "dueDate") {
            if (!a.dueDate && !b.dueDate) return 0
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          }
          // createdAt: newest first
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

        return result
      },
    }),
    {
      name: "task-manager-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
