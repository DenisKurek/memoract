import React from "react";
import {
  Text,
  FlatList,
  StyleSheet,
  View,
  Alert,
  RefreshControl,
} from "react-native";
import DeleteModal from "../../components/DeleteModal";
import TaskCard from "../../components/TaskCard";
import { Task } from "@/types/task-types";
import { useDB } from "@/hooks/local-db";
import GradientContainer from "@/components/GradientContainer";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function TaskListTab() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const { getAllTasks, deleteTask } = useDB();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  const fetchTasks = React.useCallback(async () => {
    const fetchedTasks = await getAllTasks();
    console.log("Fetched tasks:", fetchedTasks);
    setTasks(fetchedTasks);
  }, [getAllTasks]);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, [fetchTasks]);

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete.id);

      // Refresh list immediately
      const updatedTasks = await getAllTasks();
      setTasks(updatedTasks);

      // Close modal
      setModalVisible(false);
      setTaskToDelete(null);

      // Show success notification
      Alert.alert(
        "✓ Task Deleted!",
        `"${taskToDelete.title}" has been removed.`,
        [{ text: "OK", style: "default" }]
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      Alert.alert("Error", "Failed to delete task. Please try again.");
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
    setTaskToDelete(null);
  };

  return (
    <GradientContainer>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <Ionicons name="list" size={32} color="#b6bfff" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Task List</Text>
              <Text style={styles.headerSubtitle}>
                {tasks.length}{" "}
                {tasks.length === 1 ? "task" : "tasks"} to remember
              </Text>
            </View>
          </View>
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="checkmark-done-circle-outline"
              size={80}
              color="rgba(255, 255, 255, 0.2)"
            />
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubtext}>
              Add your first task to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard task={item} onDelete={handleDeleteTask} />
            )}
            contentContainerStyle={[
              styles.flatListContent,
              { paddingBottom: tabBarHeight + insets.bottom + 16 },
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#8a2be2"
                colors={["#8a2be2", "#00cfff"]}
              />
            }
          />
        )}

        <DeleteModal
          modalVisible={modalVisible}
          taskToDelete={taskToDelete}
          confirmDelete={confirmDelete}
          cancelDelete={cancelDelete}
        />
      </View>
    </GradientContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#b6bfff",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#7bb7e6",
  },
  flatListContent: {
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.4)",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.3)",
    marginTop: 8,
  },
});
