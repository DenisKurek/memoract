import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Task, TASKS } from '../../components/types';
import DeleteModal from '../../components/DeleteModal';
import TaskCard from '../../components/TaskCard';

export default function TaskListTab() {
    const [tasks, setTasks] = React.useState(TASKS);
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);

    const handleDeleteTask = (task: Task) => {
        setTaskToDelete(task);
        setModalVisible(true);
    };

    const confirmDelete = () => {
        setTasks((prev:Task[]) => prev.filter((task) => task.id !== taskToDelete?.id));
        setModalVisible(false);
        setTaskToDelete(null);
    };

    const cancelDelete = () => {
        setModalVisible(false);
        setTaskToDelete(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Task List</Text>
            <Text style={styles.headerSubtitle}>{tasks.length} tasks to remember</Text>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskCard task={item} onDelete={handleDeleteTask} />
                )}
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            />
            <DeleteModal modalVisible={modalVisible} taskToDelete={taskToDelete}
                confirmDelete={confirmDelete} cancelDelete={cancelDelete} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'linear-gradient(180deg, #181e3a 0%, #1a225a 100%)',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 12,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#b6bfff',
        marginBottom: 2,
        alignSelf: 'flex-start',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#7bb7e6',
        marginBottom: 18,
        alignSelf: 'flex-start',
    },
});
