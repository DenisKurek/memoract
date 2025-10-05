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

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  icon?: string;
}

export default function LocationSetup({ visible, onClose, onSave }: LocationSetupProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

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
      setShowResults(true);

      // Using Nominatim API for detailed search results
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=10`,
        {
          headers: {
            'User-Agent': 'Memoract/1.0',
          },
        }
      );

      if (response.ok) {
        const results: SearchResult[] = await response.json();
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);

    setMarker({ latitude, longitude });
    setLocationName(result.display_name);
    setShowResults(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getLocationIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      'attraction': 'star',
      'tourism': 'camera',
      'restaurant': 'restaurant',
      'cafe': 'cafe',
      'shop': 'cart',
      'building': 'business',
      'house': 'home',
      'street': 'trail-sign',
      'road': 'trail-sign',
      'place': 'location',
      'city': 'business',
      'town': 'business',
      'village': 'home',
    };

    return iconMap[type] || 'location';
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
            Search for places, attractions, streets or use your current location
          </Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (text.trim() === '') {
                  setShowResults(false);
                  setSearchResults([]);
                }
              }}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="search" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Search Results</Text>
              {searchResults.map((result) => (
                <TouchableOpacity
                  key={result.place_id}
                  style={styles.resultItem}
                  onPress={() => handleSelectResult(result)}
                >
                  <View style={styles.resultIconContainer}>
                    <Ionicons
                      name={getLocationIcon(result.type) as any}
                      size={24}
                      color="#00cfff"
                    />
                  </View>
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultType}>{result.type}</Text>
                    <Text style={styles.resultName} numberOfLines={2}>
                      {result.display_name}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#8a8a8a" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {showResults && searchResults.length === 0 && !loading && (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={48} color="#8a8a8a" />
              <Text style={styles.noResultsText}>No locations found</Text>
              <Text style={styles.noResultsSubtext}>Try a different search term</Text>
            </View>
          )}

          {/* Map Preview */}
          {marker && !showResults && (
            <View style={styles.mapContainer}>
              <View style={styles.mapPreview}>
                <Ionicons name="location" size={80} color="#8a2be2" />
                <Text style={styles.coordinatesText}>
                  📍 {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
                </Text>
                <TouchableOpacity
                  style={styles.viewMapButton}
                  onPress={() => {
                    if (marker) {
                      const url = `https://www.openstreetmap.org/?mlat=${marker.latitude}&mlon=${marker.longitude}#map=16/${marker.latitude}/${marker.longitude}`;
                      Linking.openURL(url);
                    }
                  }}
                >
                  <Ionicons name="map-outline" size={20} color="#00cfff" />
                  <Text style={styles.viewMapText}>View on OpenStreetMap</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Selected Location Info */}
          {marker && !showResults && (
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
          {!showResults && (
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
          )}
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
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 24,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  searchButton: {
    backgroundColor: 'rgba(138, 43, 226, 0.6)',
    borderRadius: 12,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    backgroundColor: 'rgba(30, 30, 47, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 207, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultType: {
    fontSize: 12,
    color: '#00cfff',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  resultName: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 18,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(30, 30, 47, 0.5)',
    borderRadius: 16,
    marginBottom: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginTop: 12,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#8a8a8a',
    marginTop: 4,
  },
  mapContainer: {
    marginBottom: 20,
  },
  mapPreview: {
    backgroundColor: 'rgba(30, 30, 47, 0.8)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  coordinatesText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 12,
    marginBottom: 16,
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 207, 255, 0.1)',
    borderRadius: 8,
  },
  viewMapText: {
    color: '#00cfff',
    fontSize: 14,
    fontWeight: '600',
  },
  locationInfo: {
    backgroundColor: 'rgba(30, 30, 47, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  locationInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  locationInfoText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
  actionButtonsContainer: {
    gap: 12,
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
