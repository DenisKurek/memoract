import { useDB } from "@/hooks/local-db";
import { CompletionMethod } from "@/types/task-types";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PawelTest() {
  const { getAllTasks, deleteTask, clearAllTasks, saveTask } = useDB();
  const [randomTaskId, setRandomTaskId] = useState("");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Link href={`/${randomTaskId}`}>Go to Task</Link>
      <TouchableOpacity
        onPress={async () => {
          const allTasks = await getAllTasks();
          console.log("Tasks before deletion:", allTasks);

          // Use clearAllTasks for more efficient bulk deletion
          const cleared = await clearAllTasks();
          console.log("Clear all tasks result:", cleared);

          // Check if deletion worked
          const remainingTasks = await getAllTasks();
          console.log("Tasks after deletion:", remainingTasks);
        }}
      >
        <Text style={{ fontSize: 24, color: "black", textAlign: "center" }}>
          Clear All Tasks
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          await saveTask({
            title: "Photo Verification Test",
            description: "Take a photo to complete this task",
            datetime: new Date().toISOString(),
            completionMethod: CompletionMethod.PHOTO,
          });

          const tasks = await getAllTasks();
          setRandomTaskId(tasks[tasks.length - 1].id);
        }}
      >
        <Text style={{ fontSize: 18, color: "blue", textAlign: "center" }}>
          Add Photo Verification Task
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
