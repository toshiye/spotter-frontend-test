'use client'

// TODO: Replace IATA-only input with airport autocomplete
// using Amadeus Airport & City Search API for city-friendly search

import { useState } from "react";
import { FlightSearchParams } from "@/types/flight";

type props = {
    onSearch: (params: FlightSearchParams) => void;
    loading?: boolean;
};

export default function FlightSearchForm({ onSearch, loading = false }: props) {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [adults, setAdults] = useState(1);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!origin || !destination || !departureDate) return;

        if (origin.length !== 3 || destination.length !== 3) return;

        onSearch({
            origin: origin.trim().toUpperCase(),
            destination: destination.trim().toUpperCase(),
            departureDate,
            returnDate: returnDate || undefined,
            adults,
        });
    };
    return (
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-5 bg-white dark:bg-zinc-900 p-4 rounded border border-gray-200 dark:border-zinc-700">
            <input
                type="text"
                placeholder="Origin (IATA: MAD)"
                value={origin}
                maxLength={3}
                onChange={(e) =>
                    setOrigin(e.target.value.replace(/[^a-zA-Z]/g, ""))
                }
                className="border p-2 rounded uppercase text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-zinc-800 dark:border-zinc-600"
            />

            <input
                type="text"
                placeholder="Destination (IATA: BCN)"
                value={destination}
                maxLength={3}
                onChange={(e) =>
                    setDestination(e.target.value.replace(/[^a-zA-Z]/g, ""))
                }
                className="border p-2 rounded uppercase text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-zinc-800 dark:border-zinc-600"
            />

            <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="border p-2 rounded text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-zinc-800 dark:border-zinc-600"
            />

            <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="border p-2 rounded text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-zinc-800 dark:border-zinc-600"
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-black dark:bg-white text-white dark:text-black rounded px-4 py-2 disabled:opacity-50 transition-colors"
            >
                {loading ? "Searching..." : "Search"}
            </button>
        </form>
    );
}