import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteOption } from '../types/location';

interface RouteDetailsProps {
  route: RouteOption;
}

export function RouteDetails({ route }: RouteDetailsProps) {
  return (
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
  );
}

const styles = StyleSheet.create({
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