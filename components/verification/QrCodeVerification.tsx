import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  QrCodeVerificationResult,
  verifyQrCodeWithLLM,
} from "../../services/qrCodeVerification";
import QrCodeVerificationOverlay from "./QrCodeVerificationOverlay";

interface QrCodeVerificationProps {
  onVerify: () => void;
  taskId?: string;
}

export default function QrCodeVerification({
  onVerify,
  taskId,
}: QrCodeVerificationProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [showVerificationOverlay, setShowVerificationOverlay] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<QrCodeVerificationResult | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScanning = async () => {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        Alert.alert(
          "Permission required",
          "Camera permission is needed for QR code scanning"
        );
        return;
      }
    }

    setShowCamera(true);
  };

  const handleBarcodeScanned = async ({
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (scannedData || isScanning) return; // Prevent multiple scans

    console.log("QR Code detected:", data);
    setIsScanning(true);
    setScannedData(data);

    // Show visual feedback for 500ms before closing camera
    setTimeout(async () => {
      setShowCamera(false);
      setShowVerificationOverlay(true);

      // Call the verification service
      const result = await verifyQrCodeWithLLM(data);
      setVerificationResult(result);
      setIsScanning(false);
    }, 500);
  };

  const handleVerificationComplete = () => {
    setShowVerificationOverlay(false);

    if (verificationResult?.verified) {
      // Verification successful - delete task and navigate back
      onVerify();
    } else {
      // Reset for retry
      setScannedData(null);
      setVerificationResult(null);
    }
  };

  // Show camera view
  if (showCamera) {
    return (
      <View style={styles.cameraFullscreen}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowCamera(false);
                setScannedData(null);
                setIsScanning(false);
              }}
            >
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>

            <View style={styles.scannerFrameOverlay}>
              <View
                style={[
                  styles.scannerBorder,
                  isScanning && styles.scannerBorderSuccess,
                ]}
              >
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              {isScanning && (
                <View style={styles.scanSuccessIndicator}>
                  <Ionicons name="checkmark-circle" size={64} color="#10B981" />
                  <Text style={styles.scanSuccessText}>QR Code Detected!</Text>
                </View>
              )}
            </View>

            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                {isScanning
                  ? "Processing QR code..."
                  : "Position QR code within the frame"}
              </Text>
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
              name="qr-code-outline"
              size={24}
              color="#A78BFA"
              style={styles.icon}
            />
            <Text style={styles.title}>Scan QR Code</Text>
          </View>
          <Text style={styles.subtitle}>
            Position the QR code within the frame to scan.
          </Text>

          {/* QR Scanner Area */}
          <View style={styles.scannerContainer}>
            <View style={styles.scannerFrame}>
              <View style={styles.scannerBorder}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              <Ionicons
                name="qr-code"
                size={80}
                color="rgba(167, 139, 250, 0.3)"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleStartScanning}
        >
          <Text style={styles.verifyButtonText}>Start QR Scan</Text>
        </TouchableOpacity>

        <QrCodeVerificationOverlay
          visible={showVerificationOverlay}
          result={verificationResult}
          onComplete={handleVerificationComplete}
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
    // p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-teal-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-400/20
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
    // text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-teal-200
    color: "#C4B5FD", // purple-200
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(147, 197, 253, 0.7)", // text-blue-200/70
    marginBottom: 16,
    lineHeight: 20,
  },
  scannerContainer: {
    // relative h-64 rounded-xl bg-gradient-to-br from-purple-900/30 to-teal-900/30 border border-purple-400/20
    height: 256,
    borderRadius: 12,
    backgroundColor: "rgba(76, 29, 149, 0.3)", // from-purple-900/30
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
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
  scannerBorder: {
    // w-48 h-48 border-4 border-purple-400/30 rounded-lg
    position: "absolute",
    width: 192,
    height: 192,
    borderWidth: 4,
    borderColor: "rgba(167, 139, 250, 0.3)",
    borderRadius: 12,
  },
  corner: {
    // Corner frame styling like in mock: w-8 h-8 border-t-4 border-l-4 border-purple-400 etc.
    position: "absolute",
    width: 32,
    height: 32,
    borderColor: "#A78BFA", // purple-400
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  verifyButton: {
    // w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 via-teal-500 to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/25
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#9333EA", // Primary purple from gradient
    shadowColor: "#9333EA",
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
    alignItems: "center",
    paddingVertical: 50,
  },
  closeButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 24,
    padding: 8,
  },
  scannerFrameOverlay: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 250,
  },
  scannerBorderSuccess: {
    borderColor: "#10B981", // Green when scanned
    borderWidth: 6,
  },
  scanSuccessIndicator: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 16,
    padding: 20,
  },
  scanSuccessText: {
    color: "#10B981",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },
  instructionContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  instructionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
