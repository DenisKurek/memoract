import { Stack } from "expo-router";
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
