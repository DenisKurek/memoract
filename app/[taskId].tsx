import {
  FaceIdVerification,
  GeolocationVerification,
  PhotoVerification,
  QrCodeVerification,
} from "@/components/verification";
import { useDB } from "@/hooks/local-db";
import { CompletionMethodType, Task } from "@/types/task-types";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GradientContainer from "@/components/GradientContainer";

export default function CompleteTask() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const { getTaskById, deleteTask } = useDB();
  const [task, setTask] = useState<Task | null>(null);
  console.log(task);

  useEffect(() => {
    const fetchTask = async () => {
      const task = await getTaskById(taskId);
      console.log("Fetched task:", task);
      setTask(task);
    };

    fetchTask();
  }, []);

  const handleVerify = async () => {
    console.log("Verification complete, deleting task:", taskId);
    await deleteTask(taskId);
    router.back();
  };

  const handleGoBack = () => {
    router.back();
  };

  const renderVerificationComponent = () => {
    if (!task) return null;

    switch (task.completionMethod) {
      case CompletionMethodType.FACE_ID:
        return (
          <FaceIdVerification
            onVerify={handleVerify}
            datetime={task.datetime}
          />
        );
      case CompletionMethodType.QR_CODE:
        return (
          <QrCodeVerification
            onVerify={handleVerify}
            taskId={taskId}
            datetime={task.datetime}
          />
        );
      case CompletionMethodType.GEOLOCATION:
        return (
          <GeolocationVerification
            onVerify={handleVerify}
            taskId={taskId}
            datetime={task.datetime}
          />
        );
      case CompletionMethodType.PHOTO:
        return (
          <PhotoVerification
            onVerify={handleVerify}
            taskId={taskId}
            datetime={task.datetime}
          />
        );
    }
  };

  return (
    <GradientContainer>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{task?.title}</Text>
            <Text style={styles.subtitle}>Complete this task</Text>
          </View>
        </View>

        <View style={styles.taskCard}>
          <Text style={styles.taskDescription}>{task?.description}</Text>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateBox}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color="#5EEAD4"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.dateText}>
                {task?.datetime
                  ? format(parseISO(task.datetime), "MMM dd, yyyy")
                  : "No date"}
              </Text>
            </View>
            <View style={styles.timeBox}>
              <Ionicons
                name="time-outline"
                size={14}
                color="#93C5FD"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.timeText}>
                {task?.datetime
                  ? format(parseISO(task.datetime), "HH:mm")
                  : "No time"}
              </Text>
            </View>
          </View>
        </View>

        {/* Dynamic Verification Component */}
        {renderVerificationComponent()}
      </View>
    </GradientContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 24,
    gap: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    // bg-white/5 backdrop-blur-sm border border-white/10
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    // text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-teal-300
    color: "#93C5FD", // blue-300 approximation for React Native
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(147, 197, 253, 0.6)", // text-blue-200/60
  },
  taskCard: {
    // p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10 backdrop-blur-sm border border-blue-400/20
    backgroundColor: "rgba(59, 130, 246, 0.1)", // Gradient approximation
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.2)", // border-blue-400/20
    // Adding overlay effect to simulate gradient
    position: "relative",
  },
  taskDescription: {
    fontSize: 16,
    color: "rgba(147, 197, 253, 0.8)", // text-blue-200/80
    marginBottom: 16,
    lineHeight: 22,
  },
  dateTimeContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  dateBox: {
    // px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-400/20 text-xs text-teal-200
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20, 184, 166, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(45, 212, 191, 0.2)",
  },
  dateText: {
    color: "#5EEAD4", // teal-200
    fontSize: 12,
    fontWeight: "600",
  },
  timeBox: {
    // px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-400/20 text-xs text-blue-200
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.2)",
  },
  timeText: {
    color: "#93C5FD", // blue-200
    fontSize: 12,
    fontWeight: "600",
  },
});
