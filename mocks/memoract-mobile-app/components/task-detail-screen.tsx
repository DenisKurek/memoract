"use client";

import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  MapPin,
  QrCode,
  Scan,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Task } from "./task-list-screen";

interface TaskDetailScreenProps {
  task: Task;
  onBack: () => void;
  onComplete: (taskId: string) => void;
}

export function TaskDetailScreen({
  task,
  onBack,
  onComplete,
}: TaskDetailScreenProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionStep, setCompletionStep] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showManualConfirmDialog, setShowManualConfirmDialog] = useState(false);

  const handleStartCompletion = () => {
    setIsCompleting(true);
    setCompletionStep("processing");

    setTimeout(() => {
      const success = failedAttempts >= 2 ? Math.random() > 0.5 : false;
      setCompletionStep(success ? "success" : "failed");

      if (success) {
        setTimeout(() => {
          onComplete(task.id);
        }, 1500);
      } else {
        setFailedAttempts((prev) => prev + 1);
      }
    }, 2000);
  };

  const handleManualConfirm = () => {
    setShowManualConfirmDialog(true);
  };

  const handleConfirmManualCompletion = () => {
    setShowManualConfirmDialog(false);
    setCompletionStep("success");
    setTimeout(() => {
      onComplete(task.id);
    }, 1500);
  };

  const handleCapturePhoto = () => {
    // Simulate photo capture
    setCapturedImage("/person-face-photo.png");
    setTimeout(() => {
      handleStartCompletion();
    }, 500);
  };

  const renderCompletionInterface = () => {
    switch (task.completionMethod) {
      case "photo":
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 backdrop-blur-sm border border-purple-400/20">
              <div className="flex items-center gap-3 mb-4">
                <Camera className="w-6 h-6 text-purple-300" />
                <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
                  Take Photo
                </h3>
              </div>
              <p className="text-sm text-blue-200/70 mb-4">
                Take a photo of the reference image. AI will compare and verify
                if it matches.
              </p>

              {capturedImage ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-teal-400/30 mb-4">
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Captured"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 backdrop-blur-sm hover:bg-red-500 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCapturePhoto}
                  className="w-full h-64 rounded-xl border-2 border-dashed border-purple-400/30 hover:border-purple-400/50 bg-purple-500/5 hover:bg-purple-500/10 transition-all flex flex-col items-center justify-center gap-3"
                >
                  <Camera className="w-12 h-12 text-purple-300/50" />
                  <span className="text-sm text-purple-200/70">
                    Tap to capture photo
                  </span>
                </button>
              )}
            </div>

            {capturedImage && completionStep === "idle" && (
              <button
                onClick={handleStartCompletion}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 hover:from-blue-600 hover:via-purple-600 hover:to-teal-600 text-white font-semibold transition-all shadow-lg shadow-purple-500/25"
              >
                Verify Photo
              </button>
            )}
          </div>
        );

      case "geolocation":
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-teal-400/20">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-teal-300" />
                <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-blue-200">
                  Check Location
                </h3>
              </div>
              <p className="text-sm text-blue-200/70 mb-4">
                Your device will verify if youre at the correct location.
              </p>

              {task.location && (
                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-400/20 mb-4">
                  <p className="text-sm text-teal-200 mb-2">Target Location:</p>
                  <p className="text-base font-medium text-teal-100">
                    {task.location}
                  </p>
                </div>
              )}

              <div className="h-48 rounded-xl bg-gradient-to-br from-teal-900/30 to-blue-900/30 border border-teal-400/20 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-teal-300/30" />
              </div>
            </div>

            {completionStep === "idle" && (
              <button
                onClick={handleStartCompletion}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 hover:from-teal-600 hover:via-blue-600 hover:to-purple-600 text-white font-semibold transition-all shadow-lg shadow-teal-500/25"
              >
                Verify Location
              </button>
            )}
          </div>
        );

      case "faceid":
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10 backdrop-blur-sm border border-blue-400/20">
              <div className="flex items-center gap-3 mb-4">
                <Scan className="w-6 h-6 text-blue-300" />
                <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                  Face ID Verification
                </h3>
              </div>
              <p className="text-sm text-blue-200/70 mb-4">
                Position your face within the frame for verification.
              </p>

              {task.selectedFaceId && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/20 mb-4">
                  <p className="text-sm text-blue-200 mb-2">
                    Registered Face ID:
                  </p>
                  <p className="text-base font-medium text-blue-100">
                    {task.selectedFaceId}
                  </p>
                </div>
              )}

              <div className="relative h-64 rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-400/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border-4 border-blue-400/30 border-dashed animate-spin-slow" />
                </div>
                <Scan className="w-20 h-20 text-blue-300/30" />
              </div>
            </div>

            {completionStep === "idle" && (
              <button
                onClick={handleStartCompletion}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 hover:from-blue-600 hover:via-purple-600 hover:to-teal-600 text-white font-semibold transition-all shadow-lg shadow-blue-500/25"
              >
                Start Face Scan
              </button>
            )}
          </div>
        );

      case "qr":
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-teal-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-400/20">
              <div className="flex items-center gap-3 mb-4">
                <QrCode className="w-6 h-6 text-purple-300" />
                <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-teal-200">
                  Scan QR Code
                </h3>
              </div>
              <p className="text-sm text-blue-200/70 mb-4">
                Position the QR code within the frame to scan.
              </p>

              <div className="relative h-64 rounded-xl bg-gradient-to-br from-purple-900/30 to-teal-900/30 border border-purple-400/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-4 border-purple-400/30 rounded-lg">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-400" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-400" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-400" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-400" />
                  </div>
                </div>
                <QrCode className="w-20 h-20 text-purple-300/30" />
              </div>
            </div>

            {completionStep === "idle" && (
              <button
                onClick={handleStartCompletion}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 via-teal-500 to-blue-500 hover:from-purple-600 hover:via-teal-600 hover:to-blue-600 text-white font-semibold transition-all shadow-lg shadow-purple-500/25"
              >
                Start QR Scan
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderCompletionStatus = () => {
    if (completionStep === "processing") {
      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-teal-500/20 backdrop-blur-md border border-blue-400/30 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-blue-400/30 border-t-blue-400 animate-spin" />
            <p className="text-lg font-semibold text-blue-200">Verifying...</p>
            <p className="text-sm text-blue-200/60 mt-2">Please wait</p>
          </div>
        </div>
      );
    }

    if (completionStep === "success") {
      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-teal-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-md border border-teal-400/30 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-teal-300" />
            </div>
            <p className="text-lg font-semibold text-teal-200">
              Task Completed!
            </p>
            <p className="text-sm text-blue-200/60 mt-2">Great job!</p>
          </div>
        </div>
      );
    }

    if (completionStep === "failed") {
      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-red-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-md border border-red-400/30 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <X className="w-10 h-10 text-red-300" />
            </div>
            <p className="text-lg font-semibold text-red-200">
              Verification Failed
            </p>
            <p className="text-sm text-blue-200/60 mt-2">
              Attempt {failedAttempts} of 2 failed
            </p>
            <div className="flex flex-col gap-3 mt-4">
              {failedAttempts >= 2 ? (
                <button
                  onClick={handleManualConfirm}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-red-500/30 border border-yellow-400/30 text-yellow-200 transition-all flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Manual Confirmation
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCompletionStep("idle");
                    setIsCompleting(false);
                    setCapturedImage(null);
                  }}
                  className="px-6 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderManualConfirmDialog = () => {
    if (!showManualConfirmDialog) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-md border border-yellow-400/30">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-yellow-300" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200 mb-3">
            Manual Confirmation
          </h3>

          <p className="text-center text-blue-200/80 mb-6">
            Czy na pewno chcesz potwierdzić wykonanie taska?
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowManualConfirmDialog(false)}
              className="flex-1 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200 transition-colors"
            >
              Anuluj
            </button>
            <button
              onClick={handleConfirmManualCompletion}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-semibold transition-all shadow-lg shadow-yellow-500/25"
            >
              Potwierdź
            </button>
          </div>
        </div>
      </div>
    );
  };

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
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-teal-300">
            {task.title}
          </h1>
          <p className="text-sm text-blue-200/60">Complete this task</p>
        </div>
      </div>

      {failedAttempts > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-400/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-300" />
          <p className="text-sm text-red-200">
            Failed attempts: {failedAttempts}/2
          </p>
        </div>
      )}

      {/* Task Details */}
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10 backdrop-blur-sm border border-blue-400/20">
        {task.description && (
          <p className="text-blue-200/80 mb-4">{task.description}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {task.date && (
            <div className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-400/20 text-xs text-teal-200">
              {task.date}
            </div>
          )}
          {task.time && (
            <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-400/20 text-xs text-blue-200">
              {task.time}
            </div>
          )}
        </div>
      </div>

      {/* Completion Interface */}
      <div className="flex-1">{renderCompletionInterface()}</div>

      {/* Completion Status Overlay */}
      {renderCompletionStatus()}

      {renderManualConfirmDialog()}
    </div>
  );
}
