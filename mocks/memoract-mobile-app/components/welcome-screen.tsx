"use client"

import { Plus, List, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WelcomeScreen({
  onAddTask,
  onViewTasks,
  onViewNotifications,
}: {
  onAddTask: () => void
  onViewTasks: () => void
  onViewNotifications: () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-6">
      {/* Mobile frame container */}
      <div className="w-full max-w-sm mx-auto">
        {/* App header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2 tracking-tight">
            Memoract
          </h1>
          <p className="text-muted-foreground text-sm tracking-wide">we remember you act</p>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Metallic Add Task Tile */}
          <button
            className="w-full aspect-square rounded-3xl metallic-gradient shadow-2xl shadow-primary/30 hover:scale-[1.02] hover:shadow-primary/50 active:scale-[0.98] transition-all duration-200 flex flex-col items-center justify-center gap-4 relative overflow-hidden group"
            onClick={onAddTask}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-secondary/20 animate-pulse" />

            {/* Icon */}
            <div className="relative z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
              <Plus className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>

            {/* Text */}
            <span className="relative z-10 text-2xl font-semibold text-white tracking-wide drop-shadow-lg">
              Add Task
            </span>
          </button>

          {/* Task List Button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full h-16 text-lg glass-effect hover:bg-primary/20 hover:border-primary/50 transition-all duration-200 bg-transparent text-foreground"
            onClick={onViewTasks}
          >
            <List className="w-5 h-5 mr-3" />
            Task List
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-16 text-lg glass-effect hover:bg-secondary/20 hover:border-secondary/50 transition-all duration-200 bg-transparent text-foreground"
            onClick={onViewNotifications}
          >
            <Bell className="w-5 h-5 mr-3" />
            Notifications Mock
          </Button>
        </div>

        {/* Footer hint */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">Tap the gradient tile to create your first task</p>
        </div>
      </div>
    </div>
  )
}
