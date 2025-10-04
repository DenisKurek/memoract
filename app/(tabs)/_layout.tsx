import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="pawelTest"
        options={{
          title: "PAWEL TEST",
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: "Task",
        }}
      />
    </Tabs>
  );
}
