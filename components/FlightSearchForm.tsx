'use client'

import { useState } from "react";
import { FlightSearchParams } from "@/types/flight";
import AirportAutocomplete from "./AirportAutocomplete";
type Props = {
    onSearch: (params: FlightSearchParams) => void;
    loading?: boolean;
};

export default function FlightSearchForm({ onSearch, loading = false }: Props) {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");

    const dateInputClasses = "w-full border border-card-border p-2 rounded-lg bg-card-bg text-app-fg outline-none focus:ring-2 focus:ring-zinc-400 transition-all dark:color-scheme-dark";

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        
        console.log("Attempting search with:", { origin, destination, departureDate });

        // 1. Basic presence check
        if (!origin || !destination || !departureDate) {
            console.warn("Search blocked: Missing fields");
            return;
        }

        // 2. Clean the strings (remove spaces/lowercase)
        const cleanOrigin = origin.trim().toUpperCase();
        const cleanDest = destination.trim().toUpperCase();

        // 3. Validation check
        if (cleanOrigin.length !== 3 || cleanDest.length !== 3) {
            console.warn("Search blocked: IATA codes must be 3 letters", { cleanOrigin, cleanDest });
            return;
        }

        onSearch({
            origin: cleanOrigin,
            destination: cleanDest,
            departureDate,
            returnDate: returnDate || undefined,
            adults: 1,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-5 bg-card-bg p-6 rounded-xl border border-card-border shadow-lg transition-colors duration-300 items-end"
        >
            {/* 1. Origin Autocomplete */}
            <AirportAutocomplete
                label="From"
                value={origin}
                onChange={setOrigin}
                placeholder="City or Airport"
            />

            {/* 2. Destination Autocomplete */}
            <AirportAutocomplete
                label="To"
                value={destination}
                onChange={setDestination}
                placeholder="Where to?"
            />

            {/* 3. Departure Date */}
            <div className="flex flex-col">
                <label className="text-xs font-bold text-app-fg mb-1 opacity-70 uppercase">Departure</label>
                <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className={dateInputClasses}
                />
            </div>

            {/* 4. Return Date */}
            <div className="flex flex-col">
                <label className="text-xs font-bold text-app-fg mb-1 opacity-70 uppercase">Return</label>
                <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className={dateInputClasses}
                />
            </div>

            {/* 5. Search Button */}
            <button
                type="submit"
                disabled={loading}
                className="bg-app-fg text-app-bg rounded-lg h-[42px] px-4 py-2 font-bold disabled:opacity-50 hover:opacity-90 transition-all active:scale-95 shadow-md"
            >
                {loading ? "Searching..." : "Search Flights"}
            </button>
        </form>
    );
}