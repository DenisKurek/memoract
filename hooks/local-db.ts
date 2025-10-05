import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "@/types/task-types";
import * as SecureStore from "expo-secure-store";

const TASKS_STORAGE_KEY = "@memoract_tasks";

export function useDB() {
  const saveTask = useCallback(
    async (task: Omit<Task, "id">): Promise<Task> => {
      try {
        const tasksJSON = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];

        const newTask: Task = {
          ...task,
          id: generateId(),
        };

        tasks.push(newTask);
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));

        return newTask;
      } catch (error) {
        console.error("Error saving task:", error);
        throw new Error("Failed to save task");
      }
    },
    []
  );

  const updateTask = useCallback(
    async (
      id: string,
      updates: Partial<Omit<Task, "id">>
    ): Promise<Task | null> => {
      try {
        const tasksJSON = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];
        const taskIndex = tasks.findIndex((t: Task) => t.id === id);

        if (taskIndex === -1) {
          console.warn(`Task with id ${id} not found`);
          return null;
        }

        const updatedTask: Task = {
          ...tasks[taskIndex],
          ...updates,
        };

        tasks[taskIndex] = updatedTask;
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));

        return updatedTask;
      } catch (error) {
        console.error("Error updating task:", error);
        throw new Error("Failed to update task");
      }
    },
    []
  );

  const getAllTasks = useCallback(async (): Promise<Task[]> => {
    try {
      const tasksJSON = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (tasksJSON) {
        const tasks = JSON.parse(tasksJSON);
        // Convert datetime strings back to Date objects if needed
        return tasks.map((task: any) => ({
          ...task,
          datetime: task.datetime || task.date, // Support old 'date' field for backward compatibility
          createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading tasks:", error);
      return [];
    }
  }, []);

  const getTaskById = useCallback(async (id: string): Promise<Task | null> => {
    try {
      const tasksJSON = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];
      return tasks.find((t: Task) => t.id === id) || null;
    } catch (error) {
      console.error("Error getting task by id:", error);
      return null;
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      const tasksJSON = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];
      const filteredTasks = tasks.filter((t: Task) => t.id !== id);

      if (filteredTasks.length === tasks.length) {
        console.warn(`Task with id ${id} not found`);
        return false;
      }

      await AsyncStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(filteredTasks)
      );
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  }, []);

  const clearAllTasks = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing tasks:", error);
      throw error;
    }
  }, []);

  return {
    saveTask,
    updateTask,
    getAllTasks,
    getTaskById,
    deleteTask,
    clearAllTasks,
  };
}

/**
 * Zapisuje wrażliwe dane (np. zdjęcia, QR kody) do Secure Store
 * @param key unikalny klucz
 * @param data dowolne dane do zapisania
 */
export async function saveVerificationData(
  key: string,
  data: any
): Promise<void> {
  try {
    const jsonValue = JSON.stringify(data);
    await SecureStore.setItemAsync(key, jsonValue);
  } catch (e) {
    console.error("Error saving verification data:", e);
    throw new Error("Failed to save verification data");
  }
}

/**
 * Pobiera wrażliwe dane (np. zdjęcia, QR kody) z Secure Store
 * @param key unikalny klucz
 * @returns dane lub null
 */
export async function getVerificationData(key: string): Promise<any | null> {
  try {
    const jsonValue = await SecureStore.getItemAsync(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error getting verification data:", e);
    return null;
  }
}

function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
