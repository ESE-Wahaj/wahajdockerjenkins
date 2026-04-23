"use client";

import { useState } from "react";
import PortfolioTab from "./components/PortfolioTab";
import TodoTab from "./components/TodoTab";
import WeatherTab from "./components/WeatherTab";

const TABS = [
  { id: "portfolio", label: "Portfolio" },
  { id: "todos", label: "Todos" },
  { id: "weather", label: "Weather" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Home() {
  const [active, setActive] = useState<TabId>("portfolio");

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Wahaj
        </h1>
      </header>

      <nav className="border-b border-gray-200 px-6">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                active === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main>
        {active === "portfolio" && <PortfolioTab />}
        {active === "todos" && <TodoTab />}
        {active === "weather" && <WeatherTab />}
      </main>
    </div>
  );
}
