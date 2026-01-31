"use client";
import { useState, useEffect } from "react";

export default function AirportAutocomplete({ 
  label, 
  value, 
  onChange, 
  placeholder 
}: { 
  label: string, value: string, onChange: (val: string) => void, placeholder: string 
}) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [input, setInput] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      const res = await fetch(`/api/airports?keyword=${input}`);
      const data = await res.json();
      setSuggestions(data);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  return (
    <div className="relative w-full">
      <label className="block text-xs font-bold text-app-fg mb-1 opacity-70 uppercase">
        {label}
      </label>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setIsOpen(true);
        }}
        placeholder={placeholder}
        className="w-full border border-card-border p-2 rounded-lg bg-card-bg text-app-fg outline-none focus:ring-2 focus:ring-zinc-400 transition-all"
      />
      
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-card-bg border border-card-border rounded-lg shadow-xl max-h-60 overflow-auto">
          {suggestions.map((loc) => (
            <li
              key={loc.id}
              onClick={() => {
                setInput(loc.iataCode);
                onChange(loc.iataCode);
                setIsOpen(false);
              }}
              className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer border-b border-card-border last:border-0"
            >
              <div className="font-bold">{loc.iataCode} - {loc.name}</div>
              <div className="text-xs opacity-60">{loc.address.cityName}, {loc.address.countryName}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}