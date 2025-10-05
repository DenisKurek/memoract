import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import GradientContainer from "@/components/GradientContainer";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  return (
    <GradientContainer>
      <View style={[styles.content, { paddingBottom: tabBarHeight + insets.bottom + 8 }]}>
        {/* Header with new logo design */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#8a2be2', '#da22ff', '#00cfff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              <View style={styles.logoInner}>
                <Ionicons name="checkbox-outline" size={28} color="#fff" />
              </View>
            </LinearGradient>
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoText}>Memoract</Text>
              <Text style={styles.logoSubtext}>Stay on Track</Text>
            </View>
          </View>
        </View>

        {/* Center Content - Big Add Task Button */}
        <View style={styles.centerContent}>
          <TouchableOpacity
            style={styles.bigAddButton}
            onPress={() => router.push('/add-task')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8a2be2', '#00cfff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bigAddButtonGradient}
            >
              <Ionicons name="add-circle-outline" size={64} color="#fff" />
              <Text style={styles.bigAddButtonText}>Add Task</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.hintText}>
            Tap to create a new task reminder
          </Text>
        </View>
      </View>
    </GradientContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8a2be2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoInner: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoTextContainer: {
    gap: 2,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -0.5,
  },
  logoSubtext: {
    fontSize: 13,
    color: '#00cfff',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigAddButton: {
    width: 220,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#8a2be2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  bigAddButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  bigAddButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  hintText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 24,
    textAlign: 'center',
  },
});
