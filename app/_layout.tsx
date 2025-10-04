import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { navigationRef } from '../navigationRef';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* @ts-ignore: expo-router uses a custom navigation container, but ref is supported */}
      <Stack ref={navigationRef}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="add-task" options={{ title: 'Add New Task' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
