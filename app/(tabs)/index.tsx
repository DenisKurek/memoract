import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header with gradient text */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#8a2be2', '#00cfff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoGradient}
            >
              <Text style={styles.headerTitle}>Memoract</Text>
            </LinearGradient>
            <Text style={styles.headerSubtitle}>
              Your personal task reminder
            </Text>
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
              Tap to create your first task
            </Text>
          </View>

          {/* Bottom Info */}
          <View style={styles.bottomInfo}>
            <View style={styles.infoCard}>
              <Ionicons name="list-outline" size={24} color="#00cfff" />
              <Text style={styles.infoText}>
                View all your tasks in the Task List tab
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoGradient: {
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(138, 43, 226, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  bigAddButton: {
    width: 220,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#8a2be2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
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
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  hintText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 24,
    textAlign: 'center',
  },
  bottomInfo: {
    paddingBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0, 207, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 207, 255, 0.3)',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#00cfff',
    lineHeight: 20,
  },
});
