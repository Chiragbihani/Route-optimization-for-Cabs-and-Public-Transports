export interface Location {
  lat: number;
  lng: number;
}

export interface RouteStep {
  mode: 'WALK' | 'CAB' | 'PUBLIC_TRANSPORT';
  distance: number;
  duration: number;
  price: number;
  details?: {
    provider?: string;
    start_location?: Location;
    end_location?: Location;
  };
}

export interface RouteOption {
  type: 'WALK' | 'CAB' | 'PUBLIC_TRANSPORT' | 'MIXED';
  steps: RouteStep[];
  totalPrice: number;
  totalTime: number;
}