# Memoract App – Technical Documentation

## Overview
Memoract is a React Native mobile application built with Expo, designed for task management with advanced completion methods and notification features. The app leverages modern React patterns, Expo modules, and a modular architecture for scalability and maintainability.

---

## Main Technologies & Frameworks

- **React Native**: Core framework for building native mobile apps using React.
- **Expo**: Toolchain and runtime for React Native, simplifying development, building, and deployment.
- **TypeScript**: Provides static typing for safer and more maintainable code.
- **Expo Router**: File-based routing for navigation, supporting tabs, modals, and deep linking.
- **React Navigation**: Underlying navigation engine for stack, tab, and modal navigation.
---

## Main Plugins & Libraries

- **expo-notifications**: For scheduling, displaying, and handling notifications (including navigation on tap).
- **expo-linear-gradient**: For creating gradient backgrounds in cards and buttons.
- **@expo/vector-icons**: For consistent iconography throughout the app.
- **@react-native-community/datetimepicker**: For selecting dates and times in task creation.
- **react-native-safe-area-context**: For safe area padding and layout.

---

## Application Features

### 1. Task Management
- **Add New Task**: Users can create tasks with a title, description, date, time, and a required completion method.
- **Completion Methods**: Tasks can require: QR code scan, geolocation, photo, or Face ID for completion. Each method has a dedicated setup flow.
- **Task List**: Displays all tasks in a visually rich list, with gradient backgrounds and meta info.
- **Task Deletion**: Users can delete tasks with a confirmation modal.

### 2. Notifications
- **Scheduled Reminders**: When a task is created, a notification is scheduled to remind the user at the specified time.
- **Deep Linking on Notification Tap**: Tapping a notification navigates directly to the relevant task detail screen using the task ID.

### 3. Navigation
- **Tab Navigation**: The app uses a tab-based layout for main sections (e.g., Home, Task List).
- **Stack Navigation**: Supports modals and detail screens.
- **File-based Routing**: Navigation structure is defined by the file system using Expo Router.

### 4. UI/UX
- **Gradient Cards & Buttons**: Uses `expo-linear-gradient` for modern, attractive UI elements.
- **Custom Components**: Modular components for tasks, modals, and completion method setup.
- **Responsive Layout**: Uses flexbox and safe area insets for consistent appearance across devices.

### 5. Local Data Storage
- **Custom Hook (`useDB`)**: Handles saving and retrieving tasks locally.

---

## File Structure (Key Files)
- `app/(tabs)/index.tsx`: Main tab navigation and notification logic.
- `app/(tabs)/task-list.tsx`: Task list UI and logic.
- `components/AddNewTask.tsx`: Task creation form and notification scheduling.
- `components/TaskCard.tsx`: Task card UI with gradient and meta info.
- `hooks/use-notification-handler.ts`: In-app notification tap handler for navigation.
- `hooks/useDB.ts`: Local database logic (not shown).

---

## How Notifications Work
1. When a task is created, a notification is scheduled with the task ID in its data payload.
2. The `useNotificationHandler` hook listens for notification taps and navigates to the task detail screen using the ID.
3. The app can be extended to support push notifications and more advanced deep linking as needed.

---

## Extensibility
- The modular architecture allows for easy addition of new completion methods, notification types, or UI themes.
- The use of hooks and context makes state and side-effect management scalable.

---

## Requirements
- Node.js, npm/yarn
- Expo CLI
- Android/iOS emulator or device

---

For more details, see the codebase and README.md.
