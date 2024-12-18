import * as ExpoLocation from 'expo-location';
import { Alert } from 'react-native';

export class LocationService {
  static async requestLocationPermissions(): Promise<boolean> {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }
      return true;
    } catch (error) {
      Alert.alert(
        'Permission Error',
        'Location permissions are required to use this app.'
      );
      return false;
    }
  }

  static async getCurrentLocation() {
    try {
      const location = await ExpoLocation.getCurrentPositionAsync({});
      return {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      };
    } catch (error) {
      Alert.alert(
        'Location Error',
        'Unable to get current location. Please check your device settings.'
      );
      throw error;
    }
  }
}