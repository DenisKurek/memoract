import React from 'react';
import { Stack, router } from 'expo-router';
import AddNewTask from '@/components/AddNewTask';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddTaskScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                padding: 10,
                marginLeft: 5,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <AddNewTask />
    </>
  );
}
