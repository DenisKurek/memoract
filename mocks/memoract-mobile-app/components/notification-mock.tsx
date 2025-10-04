"use client"

import { Bell, MapPin, Camera, QrCode, Scan } from "lucide-react"

interface NotificationProps {
  time: string
  title: string
  message: string
  icon: "qr" | "location" | "photo" | "face"
  priority?: "high" | "normal"
}

const NotificationCard = ({ time, title, message, icon, priority = "normal" }: NotificationProps) => {
  const getIcon = () => {
    switch (icon) {
      case "qr":
        return <QrCode className="w-5 h-5" />
      case "location":
        return <MapPin className="w-5 h-5" />
      case "photo":
        return <Camera className="w-5 h-5" />
      case "face":
        return <Scan className="w-5 h-5" />
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
        priority === "high"
          ? "bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-teal-500/20 border-purple-400/30 shadow-lg shadow-purple-500/20"
          : "bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/80 border-slate-700/50"
      }`}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

      <div className="relative p-4">
        <div className="flex items-start gap-3">
          {/* App Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Bell className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-400">Memoract</span>
              <span className="text-xs text-slate-500">{time}</span>
            </div>

            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{title}</h3>

            <p className="text-sm text-slate-300 line-clamp-2 mb-2">{message}</p>

            {/* Task type indicator */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30">
                {getIcon()}
                <span className="text-xs text-blue-200 font-medium">
                  {icon === "qr" && "QR Code"}
                  {icon === "location" && "Location"}
                  {icon === "photo" && "Photo"}
                  {icon === "face" && "Face ID"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NotificationMock() {
  const notifications: NotificationProps[] = [
    {
      time: "2 min ago",
      title: "Task Reminder: Team Meeting",
      message: "Scan the QR code at the conference room entrance",
      icon: "qr",
      priority: "high",
    },
    {
      time: "15 min ago",
      title: "Location Task Due",
      message: "You're near the grocery store - time to complete your shopping task",
      icon: "location",
      priority: "high",
    },
    {
      time: "1 hour ago",
      title: "Photo Verification Needed",
      message: "Take a photo of the completed project for verification",
      icon: "photo",
      priority: "normal",
    },
    {
      time: "3 hours ago",
      title: "Secure Task Ready",
      message: "Use Face ID to access your confidential task details",
      icon: "face",
      priority: "normal",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      {/* Phone status bar mockup */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between text-white text-sm px-2 py-3">
          <span className="font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 border border-white/50 rounded-sm">
              <div className="w-2 h-2 bg-white rounded-sm m-0.5" />
            </div>
            <div className="w-4 h-3 border border-white/50 rounded-sm">
              <div className="w-3 h-2 bg-white rounded-sm m-0.5" />
            </div>
            <div className="w-6 h-3 border border-white/50 rounded-sm relative">
              <div className="w-4 h-2 bg-white rounded-sm m-0.5" />
              <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-white/50 rounded-r" />
            </div>
          </div>
        </div>
      </div>

      {/* Lock screen header */}
      <div className="max-w-md mx-auto mb-8 text-center">
        <h1 className="text-6xl font-bold text-white mb-2">9:41</h1>
        <p className="text-slate-400">Monday, January 15</p>
      </div>

      {/* Notifications */}
      <div className="max-w-md mx-auto space-y-3">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Bell className="w-5 h-5 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Notifications</h2>
        </div>

        {notifications.map((notification, index) => (
          <NotificationCard key={index} {...notification} />
        ))}
      </div>

      {/* Bottom hint */}
      <div className="max-w-md mx-auto mt-8 text-center">
        <p className="text-slate-500 text-sm">Swipe up to unlock</p>
      </div>
    </div>
  )
}
