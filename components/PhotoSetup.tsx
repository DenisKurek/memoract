import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { saveVerificationData } from '@/hooks/local-db';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PhotoSetupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (photoUri: string) => void;
}

function PhotoSetup({ visible, onClose, onSave }: PhotoSetupProps) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();

  const handleTakePhoto = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera permission is needed');
        return;
      }
    }

    setShowCamera(true);
  };

  const handlePickFromGallery = async () => {
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (mediaPermission.status !== 'granted') {
      Alert.alert('Permission Required', 'Media library permission is needed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSavePhoto = async () => {
    if (photoUri) {
      try {
        // Save photo URI to secure storage
        await saveVerificationData(`photo_${Date.now()}`, photoUri);
        onSave(photoUri);
        onClose();
      } catch (error) {
        console.error('Error saving photo:', error);
        Alert.alert('Error', 'Failed to save photo');
      }
    } else {
      Alert.alert('No Photo', 'Please take or select a photo first');
    }
  };

  const handleRetake = () => {
    setPhotoUri(null);
  };

  if (showCamera) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing="back">
            <View style={styles.cameraOverlay}>
              <TouchableOpacity
                style={[styles.closeButton, { top: (insets?.top ?? 0) + 12 }]}
                onPress={() => setShowCamera(false)}
              >
                <Ionicons name="close-circle" size={40} color="#fff" />
              </TouchableOpacity>

              <View style={[styles.captureButtonContainer, { bottom: (insets?.bottom ?? 0) + 24 }]}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={() => {
                    // Simulate taking a photo
                    const photoUri = `photo_${Date.now()}.jpg`;
                    setPhotoUri(photoUri);
                    setShowCamera(false);
                  }}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Reference Photo</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Take or select a photo. You&apos;ll need to take a similar photo later to verify the task.
          </Text>

          {photoUri ? (
            <View style={styles.photoPreviewContainer}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="camera-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
              <Text style={styles.placeholderText}>No photo selected</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            {!photoUri && (
              <>
                <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
                  <LinearGradient
                    colors={['#8a2be2', '#00cfff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="camera" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Take Photo</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handlePickFromGallery}>
                  <LinearGradient
                    colors={['#6a1b9a', '#8e24aa']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="images" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Choose from Gallery</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {photoUri && (
              <TouchableOpacity style={styles.actionButton} onPress={handleSavePhoto}>
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
            )}
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
  photoPreviewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoPreview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    padding: 8,
  },
  retakeText: {
    color: '#00cfff',
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 24,
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 12,
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
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
  },
  captureButtonContainer: {
    position: 'absolute',
    alignSelf: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
});

export default PhotoSetup;
