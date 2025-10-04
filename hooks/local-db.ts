import * as SecureStore from "expo-secure-store";

export enum CompletionMethod {
  QR_CODE = "QR_CODE",
  GEOLOCATION = "GEOLOCATION",
  FACE_ID = "FACE_ID",
  PHOTO = "PHOTO",
}

export type Task = {
  id: string;
  title: string;
  description: string;
  datetime: string;
  completionMethod: CompletionMethod;
};

const TASKS_KEY = "memoract_tasks";

export function useDB() {
  const saveTask = async (task: Omit<Task, "id">): Promise<Task> => {
    try {
      const tasks = await getAllTasks();

      const newTask: Task = {
        ...task,
        id: generateId(),
      };

      tasks.push(newTask);
      await SecureStore.setItemAsync(TASKS_KEY, JSON.stringify(tasks));

      return newTask;
    } catch (error) {
      console.error("Error saving task:", error);
      throw new Error("Failed to save task");
    }
  };

  const updateTask = async (
    id: string,
    updates: Partial<Omit<Task, "id">>
  ): Promise<Task | null> => {
    try {
      const tasks = await getAllTasks();
      const taskIndex = tasks.findIndex((t) => t.id === id);

      if (taskIndex === -1) {
        console.warn(`Task with id ${id} not found`);
        return null;
      }

      const updatedTask: Task = {
        ...tasks[taskIndex],
        ...updates,
      };

      tasks[taskIndex] = updatedTask;
      await SecureStore.setItemAsync(TASKS_KEY, JSON.stringify(tasks));

      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task");
    }
  };

  const getAllTasks = async (): Promise<Task[]> => {
    try {
      const tasksJson = await SecureStore.getItemAsync(TASKS_KEY);

      if (!tasksJson) {
        return [];
      }

      return JSON.parse(tasksJson) as Task[];
    } catch (error) {
      console.error("Error getting tasks:", error);
      return [];
    }
  };

  const getTaskById = async (id: string): Promise<Task | null> => {
    try {
      const tasks = await getAllTasks();
      return tasks.find((t) => t.id === id) || null;
    } catch (error) {
      console.error("Error getting task by id:", error);
      return null;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      const tasks = await getAllTasks();
      const filteredTasks = tasks.filter((t) => t.id !== id);

      if (filteredTasks.length === tasks.length) {
        console.warn(`Task with id ${id} not found`);
        return false;
      }

      await SecureStore.setItemAsync(TASKS_KEY, JSON.stringify(filteredTasks));
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  };

  return {
    saveTask,
    updateTask,
    getAllTasks,
    getTaskById,
    deleteTask,
  };
}

/**
 * Generate a unique ID for tasks
 */
function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
