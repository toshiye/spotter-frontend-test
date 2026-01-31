"use client";

import { useState, useMemo } from "react";
import { fetchFlights } from "@/services/flights";
import { Flight } from "@/types/flight";
import { FlightSearchParams } from "@/types/flight";
import FlightSearchForm from "@/components/FlightSearchForm";
import FlightList from "@/components/FlightList";
import { Filters } from "@/types/filters";
import { applyFilters } from "@/utils/applyFilters";
import FiltersPanel from "@/components/FiltersPanel";
import PriceChart from "@/components/PriceChart";
import FlightSkeleton from "@/components/FlightSkeleton";

function buildPriceChartData(flights: Flight[]) {
  const map = new Map<number, number>()
  flights.forEach(flight => {
    map.set(flight.price, (map.get(flight.price) ?? 0) + 1)
  })
  return Array.from(map.entries())
    .map(([price, count]) => ({ price, count }))
    .sort((a, b) => a.price - b.price)
}

export default function HomePage() {
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const [filters, setFilters] = useState<Filters>({
    maxPrice: undefined,
    stops: [],
    airlines: []
  });

  const filteredFlights = useMemo(() => applyFilters(allFlights, filters), [allFlights, filters]);
  const priceChartData = useMemo(() => buildPriceChartData(allFlights), [allFlights]);

  const availableAirlines = useMemo(() => {
    const set = new Set<string>();
    allFlights.forEach((flight) => { if (flight.airline) set.add(flight.airline); });
    return Array.from(set).sort();
  }, [allFlights]);

  const resetFilters = () => {
    setFilters({
      maxPrice: undefined,
      stops: [],
      airlines: [],
      sort: undefined
    });
  };

  const hasActiveFilters = useMemo(() => {
    // Check maxPrice
    const hasPrice = filters.maxPrice !== undefined;

    // Check stops (ensuring it's an array first)
    const hasStops = Array.isArray(filters.stops) && filters.stops.length > 0;

    // Check airlines (ensuring it's an array first)
    const hasAirlines = Array.isArray(filters.airlines) && filters.airlines.length > 0;

    return hasPrice || hasStops || hasAirlines;
  }, [filters]);

  async function handleSearch(params: FlightSearchParams) {
    setLoading(true);
    setError(null);
    setFilters((prev) => ({ ...prev, sort: undefined }));

    try {
      const results = await fetchFlights(params);
      setAllFlights(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 text-app-fg transition-colors duration-300">
      <h1 className="text-2xl font-bold">Flight Search</h1>

      <FlightSearchForm onSearch={handleSearch} loading={loading} />

      <FiltersPanel filters={filters} setFilters={setFilters} airlines={availableAirlines} />

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-2">
        {/* Helper for buttons to keep logic clean */}
        {(["line", "bar"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize ${chartType === type
              ? "bg-app-fg text-app-bg border-app-fg"
              : "bg-card-bg text-app-fg border-card-border hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      <PriceChart
        data={priceChartData}
        type={chartType}
        selectedPrice={filters.maxPrice}
        onSelectPrice={(price) =>
          setFilters((prev) => ({
            ...prev,
            maxPrice: prev.maxPrice === price ? undefined : price
          }))
        }
      />

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">
          {filteredFlights.length} {filteredFlights.length === 1 ? 'Result' : 'Results'}
        </h2>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="group flex items-center gap-2 px-3 py-1.5 
               bg-app-fg/5 hover:bg-app-fg/10 
               text-app-fg border border-card-border 
               rounded-full text-xs font-semibold uppercase tracking-tight
               transition-all duration-200 active:scale-95 shadow-sm"
          >
            {/* The icon rotates slightly on hover for a playful touch */}
            <svg
              className="w-3.5 h-3.5 transition-transform group-hover:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => <FlightSkeleton key={i} />)}
        </div>
      ) : (
        <FlightList flights={filteredFlights} />
      )}
    </main>
  );
}