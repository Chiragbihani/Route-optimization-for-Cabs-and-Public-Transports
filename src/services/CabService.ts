import { CabPrice } from '../types/cab';

export class CabService {
  static calculateUberPrice(distance: number): CabPrice {
    const basePrice = 50;
    const pricePerKm = 12;
    const estimatedTime = Math.round(distance * 2); // Rough estimate: 2 min per km
    
    return {
      provider: 'Uber',
      price: basePrice + (distance * pricePerKm),
      estimatedTime
    };
  }

  static calculateOlaPrice(distance: number): CabPrice {
    const basePrice = 45;
    const pricePerKm = 11;
    const estimatedTime = Math.round(distance * 2.2);
    
    return {
      provider: 'Ola',
      price: basePrice + (distance * pricePerKm),
      estimatedTime
    };
  }

  static calculateRapidoPrice(distance: number): CabPrice {
    const basePrice = 30;
    const pricePerKm = 8;
    const estimatedTime = Math.round(distance * 2.5);
    
    return {
      provider: 'Rapido',
      price: basePrice + (distance * pricePerKm),
      estimatedTime
    };
  }

  static getAllCabPrices(distance: number): CabPrice[] {
    return [
      this.calculateUberPrice(distance),
      this.calculateOlaPrice(distance),
      this.calculateRapidoPrice(distance)
    ];
  }
}