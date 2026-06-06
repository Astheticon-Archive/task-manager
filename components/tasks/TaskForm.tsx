"use client"
import { useState } from "react"
import { useTaskStore } from "@/lib/store"
import { Task, TaskStatus, TaskPriority } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
  task?: Task
}

export default function TaskForm({ open, onClose, task }: Props) {
  const { addTask, updateTask } = useTaskStore()
  const isEditing = !!task

  const [title, setTitle] = useState(task?.title ?? "")
  const [description, setDescription] = useState(task?.description ?? "")
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "TODO")
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "MEDIUM")
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "")
  const [error, setError] = useState("")

  function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required.")
      return
    }
    if (isEditing) {
      updateTask(task.id, { title, description, status, priority, dueDate })
    } else {
      addTask({ title, description, status, priority, dueDate })
    }
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{isEditing ? "Edit Task" : "New Task"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title" className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError("") }}
              placeholder="What needs to be done?"
              className="border-gray-200 focus-visible:ring-blue-500 shadow-sm"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description" className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              className="border-gray-200 focus-visible:ring-blue-500 shadow-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="border-gray-200 focus-visible:ring-blue-500 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger className="border-gray-200 focus-visible:ring-blue-500 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dueDate" className="text-xs font-medium text-gray-500 uppercase tracking-wide">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border-gray-200 focus-visible:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-900">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-gray-900 text-white hover:bg-gray-800 shadow-sm">
            {isEditing ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </div>
    </div>
  )
}
