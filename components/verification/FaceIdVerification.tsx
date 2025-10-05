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
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FaceVerificationResult,
  verifyFaceWithLLM,
} from "../../services/faceVerification";
import FaceVerificationOverlay from "./FaceVerificationOverlay";

interface FaceIdVerificationProps {
  onVerify: () => void;
}

export default function FaceIdVerification({
  onVerify,
}: FaceIdVerificationProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVerificationOverlay, setShowVerificationOverlay] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<FaceVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const handleStartScan = async () => {
    if (!permission) {
      // Camera permissions are still loading
      return;
    }

    if (!permission.granted) {
      // Camera permissions are not granted yet
      const response = await requestPermission();
      if (!response.granted) {
        Alert.alert(
          "Permission required",
          "Camera permission is needed for Face ID verification"
        );
        return;
      }
    }

    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: false,
        });

        if (photo) {
          setCapturedPhoto(photo.uri);
          setShowCamera(false);

          // Simulate processing delay
          setTimeout(() => {
            setIsProcessing(false);
            onVerify();
          }, 2000);
        }
      } catch (error) {
        console.error("Error taking photo:", error);
        setIsProcessing(false);
        Alert.alert("Error", "Failed to capture photo");
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setShowCamera(true);
  };

  const handleVerifyFace = async () => {
    if (!capturedPhoto) return;

    setIsVerifying(true);
    setShowVerificationOverlay(true);

    try {
      const result = await verifyFaceWithLLM(capturedPhoto);
      setVerificationResult(result);

      if (result.success) {
        // Wait a bit to show success before calling onVerify
        setTimeout(() => {
          onVerify();
        }, 2000);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        success: false,
        confidence: 0,
        message: "Verification service unavailable. Please try again later.",
        processingTime: 0,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOverlayClose = () => {
    setShowVerificationOverlay(false);
    setVerificationResult(null);
  };

  const handleRetryVerification = () => {
    setShowVerificationOverlay(false);
    setVerificationResult(null);
    setCapturedPhoto(null);
    setShowCamera(true);
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
          mode="picture"
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.scanFrame}>
              <View style={styles.scannerCircle} />
              <Text style={styles.cameraInstructions}>
                Position your face within the circle
              </Text>
            </View>

            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCamera(false)}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                disabled={isProcessing}
              >
                <View style={styles.captureInner} />
              </TouchableOpacity>

              <View style={styles.placeholderButton} />
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.verificationCard}>
          <View style={styles.header}>
            <Ionicons
              name="scan-outline"
              size={24}
              color="#93C5FD"
              style={styles.icon}
            />
            <Text style={styles.title}>Face ID Verification</Text>
          </View>
          <Text style={styles.subtitle}>
            Position your face within the frame for verification.
          </Text>

          {capturedPhoto ? (
            <View style={styles.photoPreviewContainer}>
              <Image
                source={{ uri: capturedPhoto }}
                style={styles.photoPreview}
              />
              <View style={styles.photoOverlay}>
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={retakePhoto}
                >
                  <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.retakeText}>Retake</Text>
                </TouchableOpacity>
              </View>
              {isProcessing && (
                <View style={styles.processingOverlay}>
                  <View style={styles.processingIndicator} />
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.scannerContainer}>
              <View style={styles.scannerFrame}>
                <View style={styles.scannerCircle} />
                <Ionicons
                  name="scan"
                  size={80}
                  color="rgba(147, 197, 253, 0.3)"
                />
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            capturedPhoto && styles.verifyButtonDisabled,
          ]}
          onPress={capturedPhoto ? handleVerifyFace : handleStartScan}
          disabled={isProcessing || isVerifying}
        >
          <Text style={styles.verifyButtonText}>
            {capturedPhoto ? "Verify Face" : "Start Face Scan"}
          </Text>
        </TouchableOpacity>

        <FaceVerificationOverlay
          visible={showVerificationOverlay}
          isProcessing={isVerifying}
          result={verificationResult}
          onClose={handleOverlayClose}
          onRetry={handleRetryVerification}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 24,
  },
  verificationCard: {
    // p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10 backdrop-blur-sm border border-blue-400/20
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.2)",
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
    // text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200
    color: "#93C5FD", // blue-200 approximation
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(147, 197, 253, 0.7)", // text-blue-200/70
    marginBottom: 16,
    lineHeight: 20,
  },
  scannerContainer: {
    // relative h-64 rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-400/20
    height: 256,
    borderRadius: 12,
    backgroundColor: "rgba(30, 58, 138, 0.3)", // from-blue-900/30
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  scannerFrame: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerCircle: {
    // w-48 h-48 rounded-full border-4 border-blue-400/30 border-dashed animate-spin-slow
    position: "absolute",
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 4,
    borderColor: "rgba(96, 165, 250, 0.3)",
    borderStyle: "dashed",
  },
  verifyButton: {
    // w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 text-white font-semibold shadow-lg shadow-blue-500/25
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
  verifyButtonDisabled: {
    backgroundColor: "#059669", // teal-600 for verified state
  },
  // Camera styles
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  scanFrame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraInstructions: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 40,
  },
  cancelButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
  placeholderButton: {
    width: 44,
    height: 44,
  },
  // Photo preview styles
  photoPreviewContainer: {
    height: 256,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  photoOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  retakeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  retakeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  processingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "rgba(59, 130, 246, 0.3)",
    borderTopColor: "#3B82F6",
    marginBottom: 12,
  },
  processingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
