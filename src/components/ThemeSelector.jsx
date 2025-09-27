import React, { useState } from "react";
import { Palette, Eye, ChevronDown, Cloud } from "lucide-react";

const ThemeSelector = ({
  theme,
  setTheme,
  themes,
  viewMode,
  setViewMode,
  viewModes,
  onWeatherClick,
}) => {
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  const colorPalette = [
    { name: "Dark", colors: ["#1a1a1a", "#2d2d2d", "#404040"], key: "dark" },
    { name: "Ocean", colors: ["#0f172a", "#1e3a8a", "#3b82f6"], key: "ocean" },
    {
      name: "Sunset",
      colors: ["#7c2d12", "#ea580c", "#f97316"],
      key: "sunset",
    },
    {
      name: "Forest",
      colors: ["#14532d", "#16a34a", "#22c55e"],
      key: "forest",
    },
    {
      name: "Purple",
      colors: ["#581c87", "#7c3aed", "#a855f7"],
      key: "purple",
    },
    { name: "Pink", colors: ["#831843", "#be185d", "#ec4899"], key: "pink" },
    { name: "Cyan", colors: ["#164e63", "#0891b2", "#06b6d4"], key: "cyan" },
    { name: "Amber", colors: ["#92400e", "#d97706", "#f59e0b"], key: "amber" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      {/* Color Palette Selector */}
      <div className="relative">
        <button
          onClick={() => setShowThemeDropdown(!showThemeDropdown)}
          className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors text-xs sm:text-sm w-full sm:w-auto"
        >
          <Palette size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Colors</span>
          <span className="xs:hidden">Theme</span>
          <ChevronDown size={12} className="sm:w-3.5 sm:h-3.5" />
        </button>

        {showThemeDropdown && (
          <div className="absolute top-full left-0 mt-2 bg-dark-800 border border-white/20 rounded-xl shadow-2xl z-20 p-4 sm:p-6 w-80 sm:min-w-96 sm:max-w-md">
            <div className="text-white text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-center">
              Choose Theme Colors
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {colorPalette.map((palette) => (
                <button
                  key={palette.key}
                  onClick={() => {
                    setTheme(palette.key);
                    setShowThemeDropdown(false);
                  }}
                  className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    theme === palette.key
                      ? "border-white/60 bg-white/15 shadow-lg"
                      : "border-white/25 hover:border-white/40 hover:bg-white/5"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="flex gap-1 sm:gap-2">
                      {palette.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {palette.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View Mode Selector */}
      <div className="relative">
        <button
          onClick={() => setShowViewDropdown(!showViewDropdown)}
          className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors text-xs sm:text-sm w-full sm:w-auto"
        >
          <Eye size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">{viewModes[viewMode]}</span>
          <span className="xs:hidden">View</span>
          <ChevronDown size={12} className="sm:w-3.5 sm:h-3.5" />
        </button>

        {showViewDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-dark-800 border border-white/20 rounded-lg shadow-xl z-20 w-full sm:min-w-48">
            {Object.entries(viewModes).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setViewMode(key);
                  setShowViewDropdown(false);
                }}
                className={`w-full p-2 sm:p-3 text-left hover:bg-white/10 transition-colors text-xs sm:text-sm text-white first:rounded-t-lg last:rounded-b-lg ${
                  viewMode === key ? "bg-primary-500/20" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Weather Button */}
      <button
        onClick={onWeatherClick}
        className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors text-xs sm:text-sm w-full sm:w-auto"
      >
        <Cloud size={14} className="sm:w-4 sm:h-4" />
        <span>Weather</span>
      </button>
    </div>
  );
};

export default ThemeSelector;
