import axios from 'axios';
import { Alert } from 'react-native';
import { Location } from '../types/location';

const API_KEY = ''; // Replace with your actual API key

export class GoogleMapsService {
  static async getCoordinates(address: string): Promise<Location> {
    try {
      if (!address.trim()) {
        throw new Error('Please enter a valid address');
      }

      const response = await axios.get(
        `ADD_YOUR_API_KEY`
      );

      if (response.data.status === 'ZERO_RESULTS') {
        throw new Error(`Location "${address}" not found`);
      }

      if (response.data.status !== 'OK') {
        throw new Error(`Geocoding error: ${response.data.status}`);
      }

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error('No results found for the given address');
      }

      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          Alert.alert('API Error', 'Invalid Google Maps API key');
        } else {
          Alert.alert('Network Error', 'Failed to connect to Google Maps service');
        }
      } else if (error instanceof Error) {
        Alert.alert('Location Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
      throw error;
    }
  }

  static async getTransitDirections(origin: Location, destination: Location) {
    try {
      const response = await axios.get(
        `ADD_YOUR_API_LINK`
      );

      if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('No transit routes found between these locations');
      }

      if (response.data.status !== 'OK') {
        throw new Error(`Directions error: ${response.data.status}`);
      }

      if (!response.data.routes || response.data.routes.length === 0) {
        throw new Error('No available routes found');
      }

      return response.data.routes[0];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          Alert.alert('API Error', 'Invalid Google Maps API key');
        } else {
          Alert.alert('Network Error', 'Failed to connect to Google Maps service');
        }
      } else if (error instanceof Error) {
        Alert.alert('Route Error', error.message);
      } else {
        Alert.alert('Error', 'Failed to fetch transit directions');
      }
      throw error;
    }
  }
}