import React from 'react';
import { Text, FlatList, StyleSheet, View} from 'react-native';
import DeleteModal from '../../components/DeleteModal';
import TaskCard from '../../components/TaskCard';
import { Task } from '@/types/task-types';
import { useDB } from '@/hooks/local-db';
import GradientContainer from '@/components/GradientContainer';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TaskListTab() {
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);
    const { getAllTasks, deleteTask } = useDB();
    const tabBarHeight = useBottomTabBarHeight();
    const insets = useSafeAreaInsets();

    const fetchTasks = React.useCallback(async () => {
         const fetchedTasks = await getAllTasks();
         console.log('Fetched tasks:', fetchedTasks);
         setTasks(fetchedTasks);
    }, [getAllTasks]);

    React.useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);


    const handleDeleteTask = (task: Task) => {
        setTaskToDelete(task);
        setModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;
        await deleteTask(taskToDelete.id);
        const updatedTasks = await getAllTasks();
        setTasks(updatedTasks);
        setModalVisible(false);
        setTaskToDelete(null);
    };

    const cancelDelete = () => {
        setModalVisible(false);
        setTaskToDelete(null);
    };

    return (
        <GradientContainer>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Task List</Text>
                <Text style={styles.headerSubtitle}>{tasks.length} tasks to remember</Text>
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TaskCard task={item} onDelete={handleDeleteTask} />
                    )}
                    contentContainerStyle={[styles.flatListContent, { paddingBottom: tabBarHeight + insets.bottom + 16 }]}
                    showsVerticalScrollIndicator={false}
                />
                <DeleteModal modalVisible={modalVisible} taskToDelete={taskToDelete}
                    confirmDelete={confirmDelete} cancelDelete={cancelDelete} />
            </View>
        </GradientContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#b6bfff',
        marginBottom: 2,
        marginTop: 10,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#7bb7e6',
        marginBottom: 18,
    },
    flatListContent: {
        paddingBottom: 32,
    },
});
