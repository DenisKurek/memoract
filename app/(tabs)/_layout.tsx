import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabLayout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00cfff',
        tabBarInactiveTintColor: '#8a8a8a',
        tabBarStyle: {
          backgroundColor: '#1e1e2f',
          borderTopColor: 'rgba(138, 43, 226, 0.3)',
          borderTopWidth: 1,
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={focused ? "#00cfff" : "#8a8a8a"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="task-list"
        options={{
          title: 'Task List',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={26}
              color={focused ? "#00cfff" : "#8a8a8a"}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
