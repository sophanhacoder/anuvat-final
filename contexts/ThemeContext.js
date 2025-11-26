import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ==================== THEME COLORS ====================
export const THEME_COLORS = {
  dark: {
    background: "#0F172A",
    cardBackground: "#1E293B",
    text: "#F1F5F9",
    textSecondary: "#94A3B8",
    border: "#334155",
    inputBackground: "#334155",
    iconColor: "#F1F5F9",
  },
  light: {
    background: "#F5F7FA",
    cardBackground: "#fff",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    inputBackground: "#F3F4F6",
    iconColor: "#1F2937",
  },
};

// ==================== THEME CONTEXT ====================
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: THEME_COLORS.light,
});

// ==================== THEME PROVIDER ====================
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from storage
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("themePreference");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      }
    } catch (error) {
      console.log("Error loading theme preference:", error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem(
        "themePreference",
        newTheme ? "dark" : "light"
      );
    } catch (error) {
      console.log("Error saving theme preference:", error);
    }
  };

  const theme = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ==================== CUSTOM HOOK ====================
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
