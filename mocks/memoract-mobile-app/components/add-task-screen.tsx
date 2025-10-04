"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Plus, Calendar, Clock, QrCode, MapPin, Camera, Scan } from "lucide-react"
import type { Task } from "./task-list-screen"

export function AddTaskScreen({
  onBack,
  onCreateTask,
}: { onBack: () => void; onCreateTask: (task: Omit<Task, "id">) => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [completionMethod, setCompletionMethod] = useState<string>("")
  const [location, setLocation] = useState("")
  const [selectedFaceId, setSelectedFaceId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateTask({
      title,
      description,
      date,
      time,
      completionMethod,
      location: completionMethod === "geolocation" ? location : undefined,
      selectedFaceId: completionMethod === "faceid" ? selectedFaceId : undefined,
    })
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
            Add New Task
          </h1>
          <p className="text-sm text-blue-200/60">Create something to remember</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
        {/* Task Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-200/80">Task Title</label>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="w-full px-4 py-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-400/20 text-white placeholder:text-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        {/* Task Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-200/80">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about your task..."
            rows={4}
            className="w-full px-4 py-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-teal-500/10 backdrop-blur-sm border border-purple-400/20 text-white placeholder:text-purple-200/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-200/80 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-teal-500/10 to-blue-500/10 backdrop-blur-sm border border-teal-400/20 text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-200/80 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-teal-500/10 backdrop-blur-sm border border-blue-400/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-200/80">Completion Method</label>
          <select
            value={completionMethod}
            onChange={(e) => setCompletionMethod(e.target.value)}
            className="w-full px-4 py-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-400/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-slate-900">
              Select completion method...
            </option>
            <option value="qr" className="bg-slate-900">
              Scan QR Code
            </option>
            <option value="geolocation" className="bg-slate-900">
              Use Geolocation
            </option>
            <option value="photo" className="bg-slate-900">
              Add Photo
            </option>
            <option value="faceid" className="bg-slate-900">
              Face ID
            </option>
          </select>
        </div>

        {completionMethod === "qr" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <button
              type="button"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 text-purple-200 hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <QrCode className="w-5 h-5" />
              Generate QR Code
            </button>
          </div>
        )}

        {completionMethod === "geolocation" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200/80 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location or use map..."
                className="w-full px-4 py-4 rounded-2xl bg-gradient-to-br from-teal-500/10 to-green-500/10 backdrop-blur-sm border border-teal-400/20 text-white placeholder:text-teal-200/40 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent transition-all"
              />
            </div>
            <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-teal-500/10 to-green-500/10 backdrop-blur-sm border border-teal-400/20 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-teal-300/50 mx-auto mb-2" />
                <p className="text-sm text-teal-200/60">Map view placeholder</p>
              </div>
            </div>
          </div>
        )}

        {completionMethod === "photo" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <button
              type="button"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-200 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Camera className="w-5 h-5" />
              Add Photo
            </button>
            <p className="text-xs text-blue-200/50 text-center">Photo of person, sign, building, or street name</p>
          </div>
        )}

        {completionMethod === "faceid" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-200/80 flex items-center gap-2">
                <Scan className="w-4 h-4" />
                Select Face ID
              </label>
              <select
                value={selectedFaceId}
                onChange={(e) => setSelectedFaceId(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">
                  Select predefined Face ID...
                </option>
                <option value="face1" className="bg-slate-900">
                  Face ID #1
                </option>
                <option value="face2" className="bg-slate-900">
                  Face ID #2
                </option>
                <option value="face3" className="bg-slate-900">
                  Face ID #3
                </option>
              </select>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-auto pt-6">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Create Task
          </button>
        </div>
      </form>
    </div>
  )
}
