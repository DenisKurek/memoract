import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PhotoVerificationProps {
  onVerify: () => void;
}

export default function PhotoVerification({
  onVerify,
}: PhotoVerificationProps) {
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
          <TouchableOpacity style={styles.cameraButton} onPress={onVerify}>
            <Ionicons
              name="camera"
              size={48}
              color="rgba(196, 181, 253, 0.5)"
            />
            <Text style={styles.cameraText}>Tap to capture photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={onVerify}>
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
});
