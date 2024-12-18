import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { GoogleMapsService } from '../services/GoogleMapsService';
import { RouteOptimizer } from '../services/RouteOptimizer';

export function RouteForm() {
  const [origin, setOrigin] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [preference, setPreference] = React.useState<"cost" | "time">("cost");
  const [loading, setLoading] = React.useState(false);
  const [route, setRoute] = React.useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Get coordinates for origin and destination
      const originCoords = await GoogleMapsService.getCoordinates(origin);
      const destCoords = await GoogleMapsService.getCoordinates(destination);
      
      // Get optimized route
      const optimizedRoute = await RouteOptimizer.optimizeRoute(
        originCoords,
        destCoords,
        preference
      );
      
      setRoute(optimizedRoute);
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-xl mb-4">Route Optimizer</label>
      
      <textField
        style={styles.input}
        hint="Starting Point"
        text={origin}
        onTextChange={(args) => setOrigin(args.value)}
      />
      
      <textField
        style={styles.input}
        hint="Destination"
        text={destination}
        onTextChange={(args) => setDestination(args.value)}
      />
      
      <label>Optimize for:</label>
      <flexboxLayout style={styles.radioGroup}>
        <button
          className={`${preference === 'cost' ? 'bg-blue-500' : 'bg-gray-300'} p-2 rounded`}
          onTap={() => setPreference('cost')}
        >
          Cost
        </button>
        <button
          className={`${preference === 'time' ? 'bg-blue-500' : 'bg-gray-300'} p-2 rounded`}
          onTap={() => setPreference('time')}
        >
          Time
        </button>
      </flexboxLayout>
      
      <button
        style={styles.button}
        onTap={handleSubmit}
        isEnabled={!loading}
      >
        {loading ? 'Finding Routes...' : 'Find Route'}
      </button>

      {route && (
        <scrollView style={styles.results}>
          <label className="text-lg font-bold">Recommended Route:</label>
          {/* Display route details here */}
        </scrollView>
      )}
    </flexboxLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flexDirection: "column",
    padding: 20,
  },
  input: {
    fontSize: 16,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  button: {
    fontSize: 18,
    color: "white",
    backgroundColor: "#2e6ddf",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  results: {
    marginTop: 20,
  }
});