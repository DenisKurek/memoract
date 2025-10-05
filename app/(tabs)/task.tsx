import { useState } from "react";
import { Text, TextInput, Button } from "react-native";
import { useLocalSearchParams, usePathname } from "expo-router";
import { useDB } from "@/hooks/local-db";
import { CompletionMethodType } from "@/types/task-types";
import GradientContainer from "@/components/GradientContainer";

export default function TaskPage() {
  const { taskId } = useLocalSearchParams();
  const [value, setValue] = useState("");
  const db = useDB();

  const pathname = usePathname();
  console.log("Current route:", pathname);

  return (
    <GradientContainer>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 16,
          color: "#fff",
        }}
      >
        Task ID: {taskId}
      </Text>
      <Text style={{ marginBottom: 8, color: "#fff" }}>Simple Form:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          borderRadius: 6,
          padding: 8,
          width: 200,
          marginBottom: 16,
          color: "#fff",
          backgroundColor: "#333",
        }}
        placeholder="Enter something..."
        placeholderTextColor="#ccc"
        value={value}
        onChangeText={setValue}
      />
      <Button
        title="Submit"
        onPress={async () => {
          const resposnte = await db.saveTask({
            title: "ala ma kota",
            description: "Sample task description",
            datetime: new Date().toISOString(),
            completionMethod: CompletionMethodType.PHOTO,
            completed: false,
          });
          console.log("Submitted value:", resposnte);
        }}
      />
    </GradientContainer>
  );
}
