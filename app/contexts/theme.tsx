"use client";
import Cookies from "js-cookie";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextType {
  theme: string;
  toggleTheme: (theme: "dark" | "light") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

if (process.env.NEXT_PUBLIC_NODE_ENV !== "development") {
  console.log = function () {}; // Disable console.log in production
  console.debug = function () {}; // Disable console.debug in production
  console.info = function () {}; // Disable console.info in production
  console.warn = function () {}; // Disable console.warn in production
  console.error = function () {}; // Disable console.error in production
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>(
    () => Cookies.get("theme") || "light"
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    Cookies.set("theme", theme, { expires: 365 });
  }, [theme]);

  const toggleTheme = (theme: "light" | "dark") => {
    setTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
