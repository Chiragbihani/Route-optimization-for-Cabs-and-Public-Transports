import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { GoogleMapsService } from '../services/GoogleMapsService';
import { LocationService } from '../services/LocationService';
import { RouteOptimizer } from '../services/RouteOptimizer';
import { Location, RouteOption } from '../types/location';

export default function RouteForm() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [preference, setPreference] = useState<'cost' | 'time'>('cost');
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState<RouteOption | null>(null);
  const [originCoords, setOriginCoords] = useState<Location | null>(null);
  const [destCoords, setDestCoords] = useState<Location | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const granted = await LocationService.requestLocationPermissions();
    setLocationPermissionGranted(granted);
  };

  const validateInputs = () => {
    if (!origin.trim()) {
      Alert.alert('Error', 'Please enter a starting point');
      return false;
    }
    if (!destination.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!locationPermissionGranted) {
      Alert.alert('Permission Required', 'Location permission is needed to use this feature');
      await requestLocationPermission();
      return;
    }

    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      setRoute(null);
      setOriginCoords(null);
      setDestCoords(null);

      const originLocation = await GoogleMapsService.getCoordinates(origin);
      const destLocation = await GoogleMapsService.getCoordinates(destination);
      
      setOriginCoords(originLocation);
      setDestCoords(destLocation);
      
      const optimizedRoute = await RouteOptimizer.optimizeRoute(
        originLocation,
        destLocation,
        preference
      );
      
      setRoute(optimizedRoute);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput
            style={styles.input}
            placeholder="Starting Point (e.g., 123 Main St)"
            value={origin}
            onChangeText={setOrigin}
            editable={!loading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Destination (e.g., 456 Park Ave)"
            value={destination}
            onChangeText={setDestination}
            editable={!loading}
          />
          
          <Text style={styles.label}>Optimize for:</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={[styles.radioButton, preference === 'cost' && styles.radioButtonActive]}
              onPress={() => setPreference('cost')}
              disabled={loading}
            >
              <Text style={[styles.radioText, preference === 'cost' && styles.radioTextActive]}>
                Cost
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.radioButton, preference === 'time' && styles.radioButtonActive]}
              onPress={() => setPreference('time')}
              disabled={loading}
            >
              <Text style={[styles.radioText, preference === 'time' && styles.radioTextActive]}>
                Time
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Find Route</Text>
            )}
          </TouchableOpacity>

          {route && (
            <View style={styles.results}>
              <Text style={styles.resultsTitle}>Recommended Route:</Text>
              <Text style={styles.resultsSummary}>
                Total Price: ₹{route.totalPrice.toFixed(2)} • 
                Total Time: {route.totalTime} mins
              </Text>
              
              {route.steps.map((step, index) => (
                <View key={index} style={styles.step}>
                  <Text style={styles.stepTitle}>
                    Step {index + 1}: {step.mode.replace('_', ' ')}
                  </Text>
                  <Text style={styles.stepDetail}>Distance: {step.distance.toFixed(2)} km</Text>
                  <Text style={styles.stepDetail}>Duration: {step.duration} mins</Text>
                  <Text style={styles.stepDetail}>Price: ₹{step.price.toFixed(2)}</Text>
                  {step.mode === 'CAB' && step.details?.provider && (
                    <Text style={styles.stepDetail}>Provider: {step.details.provider}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  radioButtonActive: {
    backgroundColor: '#2e6ddf',
  },
  radioText: {
    color: '#333',
  },
  radioTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#2e6ddf',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#93b8f0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  results: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  resultsSummary: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  step: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});