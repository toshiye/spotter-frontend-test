'use client';

import { Filters } from "@/types/filters";

type Props = {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    airlines?: string[];
};

export default function FiltersPanel({ filters, setFilters, airlines }: Props) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded p-4 space-y-4">
            <h2 className="font-semibold text-black dark:text-white text-lg">Filters</h2>

            <div>
                <label className="text-sm font-medium text-black dark:text-white">Sort by</label>
                <select
                    value={filters.sort ?? ""}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            sort: e.target.value as any || undefined,
                        }))
                    }
                    className="w-full border rounded p-2 mt-1 text-black dark:text-white dark:bg-zinc-800 dark:border-zinc-600"
                >
                    <option value="">Recommended</option>
                    <option value="price">Cheapest</option>
                    <option value="duration">Fastest</option>
                    <option value="value">Best value</option>
                </select>
            </div>

            {/* Max price */}
            <div>
                <label className="block text-sm text-black dark:text-white font-medium mb-1">Max price (€)</label>
                <input
                    type="number"
                    min={0}
                    value={filters.maxPrice ?? ""}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            maxPrice: e.target.value ? Number(e.target.value) : undefined,
                        }))
                    }
                    className="border p-2 rounded w-full text-black dark:text-white dark:bg-zinc-800 dark:border-zinc-600"
                />
            </div>

            {/* Stops */}
            <div>
                <p className="text-sm text-black dark:text-white font-medium mb-1">Stops</p>
                {
                    [0, 1, 2].map((stop) => (
                        <label key={stop} className="flex items-center gap-2 text-black dark:text-white">
                            <input
                                type="checkbox"
                                checked={filters.stops?.includes(stop)}
                                onChange={
                                    (e) => setFilters((prev) => ({
                                        ...prev,
                                        stops: e.target.checked ? [...(prev.stops ?? []), stop] : prev.stops?.filter((s) => s !== stop)
                                    }))
                                }
                                className="text-black dark:text-white"
                            />
                            {stop === 2 ? '2+ stops' : `${stop} stop${stop !== 1 ? 's' : ''}`}
                        </label>
                    ))
                }
            </div>

            {/* Airlines */}
            {airlines && airlines.length > 0 && (
                <div>
                    <p className="text-sm font-medium mb-1 text-black dark:text-white">Airlines</p>

                    <div className="max-h-40 overflow-auto space-y-1">
                        {airlines.map((airline) => (
                            <label key={airline} className="flex items-center gap-2 text-black dark:text-white">
                                <input
                                    type="checkbox"
                                    checked={filters.airlines?.includes(airline)}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            airlines: e.target.checked
                                                ? [...(prev.airlines ?? []), airline]
                                                : prev.airlines?.filter((a) => a !== airline),
                                        }))
                                    }
                                />
                                {airline}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}