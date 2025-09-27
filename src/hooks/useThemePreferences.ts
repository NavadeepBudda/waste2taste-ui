import { useCallback, useEffect, useMemo, useState } from "react";

const MODE_STORAGE_KEY = "waste2taste:theme-mode";
const ACCENT_STORAGE_KEY = "waste2taste:theme-accent";

const ACCENT_OPTIONS = ["base", "ocean", "sunset", "sprout"] as const;

type ThemeMode = "light" | "dark";
export type AccentOption = (typeof ACCENT_OPTIONS)[number];

const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

const applyPreferences = (mode: ThemeMode, accent: AccentOption) => {
  if (!isBrowser()) {
    return;
  }

  const root = document.documentElement;

  root.classList.toggle("dark", mode === "dark");

  if (accent === "base") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", accent);
  }
};

export function useThemePreferences() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (!isBrowser()) {
      return "light";
    }

    const stored = window.localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [accent, setAccent] = useState<AccentOption>(() => {
    if (!isBrowser()) {
      return "base";
    }

    const stored = window.localStorage.getItem(ACCENT_STORAGE_KEY) as AccentOption | null;
    return stored && ACCENT_OPTIONS.includes(stored) ? stored : "base";
  });

  useEffect(() => {
    applyPreferences(mode, accent);

    if (isBrowser()) {
      window.localStorage.setItem(MODE_STORAGE_KEY, mode);
      window.localStorage.setItem(ACCENT_STORAGE_KEY, accent);
    }
  }, [mode, accent]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setAccentOption = useCallback((option: AccentOption) => {
    setAccent(option);
  }, []);

  const options = useMemo(
    () => ACCENT_OPTIONS,
    []
  );

  return {
    mode,
    accent,
    accentOptions: options,
    setMode,
    toggleMode,
    setAccent: setAccentOption,
  } as const;
}

