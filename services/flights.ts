import { Flight } from "@/types/flight";
import { FlightSearchParams } from "@/types/flight";

export async function fetchFlights(
  params: FlightSearchParams
): Promise<Flight[]> {
  const query = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    departureDate: params.departureDate,
    adults: String(params.adults ?? 1),
  });

  if (params.returnDate) {
    query.set("returnDate", params.returnDate);
  }

  const res = await fetch(`/api/flights?${query.toString()}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error ?? "Failed to fetch flights");
  }

  const data = await res.json();
  return data.flights;
}
