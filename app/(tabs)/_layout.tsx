import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => (
            <Ionicons name="home-outline" size={16} color="#fff" />
          )
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: 'Task',
          tabBarIcon: () => (
            <Ionicons name="create-outline" size={16} color="#fff" />
          )
        }}
      />
      <Tabs.Screen
        name="task-list"
        options={{
          title: 'Task List',
          tabBarIcon: () => (
            <Ionicons name="list-outline" size={16} color="#fff" />
          )
        }}
      />
    </Tabs>
  );
}
