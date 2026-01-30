import { Flight } from "@/types/flight";
import { Filters } from "@/types/filters";

export function applyFilters(
  flights: Flight[],
  filters: Filters
): Flight[] {
  let result = [...flights];

  // Price filter
  if (filters.maxPrice !== undefined) {
    result = result.filter(
      (flight) => flight.price <= filters.maxPrice!
    );
  }

  // Stops filter
  if (filters.stops && filters.stops.length > 0) {
    result = result.filter((flight) =>
      filters.stops!.includes(flight.stops)
    );
  }

  // Airline filter
  if (filters.airlines && filters.airlines.length > 0) {
    result = result.filter((flight) =>
      filters.airlines!.includes(flight.airline)
    );
  }

  if (filters.sort) {
    result.sort((a, b) => {
      if (filters.sort === "price") {
        return a.price - b.price;
      }

      if (filters.sort === "duration") {
        return a.durationMinutes - b.durationMinutes;
      }

      if (filters.sort === "value") {
        return a.price / a.durationMinutes - b.price / b.durationMinutes;
      }

      return 0;
    });
  }

  return result;
}
