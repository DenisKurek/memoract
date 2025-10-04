"use client"

import { ArrowLeft, Calendar, Clock, QrCode, MapPin, Camera, Scan, Trash2 } from "lucide-react"

export interface Task {
  id: string
  title: string
  description: string
  date: string
  time: string
  completionMethod: string
  location?: string
  selectedFaceId?: string
}

interface TaskListScreenProps {
  onBack: () => void
  tasks: Task[]
  onDeleteTask: (id: string) => void
  onSelectTask: (task: Task) => void
}

export function TaskListScreen({ onBack, tasks, onDeleteTask, onSelectTask }: TaskListScreenProps) {
  const getMethodIcon = (method: string) => {
    switch (method) {
      case "qr":
        return <QrCode className="w-4 h-4" />
      case "geolocation":
        return <MapPin className="w-4 h-4" />
      case "photo":
        return <Camera className="w-4 h-4" />
      case "faceid":
        return <Scan className="w-4 h-4" />
      default:
        return null
    }
  }

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "qr":
        return "QR Code"
      case "geolocation":
        return "Geolocation"
      case "photo":
        return "Photo"
      case "faceid":
        return "Face ID"
      default:
        return method
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-blue-200" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-teal-300">
            Task List
          </h1>
          <p className="text-sm text-blue-200/60">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} to remember
          </p>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 space-y-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/20 flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-blue-300/50" />
            </div>
            <p className="text-lg text-blue-200/60">No tasks yet</p>
            <p className="text-sm text-blue-200/40 mt-2">Create your first task to get started</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10 backdrop-blur-sm border border-blue-400/20 hover:border-blue-400/40 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                    {task.title}
                  </h3>
                  {task.description && <p className="text-sm text-blue-200/70">{task.description}</p>}

                  <div className="flex flex-wrap gap-2">
                    {task.date && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-400/20">
                        <Calendar className="w-3.5 h-3.5 text-teal-300" />
                        <span className="text-xs text-teal-200">{task.date}</span>
                      </div>
                    )}
                    {task.time && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-400/20">
                        <Clock className="w-3.5 h-3.5 text-blue-300" />
                        <span className="text-xs text-blue-200">{task.time}</span>
                      </div>
                    )}
                    {task.completionMethod && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-400/20">
                        {getMethodIcon(task.completionMethod)}
                        <span className="text-xs text-purple-200">{getMethodLabel(task.completionMethod)}</span>
                      </div>
                    )}
                  </div>

                  {task.location && (
                    <div className="flex items-center gap-2 text-sm text-teal-200/70">
                      <MapPin className="w-4 h-4" />
                      <span>{task.location}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteTask(task.id)
                  }}
                  className="p-2 rounded-lg bg-red-500/10 border border-red-400/20 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4 text-red-300" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
