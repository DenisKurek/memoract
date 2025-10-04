"use client"

import { useState } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { AddTaskScreen } from "@/components/add-task-screen"
import { TaskListScreen, type Task } from "@/components/task-list-screen"
import { TaskDetailScreen } from "@/components/task-detail-screen"
import NotificationMock from "@/components/notification-mock"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<
    "welcome" | "add-task" | "task-list" | "notifications" | "task-detail"
  >("welcome")
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleCreateTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    }
    setTasks((prev) => [...prev, newTask])
    setCurrentScreen("task-list")
  }

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    setCurrentScreen("task-list")
    setSelectedTask(null)
  }

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task)
    setCurrentScreen("task-detail")
  }

  if (currentScreen === "notifications") {
    return <NotificationMock />
  }

  if (currentScreen === "task-detail" && selectedTask) {
    return (
      <TaskDetailScreen
        task={selectedTask}
        onBack={() => setCurrentScreen("task-list")}
        onComplete={handleCompleteTask}
      />
    )
  }

  if (currentScreen === "add-task") {
    return <AddTaskScreen onBack={() => setCurrentScreen("welcome")} onCreateTask={handleCreateTask} />
  }

  if (currentScreen === "task-list") {
    return (
      <TaskListScreen
        onBack={() => setCurrentScreen("welcome")}
        tasks={tasks}
        onDeleteTask={handleDeleteTask}
        onSelectTask={handleSelectTask}
      />
    )
  }

  return (
    <WelcomeScreen
      onAddTask={() => setCurrentScreen("add-task")}
      onViewTasks={() => setCurrentScreen("task-list")}
      onViewNotifications={() => setCurrentScreen("notifications")}
    />
  )
}
