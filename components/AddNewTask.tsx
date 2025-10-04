import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface CompletionMethod {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const completionMethods: CompletionMethod[] = [
  { label: 'Scan QR Code', value: 'qr', icon: 'qr-code-outline' },
  { label: 'Use Geolocation', value: 'geo', icon: 'location-outline' },
  { label: 'Add Photo', value: 'photo', icon: 'camera-outline' },
  { label: 'Face ID', value: 'face', icon: 'scan-outline' },
];

export default function AddNewTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [completionMethod, setCompletionMethod] = useState('');
  const [showMethodPicker, setShowMethodPicker] = useState(false);

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Add New Task</Text>
          <Text style={styles.subtitle}>Create something to remember</Text>

          {/* Task Title */}
          <Text style={styles.label}>Task Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task title..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={title}
            onChangeText={setTitle}
          />

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Add details about your task..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Date and Time Row */}
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <View style={styles.iconLabelRow}>
                <Ionicons name="calendar-outline" size={18} color="#8a8a8a" />
                <Text style={styles.label}>Date</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="dd.mm.yyyy"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={date}
                onChangeText={setDate}
              />
            </View>
            <View style={styles.halfWidth}>
              <View style={styles.iconLabelRow}>
                <Ionicons name="time-outline" size={18} color="#8a8a8a" />
                <Text style={styles.label}>Time</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="--:--"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>

          {/* Completion Method */}
          <Text style={styles.label}>Completion Method</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowMethodPicker(!showMethodPicker)}
          >
            <Text style={styles.selectButtonText}>
              {completionMethod || 'Select completion method...'}
            </Text>
            <Ionicons
              name={showMethodPicker ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#8a8a8a"
            />
          </TouchableOpacity>

          {/* Completion Method Options */}
          {showMethodPicker && (
            <View style={styles.optionsContainer}>
              {completionMethods.map((method) => (
                <TouchableOpacity
                  key={method.value}
                  style={[
                    styles.option,
                    completionMethod === method.label && styles.optionSelected,
                  ]}
                  onPress={() => {
                    setCompletionMethod(method.label);
                    setShowMethodPicker(false);
                  }}
                >
                  <Ionicons
                    name={method.icon}
                    size={20}
                    color={
                      completionMethod === method.label ? '#00cfff' : '#fff'
                    }
                  />
                  <Text
                    style={[
                      styles.optionText,
                      completionMethod === method.label &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#8a8a8a',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textarea: {
    height: 100,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    marginLeft: 4,
  },
  selectButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  optionsContainer: {
    backgroundColor: '#1e1e2f',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionSelected: {
    backgroundColor: 'rgba(0, 207, 255, 0.1)',
  },
  optionText: {
    fontSize: 14,
    color: '#fff',
  },
  optionTextSelected: {
    color: '#00cfff',
    fontWeight: '600',
  },
});
