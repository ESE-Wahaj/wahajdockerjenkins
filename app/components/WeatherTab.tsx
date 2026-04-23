"use client";

import { useState } from "react";

const mockData: Record<string, { temp: number; condition: string; icon: string; humidity: number; wind: number }> = {
  karachi:    { temp: 34, condition: "Sunny",        icon: "☀️",  humidity: 65, wind: 18 },
  lahore:     { temp: 28, condition: "Partly Cloudy", icon: "⛅", humidity: 55, wind: 12 },
  islamabad:  { temp: 22, condition: "Cloudy",        icon: "☁️",  humidity: 70, wind: 10 },
  london:     { temp: 14, condition: "Rainy",         icon: "🌧️",  humidity: 85, wind: 25 },
  "new york": { temp: 18, condition: "Clear",         icon: "🌤️",  humidity: 50, wind: 15 },
  dubai:      { temp: 40, condition: "Hot & Sunny",   icon: "🌞",  humidity: 40, wind: 20 },
};

export default function WeatherTab() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState<(typeof mockData)[string] | null>(null);
  const [searched, setSearched] = useState("");
  const [notFound, setNotFound] = useState(false);

  function search() {
    const key = city.trim().toLowerCase();
    if (!key) return;
    const data = mockData[key];
    if (data) {
      setResult(data);
      setSearched(city.trim());
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
      setSearched(city.trim());
    }
  }

  return (
    <div className="max-w-sm mx-auto py-8 px-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Weather</h2>
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button
          onClick={search}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500 text-sm capitalize">{searched}</p>
              <p className="text-5xl font-light text-gray-800 mt-1">
                {result.temp}°C
              </p>
            </div>
            <span className="text-6xl">{result.icon}</span>
          </div>
          <p className="text-gray-600 font-medium mb-4">{result.condition}</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>💧 {result.humidity}% humidity</span>
            <span>💨 {result.wind} km/h</span>
          </div>
        </div>
      )}

      {notFound && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">🌍</p>
          <p className="text-sm">
            No data for &quot;{searched}&quot;. Try: Karachi, Lahore, London,
            Dubai...
          </p>
        </div>
      )}

      {!result && !notFound && (
        <p className="text-gray-400 text-sm text-center py-6">
          Search a city to see weather info.
        </p>
      )}
    </div>
  );
}
