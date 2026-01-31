'use client';

import { Filters } from "@/types/filters";

type Props = {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    airlines?: string[];
};

export default function FiltersPanel({ filters, setFilters, airlines }: Props) {
    const inputClasses = "w-full border border-card-border rounded-md p-2 mt-1 bg-card-bg text-app-fg focus:ring-2 focus:ring-zinc-400 outline-none transition-all";

    return (
        <div className="bg-card-bg border border-card-border rounded-lg p-4 space-y-6 transition-colors duration-300">
            <h2 className="font-bold text-app-fg text-lg">Filters</h2>

            {/* Sort by */}
            <div>
                <label className="text-sm font-semibold text-app-fg">Sort by</label>
                <select
                    value={filters.sort ?? ""}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            sort: (e.target.value as Filters['sort']) || undefined,
                        }))
                    }
                    className={inputClasses}
                >
                    <option value="" className="bg-card-bg">Recommended (Cheapest)</option>
                    <option value="value" className="bg-card-bg">Best Value (Price vs. Time)</option>
                    <option value="price" className="bg-card-bg">Cheapest Only</option>
                    <option value="duration" className="bg-card-bg">Fastest Only</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold text-app-fg mb-1">Max price (€)</label>
                <input
                    type="number"
                    min={0}
                    placeholder="e.g. 500"
                    value={filters.maxPrice ?? ""}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            maxPrice: e.target.value ? Number(e.target.value) : undefined,
                        }))
                    }
                    className={inputClasses}
                />
            </div>

            {/* Stops */}
            <div>
                <p className="text-sm font-semibold text-app-fg mb-2">Stops</p>
                <div className="space-y-2">
                    {[0, 1, 2].map((stop) => (
                        <label key={stop} className="flex items-center gap-3 text-app-fg cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.stops?.includes(stop)}
                                onChange={(e) => setFilters((prev) => ({
                                    ...prev,
                                    stops: e.target.checked
                                        ? [...(prev.stops ?? []), stop]
                                        : prev.stops?.filter((s) => s !== stop)
                                }))}
                                className="w-4 h-4 rounded border-card-border accent-zinc-800 dark:accent-zinc-200"
                            />
                            <span className="text-sm group-hover:opacity-80">
                                {stop === 2 ? '2+ stops' : `${stop} stop${stop !== 1 ? 's' : ''}`}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Airlines */}
            {airlines && airlines.length > 0 && (
                <div>
                    <p className="text-sm font-semibold text-app-fg mb-2">Airlines</p>
                    <div className="max-h-40 overflow-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-card-border">
                        {airlines.map((airline) => (
                            <label key={airline} className="flex items-center gap-3 text-app-fg cursor-pointer group">
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
                                    className="w-4 h-4 rounded border-card-border accent-zinc-800 dark:accent-zinc-200"
                                />
                                <span className="text-sm group-hover:opacity-80">{airline}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}