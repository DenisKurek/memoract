import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import SuccessCheckmark from "../SuccessCheckmark";

interface GeolocationVerificationOverlayProps {
  visible: boolean;
  onComplete: () => void;
}

export default function GeolocationVerificationOverlay({
  visible,
  onComplete,
}: GeolocationVerificationOverlayProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowLoading(true);

      // Simulate location verification
      setTimeout(() => {
        setShowLoading(false);
        setShowSuccess(true);
      }, 1500);
    } else {
      setShowLoading(false);
      setShowSuccess(false);
    }
  }, [visible]);

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    onComplete();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        {showLoading && (
          <View style={styles.loadingContainer}>
            <View style={styles.pulseContainer}>
              <Ionicons name="location" size={64} color="#2DD4BF" />
              <Text style={styles.loadingText}>Verifying location...</Text>
            </View>
          </View>
        )}

        <SuccessCheckmark
          visible={showSuccess}
          onComplete={handleSuccessComplete}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  pulseContainer: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
  },
});
