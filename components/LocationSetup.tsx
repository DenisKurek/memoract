import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { LocationData } from '@/types/task-types';
import { saveVerificationData } from '@/hooks/local-db';
import SuccessCheckmark from './SuccessCheckmark';

interface LocationSetupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (location: LocationData) => void;
}

export default function LocationSetup({ visible, onClose, onSave }: LocationSetupProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentPos = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setMarker(currentPos);

      // Get address from coordinates
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (addresses.length > 0) {
          const addr = addresses[0];
          const addressStr = [addr.street, addr.city, addr.region].filter(Boolean).join(', ');
          setLocationName(addressStr);
        }
      } catch {
        console.log('Could not get address');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      // Alert.alert('Error', 'Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        setMarker({ latitude, longitude });
        setLocationName(searchQuery);
      } else {
        // Alert.alert('Not Found', 'Location not found');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      // Alert.alert('Error', 'Failed to search location');
    } finally {
      setLoading(false);
    }
  };

  const openInOpenStreetMap = () => {
    if (marker) {
      const url = `https://www.openstreetmap.org/?mlat=${marker.latitude}&mlon=${marker.longitude}#map=16/${marker.latitude}/${marker.longitude}`;
      Linking.openURL(url);
    }
  };

  const handleSaveLocation = async () => {
    if (marker) {
      try {
        const locationToSave: LocationData = {
          latitude: marker.latitude,
          longitude: marker.longitude,
          address: locationName || `${marker.latitude.toFixed(6)}, ${marker.longitude.toFixed(6)}`,
        };

        // Save location to secure storage
        await saveVerificationData(`location_${Date.now()}`, locationToSave);
        setShowSuccess(true);
      } catch (error) {
        console.error('Error saving location:', error);
      }
    }
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    if (marker) {
      const locationToSave: LocationData = {
        latitude: marker.latitude,
        longitude: marker.longitude,
        address: locationName || `${marker.latitude.toFixed(6)}, ${marker.longitude.toFixed(6)}`,
      };
      onSave(locationToSave);
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Location</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Use your current location or search for an address
          </Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Map Preview */}
          {marker && (
            <View style={styles.mapContainer}>
              <View style={styles.mapPreview}>
                <Ionicons name="location" size={80} color="#8a2be2" />
                <Text style={styles.coordinatesText}>
                  📍 {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
                </Text>
                <TouchableOpacity
                  style={styles.viewMapButton}
                  onPress={openInOpenStreetMap}
                >
                  <Ionicons name="map-outline" size={20} color="#00cfff" />
                  <Text style={styles.viewMapText}>View on OpenStreetMap</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Selected Location Info */}
          {marker && (
            <View style={styles.locationInfo}>
              <View style={styles.locationInfoHeader}>
                <Ionicons name="location" size={24} color="#00cfff" />
                <Text style={styles.locationInfoTitle}>Selected Location</Text>
              </View>
              <Text style={styles.locationInfoText}>
                {locationName || `${marker.latitude.toFixed(6)}, ${marker.longitude.toFixed(6)}`}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={getCurrentLocation}
              disabled={loading}
            >
              <LinearGradient
                colors={['#8a2be2', '#00cfff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="locate" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Use Current Location</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveLocation}
              disabled={!marker}
            >
              <LinearGradient
                colors={marker ? ['#4CAF50', '#45a049'] : ['#555', '#444']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.buttonText}>Save Location</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <SuccessCheckmark visible={showSuccess} onComplete={handleSuccessComplete} />
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  searchButton: {
    backgroundColor: '#8a2be2',
    borderRadius: 12,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    minHeight: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(138, 43, 226, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  mapPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  coordinatesText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 207, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 207, 255, 0.5)',
  },
  viewMapText: {
    color: '#00cfff',
    fontSize: 14,
    fontWeight: '600',
  },
  locationInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 207, 255, 0.3)',
  },
  locationInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00cfff',
  },
  locationInfoText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 32,
  },
  actionButtonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
