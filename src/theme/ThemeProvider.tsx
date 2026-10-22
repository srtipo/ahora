import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { dark, light, type Palette } from "./colors";

type ThemeContextValue = {
  palette: Palette;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const palette = isDark ? dark : light;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(palette.bg).catch(() => {});
  }, [palette.bg]);

  const value = useMemo(() => ({ palette, isDark }), [palette, isDark]);

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
