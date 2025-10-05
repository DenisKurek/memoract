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
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1e1e2f',
          borderTopColor: 'rgba(138, 43, 226, 0.3)',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={focused ? "#00cfff" : "#8a8a8a"}
            />
          ),
          tabBarActiveTintColor: '#00cfff',
          tabBarInactiveTintColor: '#8a8a8a',
        }}
      />
      <Tabs.Screen
        name="task-list"
        options={{
          title: 'Task List',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={24}
              color={focused ? "#00cfff" : "#8a8a8a"}
            />
          ),
          tabBarActiveTintColor: '#00cfff',
          tabBarInactiveTintColor: '#8a8a8a',
        }}
      />
    </Tabs>
  );
}
