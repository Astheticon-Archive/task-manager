"use client"
import { useState } from "react"
import { Task } from "@/lib/types"
import { useTaskStore } from "@/lib/store"
import { formatDate, isOverdue } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import TaskForm from "./TaskForm"
import { Pencil, Trash2, CalendarDays, CheckCircle2, Circle } from "lucide-react"

const statusStyles: Record<Task["status"], string> = {
  TODO: "bg-slate-100 text-slate-600 border border-slate-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border border-blue-200",
  DONE: "bg-green-50 text-green-700 border border-green-200",
}

const priorityStyles: Record<Task["priority"], string> = {
  LOW: "bg-green-50 text-green-700 border border-green-200",
  MEDIUM: "bg-amber-50 text-amber-700 border border-amber-200",
  HIGH: "bg-red-50 text-red-700 border border-red-200",
}

const statusLabels: Record<Task["status"], string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
}

type Props = { task: Task }

export default function TaskRow({ task }: Props) {
  const { deleteTask, updateTask } = useTaskStore()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const overdue = isOverdue(task.dueDate) && task.status !== "DONE"

  const toggleStatus = () => {
    updateTask(task.id, { status: task.status === "DONE" ? "TODO" : "DONE" })
  }

  return (
    <>
      <div className="group flex items-start sm:items-center justify-between gap-4 py-3 border-b border-gray-100 hover:bg-slate-50 transition-colors px-2 -mx-2 rounded-md border-l-2 border-l-transparent hover:border-l-blue-400">
        
        <div className="flex items-start sm:items-center gap-3 overflow-hidden">
          <button 
            onClick={toggleStatus} 
            className="mt-0.5 sm:mt-0 shrink-0 text-gray-300 hover:text-gray-500 transition-colors focus:outline-none"
          >
            {task.status === "DONE" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
          
          <div className="flex flex-col min-w-0">
            <span className={`font-medium text-sm truncate ${task.status === "DONE" ? "line-through text-gray-400" : "text-gray-900"}`}>
              {task.title}
            </span>
            {task.description && (
              <span className="text-xs text-gray-500 truncate mt-0.5">
                {task.description}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
              {task.priority}
            </span>
            
            {task.dueDate && (
              <span className={`flex items-center gap-1 text-[11px] ${overdue ? "text-red-500 font-medium" : "text-gray-500"}`}>
                <CalendarDays className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </span>
            )}
            
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[task.status]}`}>
              {statusLabels[task.status]}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-900" onClick={() => setEditOpen(true)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-600" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <TaskForm open={editOpen} onClose={() => setEditOpen(false)} task={task} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">Delete Task?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              &quot;{task.title}&quot; will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-xs font-medium bg-red-600 text-white hover:bg-red-700"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
