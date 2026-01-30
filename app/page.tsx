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

function buildPriceChartData(flights: Flight[]) {
  const map = new Map<number, number>()

  flights.forEach(flight => {
    map.set(
      flight.price,
      (map.get(flight.price) ?? 0) + 1
    )
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

  const filteredFlights = useMemo(() => {
    return applyFilters(allFlights, filters);
  }, [allFlights, filters]);

  const priceChartData = useMemo(() => {
    const data = buildPriceChartData(filteredFlights)
    console.log("Price chart data:", data)
    return data
  }, [filteredFlights])

  const availableAirlines = useMemo(() => {
    const set = new Set<string>();
    allFlights.forEach((flight) => {
      if (flight.airline) {
        set.add(flight.airline);
      }
    });
    return Array.from(set);
  }, [allFlights]);

  async function handleSearch(params: FlightSearchParams) {
    setLoading(true);
    setError(null);

    setFilters((prev) => ({
      ...prev,
      sort: undefined,
    }));

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
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Flight Search</h1>

      <FlightSearchForm
        onSearch={handleSearch}
        loading={loading}
      />

      <FiltersPanel filters={filters} setFilters={setFilters} airlines={availableAirlines} />

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={() => setChartType("line")}
          className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
              chartType === "line"
              ? "bg-black dark:bg-white text-white dark:text-black"
              : "bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-600"
            }`}
        >
          Line
        </button>

        <button
          onClick={() => setChartType("bar")}
          className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
              chartType === "bar"
              ? "bg-black dark:bg-white text-white dark:text-black"
              : "bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-600"
            }`}
        >
          Bar
        </button>
      </div>

      <PriceChart
        data={priceChartData}
        type={chartType}
        selectedPrice={filters.maxPrice}
        onSelectPrice={(price) =>
          setFilters((prev) => ({
            ...prev,
            maxPrice: price,
          }))
        }
      />
      <FlightList flights={filteredFlights} />
    </main>
  );
}
