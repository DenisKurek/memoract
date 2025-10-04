import { useDB } from "@/hooks/local-db";
import { CompletionMethod } from "@/types/task-types";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

export default function RootLayout() {
  // sample task saved
  const { saveTask } = useDB();
  useEffect(() => {
    // add sample task
    saveTask({
      title: "odbierz dzieciora z przedszkola",
      description: "dzieciok w przedszkolu olaboga",
      datetime: new Date().toISOString(),
      completionMethod: CompletionMethod.FACE_ID,
    });
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[taskId]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
