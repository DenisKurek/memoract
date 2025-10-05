import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GeolocationVerificationOverlay from "./GeolocationVerificationOverlay";
import { format, parseISO } from "date-fns";

interface GeolocationVerificationProps {
  onVerify: () => void;
  taskId?: string;
  datetime: string;
}

export default function GeolocationVerification({
  onVerify,
  taskId,
  datetime,
}: GeolocationVerificationProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  // Safely format the datetime
  const formatDate = () => {
    try {
      if (!datetime) return "No date";
      return format(parseISO(datetime), "yyyy-MM-dd");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const formatTime = () => {
    try {
      if (!datetime) return "No time";
      return format(parseISO(datetime), "HH:mm");
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid time";
    }
  };

  const handleVerifyClick = () => {
    setShowOverlay(true);
  };

  const handleVerificationComplete = async () => {
    setShowOverlay(false);
    // Call onVerify which will handle task deletion and navigation
    onVerify();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Date/Time Display */}
        <View style={styles.dateTimeSection}>
          <View style={styles.dateBox}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color="#5EEAD4"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.dateText}>{formatDate()}</Text>
          </View>
          <View style={styles.timeBox}>
            <Ionicons
              name="time-outline"
              size={14}
              color="#93C5FD"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.timeText}>{formatTime()}</Text>
          </View>
        </View>

        <View style={styles.verificationCard}>
          <View style={styles.header}>
            <Ionicons
              name="location-outline"
              size={24}
              color="#2DD4BF"
              style={styles.icon}
            />
            <Text style={styles.title}>Check Location</Text>
          </View>
          <Text style={styles.subtitle}>
            Your device will verify if you are at the correct location.
          </Text>

          {/* Location Area */}
          <View style={styles.locationContainer}>
            <Ionicons
              name="location"
              size={64}
              color="rgba(45, 212, 191, 0.3)"
            />
            {/* Pulse rings */}
            <View style={[styles.pulseRing, styles.ring1]} />
            <View style={[styles.pulseRing, styles.ring2]} />
            <View style={[styles.pulseRing, styles.ring3]} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyClick}
        >
          <Text style={styles.verifyButtonText}>Verify Location</Text>
        </TouchableOpacity>

        <GeolocationVerificationOverlay
          visible={showOverlay}
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
  dateTimeSection: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 58, 138, 0.6)", // darker blue
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(45, 212, 191, 0.3)",
  },
  dateText: {
    color: "#5EEAD4", // teal-200
    fontSize: 13,
    fontWeight: "600",
  },
  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 58, 138, 0.6)", // darker blue
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.3)",
  },
  timeText: {
    color: "#93C5FD", // blue-200
    fontSize: 13,
    fontWeight: "600",
  },
  verificationCard: {
    // p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-teal-400/20
    backgroundColor: "rgba(20, 184, 166, 0.1)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(45, 212, 191, 0.2)",
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
    // text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-blue-200
    color: "#5EEAD4", // teal-200
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(147, 197, 253, 0.7)", // text-blue-200/70
    marginBottom: 16,
    lineHeight: 20,
  },
  locationContainer: {
    // h-48 rounded-xl bg-gradient-to-br from-teal-900/30 to-blue-900/30 border border-teal-400/20
    height: 192,
    borderRadius: 12,
    backgroundColor: "rgba(19, 78, 74, 0.3)", // from-teal-900/30
    borderWidth: 1,
    borderColor: "rgba(45, 212, 191, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  locationCenter: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  pulseRing: {
    position: "absolute",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "rgba(45, 212, 191, 0.3)", // teal pulse
  },
  ring1: {
    width: 120,
    height: 120,
    opacity: 0.8,
  },
  ring2: {
    width: 160,
    height: 160,
    opacity: 0.5,
  },
  ring3: {
    width: 200,
    height: 200,
    opacity: 0.2,
  },
  verifyButton: {
    // w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 text-white font-semibold shadow-lg shadow-teal-500/25
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#14B8A6", // Primary teal from gradient
    shadowColor: "#14B8A6",
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
