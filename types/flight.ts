export type Flight = {
  id: string;
  airline: string;
  price: number;
  stops: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
};

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
};