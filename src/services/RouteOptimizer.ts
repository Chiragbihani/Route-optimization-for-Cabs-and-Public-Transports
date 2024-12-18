import { GoogleMapsService } from './GoogleMapsService';
import { CabService } from './CabService';
import { Location, RouteOption, RouteStep } from '../types/location';
import { CabPrice } from '../types/cab';

export class RouteOptimizer {
  static async optimizeRoute(
    origin: Location,
    destination: Location,
    preference: 'cost' | 'time'
  ): Promise<RouteOption> {
    try {
      const directDistance = this.calculateDistance(origin, destination);
      const cabPrices = CabService.getAllCabPrices(directDistance);

      // Direct cab route
      const directCabRoute = this.createDirectCabRoute(directDistance, cabPrices);
      let routeOptions: RouteOption[] = [directCabRoute];

      try {
        // Try to get public transport route
        const transitRoute = await GoogleMapsService.getTransitDirections(origin, destination);
        if (transitRoute) {
          const mixedRoute = await this.createMixedRoute(transitRoute, origin, destination);
          routeOptions.push(mixedRoute);
        }
      } catch (error) {
        console.log('No public transport routes available');
      }

      // Return the optimal route based on preference
      return preference === 'cost'
        ? this.findCheapestRoute(routeOptions)
        : this.findFastestRoute(routeOptions);
    } catch (error) {
      console.error('Error optimizing route:', error);
      throw error;
    }
  }

  private static createDirectCabRoute(distance: number, cabPrices: CabPrice[]): RouteOption {
    const bestCabPrice = Math.min(...cabPrices.map(cab => cab.price));
    const bestCab = cabPrices.find(cab => cab.price === bestCabPrice);

    if (!bestCab) {
      throw new Error('No cab prices available');
    }

    return {
      type: 'CAB',
      steps: [{
        mode: 'CAB',
        distance,
        duration: bestCab.estimatedTime,
        price: bestCab.price,
        details: bestCab
      }],
      totalPrice: bestCab.price,
      totalTime: bestCab.estimatedTime
    };
  }

  private static async createMixedRoute(transitRoute: any, origin: Location, destination: Location): Promise<RouteOption> {
    const steps: RouteStep[] = [];
    let totalPrice = 0;
    let totalTime = 0;

    // Process each step in the transit route
    for (const leg of transitRoute.legs) {
      for (const step of leg.steps) {
        const distance = step.distance.value / 1000; // Convert to km
        const duration = step.duration.value / 60; // Convert to minutes

        if (step.travel_mode === 'TRANSIT') {
          steps.push({
            mode: 'PUBLIC_TRANSPORT',
            distance,
            duration,
            price: this.calculateTransitPrice(distance),
            details: step
          });
        } else if (step.travel_mode === 'WALKING' && distance <= 1) {
          steps.push({
            mode: 'WALK',
            distance,
            duration,
            price: 0,
            details: step
          });
        } else {
          // Use cab for distances > 1km
          const cabPrices = CabService.getAllCabPrices(distance);
          const bestCabPrice = Math.min(...cabPrices.map(cab => cab.price));
          const bestCab = cabPrices.find(cab => cab.price === bestCabPrice);

          if (!bestCab) {
            throw new Error('No cab prices available for mixed route');
          }

          steps.push({
            mode: 'CAB',
            distance,
            duration: bestCab.estimatedTime,
            price: bestCab.price,
            details: bestCab
          });
        }
      }
    }

    // Calculate totals
    totalPrice = steps.reduce((sum, step) => sum + step.price, 0);
    totalTime = steps.reduce((sum, step) => sum + step.duration, 0);

    return {
      type: 'MIXED',
      steps,
      totalPrice,
      totalTime
    };
  }

  private static calculateTransitPrice(distance: number): number {
    // Basic public transport pricing logic
    const basePrice = 10;
    const pricePerKm = 2;
    return basePrice + (distance * pricePerKm);
  }

  private static calculateDistance(point1: Location, point2: Location): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(point2.lat - point1.lat);
    const dLon = this.deg2rad(point2.lng - point1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(point1.lat)) * Math.cos(this.deg2rad(point2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private static findCheapestRoute(routes: RouteOption[]): RouteOption {
    return routes.reduce((prev, current) => 
      prev.totalPrice < current.totalPrice ? prev : current
    );
  }

  private static findFastestRoute(routes: RouteOption[]): RouteOption {
    return routes.reduce((prev, current) => 
      prev.totalTime < current.totalTime ? prev : current
    );
  }
}