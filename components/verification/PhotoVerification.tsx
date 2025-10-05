import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  PhotoVerificationResult,
  verifyPhotoWithLLM,
} from "../../services/photoVerification";
import PhotoVerificationOverlay from "./PhotoVerificationOverlay";

interface PhotoVerificationProps {
  onVerify: () => void;
  taskId?: string;
}

export default function PhotoVerification({
  onVerify,
  taskId,
}: PhotoVerificationProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showVerificationOverlay, setShowVerificationOverlay] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<PhotoVerificationResult | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const handleStartCamera = async () => {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        Alert.alert(
          "Permission required",
          "Camera permission is needed for photo verification"
        );
        return;
      }
    }

    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: false,
        });

        if (photo) {
          setCapturedPhoto(photo.uri);
          setShowCamera(false);
        }
      } catch (error) {
        console.error("Error taking photo:", error);
        Alert.alert("Error", "Failed to capture photo");
      }
    }
  };

  const handleVerifyPhoto = async () => {
    if (!capturedPhoto) return;

    setShowVerificationOverlay(true);

    // Call the LLM verification service
    const result = await verifyPhotoWithLLM(capturedPhoto);
    setVerificationResult(result);
  };

  const handleVerificationComplete = () => {
    setShowVerificationOverlay(false);

    if (verificationResult?.verified) {
      // Verification successful - delete task and navigate back
      onVerify();
    } else {
      // Verification failed - allow retry
      setCapturedPhoto(null);
      setVerificationResult(null);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setVerificationResult(null);
  };

  // Show camera view
  if (showCamera) {
    return (
      <View style={styles.cameraFullscreen}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>

            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // Show captured photo preview
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <View style={styles.verificationCard}>
          <View style={styles.header}>
            <Ionicons
              name="camera-outline"
              size={24}
              color="#C4B5FD"
              style={styles.icon}
            />
            <Text style={styles.title}>Photo Preview</Text>
          </View>
          <Text style={styles.subtitle}>
            Review your photo and verify it with AI
          </Text>

          <Image source={{ uri: capturedPhoto }} style={styles.photoPreview} />

          <View style={styles.previewButtons}>
            <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
              <Ionicons name="refresh" size={20} color="#C4B5FD" />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.verifyPhotoButton}
              onPress={handleVerifyPhoto}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.verifyPhotoButtonText}>Verify with AI</Text>
            </TouchableOpacity>
          </View>
        </View>

        <PhotoVerificationOverlay
          visible={showVerificationOverlay}
          result={verificationResult}
          onComplete={handleVerificationComplete}
        />
      </View>
    );
  }

  // Initial state - show camera button
  return (
    <View style={styles.container}>
      <View style={styles.verificationCard}>
        <View style={styles.header}>
          <Ionicons
            name="camera-outline"
            size={24}
            color="#C4B5FD"
            style={styles.icon}
          />
          <Text style={styles.title}>Take Photo</Text>
        </View>
        <Text style={styles.subtitle}>
          Take a photo of the reference image. AI will compare and verify if it
          matches.
        </Text>

        {/* Camera Area */}
        <View style={styles.cameraContainer}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleStartCamera}
          >
            <Ionicons
              name="camera"
              size={48}
              color="rgba(196, 181, 253, 0.5)"
            />
            <Text style={styles.cameraText}>Tap to capture photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={handleStartCamera}>
        <Text style={styles.verifyButtonText}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  verificationCard: {
    // p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 backdrop-blur-sm border border-purple-400/20
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  icon: {
    // Icon styling handled by Ionicons
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    // text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200
    color: "#C4B5FD", // purple-200
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(147, 197, 253, 0.7)", // text-blue-200/70
    marginBottom: 16,
    lineHeight: 20,
  },
  cameraContainer: {
    // w-full h-64 rounded-xl
    height: 256,
    borderRadius: 12,
    backgroundColor: "rgba(76, 29, 149, 0.05)", // Very light purple background
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    // w-full h-64 rounded-xl border-2 border-dashed border-purple-400/30 hover:border-purple-400/50 bg-purple-500/5 hover:bg-purple-500/10
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(167, 139, 250, 0.3)", // border-purple-400/30
    borderRadius: 12,
    backgroundColor: "rgba(147, 51, 234, 0.05)", // bg-purple-500/5
  },
  cameraText: {
    fontSize: 14,
    color: "rgba(196, 181, 253, 0.7)", // text-purple-200/70
  },
  verifyButton: {
    // w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 text-white font-semibold shadow-lg shadow-purple-500/25
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#3B82F6", // Primary blue from gradient
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  // Camera view styles
  cameraFullscreen: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 24,
    padding: 8,
  },
  cameraControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#fff",
  },
  // Photo preview styles
  photoPreview: {
    width: "100%",
    height: 256,
    borderRadius: 12,
    backgroundColor: "rgba(76, 29, 149, 0.05)",
    marginBottom: 16,
  },
  previewButtons: {
    flexDirection: "row",
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.3)",
  },
  retakeButtonText: {
    color: "#C4B5FD",
    fontSize: 14,
    fontWeight: "600",
  },
  verifyPhotoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyPhotoButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
