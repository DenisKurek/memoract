import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task, CompletionMethodType } from '@/types/task-types';
import { Ionicons } from '@expo/vector-icons';

type TaskCardProps = {
    task: Task,
    onDelete: (task:Task) => void,
}
export default function TaskCard(props:TaskCardProps) {
        const { task, onDelete } = props;
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{task.title}</Text>
                        <Text style={styles.cardDesc}>{task.description}</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(task)}>
                        <Ionicons name="trash" size={18} color="#FC7A7A" />
                    </TouchableOpacity>
                </View>

                {/* Meta Row - all in column like on screenshot */}
                <View style={styles.metaRow}>
                    <View style={[styles.metaPill, styles.datePill]}>
                        <Ionicons name="calendar-outline" size={18} color="#5AEADC" />
                        <Text style={styles.metaText}>
                            {task.date ? new Date(task.date).toISOString().split('T')[0] : ''}
                        </Text>
                    </View>

                    <View style={[styles.metaPill, styles.timePill]}>
                        <Ionicons name="time-outline" size={18} color="#93C5FD" />
                        <Text style={styles.metaText}>{task.time || ''}</Text>
                    </View>

                    <View style={[styles.metaPill, styles.methodPill]}>
                        <Ionicons name={getMethodIcon(task.completionMethod)} size={18} color="#E9D5FF" />
                        <Text style={styles.metaText}>{getMethodLabel(task.completionMethod)}</Text>
                    </View>
                </View>
            </View>
        );
}

export const getMethodIcon = (method:CompletionMethodType) => {
  switch (method) {
    case CompletionMethodType.QR_CODE:
        return "qr-code-outline";
    case CompletionMethodType.PHOTO:
      return "camera-outline";
    case CompletionMethodType.FACE_ID:
      return "scan-outline";
    case CompletionMethodType.GEOLOCATION:
      return "location-outline";
  }
}

const getMethodLabel = (method: CompletionMethodType): string => {
  switch (method) {
    case CompletionMethodType.QR_CODE:
      return "QR Code";
    case CompletionMethodType.PHOTO:
      return "Photo";
    case CompletionMethodType.FACE_ID:
      return "Face ID";
    case CompletionMethodType.GEOLOCATION:
      return "Location";
    default:
      return "";
  }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(30, 30, 47, 0.95)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: 'rgba(100, 100, 150, 0.2)',
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    cardTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#E8E9F3',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    cardDesc: {
        fontSize: 16,
        color: '#A0A4B8',
        lineHeight: 22,
    },
    deleteBtn: {
        backgroundColor: 'rgba(139, 35, 50, 0.3)',
        borderRadius: 14,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    metaRow: {
        flexDirection: 'column',
        gap: 10,
        marginTop: 4,
    },
    metaPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    datePill: {
        backgroundColor: 'rgba(20, 184, 166, 0.12)',
        borderColor: 'rgba(20, 184, 166, 0.25)',
    },
    timePill: {
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        borderColor: 'rgba(59, 130, 246, 0.25)',
    },
    methodPill: {
        backgroundColor: 'rgba(168, 85, 247, 0.12)',
        borderColor: 'rgba(168, 85, 247, 0.25)',
    },
    metaText: {
        fontSize: 15,
        color: '#E8E9F3',
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});
