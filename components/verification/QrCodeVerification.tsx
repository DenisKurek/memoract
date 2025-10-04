import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QrCodeVerificationProps {
  onVerify: () => void;
}

export default function QrCodeVerification({
  onVerify,
}: QrCodeVerificationProps) {
  return (
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

      <TouchableOpacity style={styles.verifyButton} onPress={onVerify}>
        <Text style={styles.verifyButtonText}>Start QR Scan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
