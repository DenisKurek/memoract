import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { Task } from '@/types/task-types';

type DeleteModalProps = {
    modalVisible: boolean,
    taskToDelete: Task | null,
    confirmDelete: () => void,
    cancelDelete: () => void,
};

export default function DeleteModal(props: DeleteModalProps){
const { modalVisible, taskToDelete, confirmDelete, cancelDelete } = props;
return (<Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Task</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete
              <Text style={{ fontWeight: 'bold', color: '#ff6b81' }}> {taskToDelete?.title}</Text>?
            </Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.modalButton} onPress={cancelDelete}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: '#ff6b81' }]} onPress={confirmDelete}>
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>);

}

const styles = StyleSheet.create({
        modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        modalContent: {
          backgroundColor: '#232946',
          borderRadius: 16,
          padding: 24,
          width: '80%',
          alignItems: 'center',
          elevation: 8,
        },
        modalTitle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: 12,
        },
        modalText: {
          fontSize: 16,
          color: '#fff',
          marginBottom: 20,
          textAlign: 'center',
        },
        modalActions: {
          flexDirection: 'row',
          gap: 16,
        },
        modalButton: {
          backgroundColor: '#232946',
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 24,
          marginHorizontal: 8,
          borderWidth: 1,
          borderColor: '#7bb7e6',
        },
        modalButtonText: {
          fontSize: 16,
          color: '#7bb7e6',
          fontWeight: 'bold',
        },});