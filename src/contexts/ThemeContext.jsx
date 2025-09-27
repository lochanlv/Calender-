import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("calendar-theme");
    return savedTheme || "dark";
  });

  const [viewMode, setViewMode] = useState(() => {
    const savedView = localStorage.getItem("calendar-view");
    return savedView || "month";
  });

  const themes = {
    dark: {
      name: "Dark",
      primary: "from-dark-900 via-primary-900 to-secondary-900",
      card: "bg-white/10",
      text: "text-white",
      accent: "text-accent-400",
    },
    ocean: {
      name: "Ocean",
      primary: "from-blue-900 via-cyan-900 to-teal-900",
      card: "bg-cyan-500/10",
      text: "text-cyan-100",
      accent: "text-cyan-400",
    },
    sunset: {
      name: "Sunset",
      primary: "from-orange-900 via-red-900 to-pink-900",
      card: "bg-orange-500/10",
      text: "text-orange-100",
      accent: "text-orange-400",
    },
    forest: {
      name: "Forest",
      primary: "from-green-900 via-emerald-900 to-teal-900",
      card: "bg-green-500/10",
      text: "text-green-100",
      accent: "text-green-400",
    },
    purple: {
      name: "Purple",
      primary: "from-purple-900 via-violet-900 to-fuchsia-900",
      card: "bg-purple-500/10",
      text: "text-purple-100",
      accent: "text-purple-400",
    },
    pink: {
      name: "Pink",
      primary: "from-pink-900 via-rose-900 to-red-900",
      card: "bg-pink-500/10",
      text: "text-pink-100",
      accent: "text-pink-400",
    },
    cyan: {
      name: "Cyan",
      primary: "from-cyan-900 via-sky-900 to-blue-900",
      card: "bg-cyan-500/10",
      text: "text-cyan-100",
      accent: "text-cyan-400",
    },
    amber: {
      name: "Amber",
      primary: "from-amber-900 via-yellow-900 to-orange-900",
      card: "bg-amber-500/10",
      text: "text-amber-100",
      accent: "text-amber-400",
    },
  };

  const viewModes = {
    month: "Month View",
    agenda: "Agenda View",
    timeline: "Timeline View",
    kanban: "Kanban Board",
  };

  useEffect(() => {
    localStorage.setItem("calendar-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("calendar-view", viewMode);
  }, [viewMode]);

  const value = {
    theme,
    setTheme,
    themes,
    viewMode,
    setViewMode,
    viewModes,
    currentTheme: themes[theme],
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
