import { Flight } from "@/types/flight";
import { Filters } from "@/types/filters";

export function applyFilters(
  flights: Flight[],
  filters: Filters
): Flight[] {
  let result = [...flights];

  if (filters.maxPrice !== undefined) {
    result = result.filter((f) => f.price <= (filters.maxPrice ?? Infinity));
  }

  if (filters.stops && filters.stops.length > 0) {
    result = result.filter((f) => filters.stops!.includes(f.stops));
  }

  if (filters.airlines && filters.airlines.length > 0) {
    result = result.filter((f) => filters.airlines!.includes(f.airline));
  }

  if (filters.sort) {
    result.sort((a, b) => {
      switch (filters.sort) {
        case "price":
          return a.price - b.price;
        case "duration":
          return (a.durationMinutes ?? 0) - (b.durationMinutes ?? 0);
        case "value": {
          const valA = a.durationMinutes > 0 ? a.price / a.durationMinutes : Infinity;
          const valB = b.durationMinutes > 0 ? b.price / b.durationMinutes : Infinity;
          return valA - valB;
        }
        default:
          return 0;
      }
    });
  }

  return result;
}