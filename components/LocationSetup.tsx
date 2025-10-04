import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { LocationData } from '@/types/task-types';

interface LocationSetupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (location: LocationData) => void;
}

export default function LocationSetup({ visible, onClose, onSave }: LocationSetupProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('');

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
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentPos: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Get address from coordinates
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (addresses.length > 0) {
          const addr = addresses[0];
          const addressStr = [addr.street, addr.city, addr.region].filter(Boolean).join(', ');
          currentPos.address = addressStr;
          setLocationName(addressStr);
        }
      } catch {
        console.log('Could not get address');
      }

      setSelectedLocation(currentPos);
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Failed to get current location');
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
        setSelectedLocation({ latitude, longitude, address: searchQuery });
        setLocationName(searchQuery);
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Failed to search location');
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = () => {
    if (selectedLocation) {
      const url = `https://www.google.com/maps/search/?api=1&query=${selectedLocation.latitude},${selectedLocation.longitude}`;
      Linking.openURL(url);
    }
  };

  const handleSaveLocation = () => {
    if (selectedLocation) {
      onSave(selectedLocation);
      onClose();
    } else {
      alert('Please select a location');
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Location</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Use current location or search for an address
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

        {/* Location Display */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8a2be2" />
            <Text style={styles.loadingText}>Getting location...</Text>
          </View>
        ) : selectedLocation ? (
          <View style={styles.locationInfoContainer}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="location" size={80} color="#8a2be2" />
              <View style={styles.coordinatesBox}>
                <Text style={styles.coordinatesLabel}>Selected Location:</Text>
                {locationName ? (
                  <Text style={styles.locationName}>{locationName}</Text>
                ) : null}
                <Text style={styles.coordinatesText}>
                  Lat: {selectedLocation.latitude.toFixed(6)}
                </Text>
                <Text style={styles.coordinatesText}>
                  Lng: {selectedLocation.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={getCurrentLocation}
              >
                <LinearGradient
                  colors={['#8a2be2', '#00cfff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="locate" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Use Current Location</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={openInGoogleMaps}
              >
                <LinearGradient
                  colors={['#6a1b9a', '#8e24aa']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="map" size={20} color="#fff" />
                  <Text style={styles.buttonText}>View in Google Maps</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Ionicons name="location-outline" size={60} color="#ff6b6b" />
            <Text style={styles.errorText}>Failed to get location</Text>
            <TouchableOpacity onPress={getCurrentLocation} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructions}>
          <Ionicons name="information-circle" size={20} color="#00cfff" />
          <Text style={styles.instructionText}>
            Use current location, search for an address, or view in Google Maps to verify
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveLocation}
          disabled={!selectedLocation}
        >
          <LinearGradient
            colors={selectedLocation ? ['#4CAF50', '#45a049'] : ['#555', '#444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Save Location</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
    padding: 20,
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
    marginBottom: 20,
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
  locationInfoContainer: {
    flex: 1,
    gap: 16,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(138, 43, 226, 0.3)',
    borderStyle: 'dashed',
    padding: 20,
  },
  coordinatesBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  coordinatesLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  locationName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  coordinatesText: {
    fontSize: 14,
    color: '#00cfff',
    fontFamily: 'monospace',
    marginVertical: 2,
  },
  actionButtonsContainer: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginTop: 12,
  },
  retryButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#8a2be2',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'rgba(0, 207, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
  },
  instructionText: {
    flex: 1,
    fontSize: 12,
    color: '#00cfff',
    lineHeight: 18,
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
