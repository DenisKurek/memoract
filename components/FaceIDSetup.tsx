import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface FaceIDSetupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (faceData: string) => void;
}

function FaceIDSetup({ visible, onClose, onSave }: FaceIDSetupProps) {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible, permission?.granted, requestPermission]);

  const handleCaptureFace = () => {
    // For now, simulate face capture with timestamp
    const simulatedFaceData = JSON.stringify({
      timestamp: Date.now(),
      userId: 'user_' + Math.random().toString(36).substr(2, 9),
    });

    Alert.alert(
      'Face Captured',
      "Your face has been registered. You'll need to scan your face again to verify this task.",
      [
        {
          text: 'OK',
          onPress: () => {
            onSave(simulatedFaceData);
            onClose();
          },
        },
      ]
    );
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.errorContainer}>
            <Ionicons name="camera-outline" size={60} color="#ff6b6b" />
            <Text style={styles.errorText}>Camera permission is required</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <CameraView style={styles.camera} facing="front">
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.closeButtonTop} onPress={onClose}>
              <Ionicons name="close-circle" size={40} color="#fff" />
            </TouchableOpacity>

            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionTitle}>Face ID Setup</Text>
              <Text style={styles.instructionText}>
                Position your face in the frame
              </Text>
            </View>

            <View style={styles.faceFrameContainer}>
              <View style={styles.faceFrame}>
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
              </View>
            </View>

            <View style={styles.statusContainer}>
              <Ionicons name="scan" size={32} color="#00cfff" />
              <Text style={styles.statusText}>Ready to capture</Text>
            </View>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCaptureFace}
            >
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.captureButtonGradient}
              >
                <Ionicons name="scan" size={24} color="#fff" />
                <Text style={styles.captureButtonText}>Capture Face</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  closeButtonTop: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  instructionsContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 12,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: '#aaa',
  },
  faceFrameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: 250,
    height: 300,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#fff',
  },
  cornerTopLeft: {
    top: -3,
    left: -3,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 125,
  },
  cornerTopRight: {
    top: -3,
    right: -3,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 125,
  },
  cornerBottomLeft: {
    bottom: -3,
    left: -3,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 125,
  },
  cornerBottomRight: {
    bottom: -3,
    right: -3,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 125,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 150,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 12,
  },
  statusText: {
    color: '#00cfff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    width: '80%',
  },
  captureButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  captureButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#8a2be2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FaceIDSetup;
