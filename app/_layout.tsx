import { useDB } from "@/hooks/local-db";
import { CompletionMethod } from "@/types/task-types";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

export default function RootLayout() {

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-task" options={{ title: 'Add New Task' }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[taskId]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
