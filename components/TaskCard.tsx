import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Task ,getMethodIcon} from './types';

type TaskCardProps = {
    task: Task,
    onDelete: (task:Task) => void,
}
export default function TaskCard(props: TaskCardProps) {
    const { task, onDelete } = props;
    return (<View style={styles.card}>
        <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{task.title}</Text>
                <Text style={styles.cardDesc}>{task.description}</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(task)}>
                <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.metaRow}>
            <View style={styles.metaBox}>
                <Text style={styles.metaIcon}>📅</Text>
                <Text style={styles.metaText}>{task.date}</Text>
            </View>
            <View style={styles.metaBox}>
                <Text style={styles.metaIcon}>⏰</Text>
                <Text style={styles.metaText}>{task.time}</Text>
            </View>
            <View style={styles.metaBoxPhoto}>
                {getMethodIcon(task.completionMethod)}
            </View>
        </View>
    </View>
    );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    card: {
        width: width - 32,
        backgroundColor: 'rgba(44, 62, 80, 0.85)',
        borderRadius: 22,
        padding: 18,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(120, 120, 255, 0.13)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    cardDesc: {
        fontSize: 15,
        color: '#b6bfff',
        marginBottom: 2,
    },
    deleteBtn: {
        backgroundColor: 'rgba(255, 0, 0, 0.08)',
        borderRadius: 16,
        padding: 8,
        marginLeft: 8,
    },
    deleteIcon: {
        fontSize: 20,
        color: '#ff6b81',
    },
    metaRow: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 8,
    },
    metaBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 255, 255, 0.08)',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    metaBoxPhoto: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(120, 80, 255, 0.13)',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    metaIcon: {
        fontSize: 16,
        marginRight: 6,
        color: '#7bb7e6',
    },
    metaText: {
        fontSize: 15,
        color: '#7bb7e6',
    },
});
