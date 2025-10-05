import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { saveVerificationData } from '@/hooks/local-db';

interface QRCodeSetupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (qrData: string) => void;
  taskId: string;
}

export default function QRCodeSetup({ visible, onClose, onSave, taskId }: QRCodeSetupProps) {
  const [qrData] = useState(`memoract_task_${taskId}_${Date.now()}`);

  const handleSaveQR = async () => {
    try {
      // Save QR data to secure storage
      await saveVerificationData(`qr_${taskId}`, qrData);
      
      onSave(qrData);
      alert('QR Code saved! You can scan it later to verify this task.');
      onClose();
    } catch (error) {
      console.error('Error saving QR code:', error);
      alert('Failed to save QR code');
    }
  };

  const handleShareQR = async () => {
    try {
      await Share.share({
        message: `Memoract Task QR Code: ${qrData}`,
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Task QR Code</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Save or print this QR code. You&apos;ll need to scan it to verify task completion.
          </Text>

          <View style={styles.qrContainer}>
            <QRCode
              value={qrData}
              size={250}
              backgroundColor="white"
              color="black"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShareQR}>
              <LinearGradient
                colors={['#8a2be2', '#00cfff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Ionicons name="share-social" size={20} color="#fff" />
                <Text style={styles.buttonText}>Share</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleSaveQR}>
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.buttonText}>Save & Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e1e2f',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 24,
    lineHeight: 20,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
