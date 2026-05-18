import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface ReducedMotionContextValue {
  prefersReducedMotion: boolean;
  disableAnimations: boolean;
  toggleAnimations: () => void;
}

const ReducedMotionContext = createContext<ReducedMotionContextValue>({
  prefersReducedMotion: false,
  disableAnimations: false,
  toggleAnimations: () => {},
});

export function useReducedMotion() {
  return useContext(ReducedMotionContext);
}

function getSystemPreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface ReducedMotionProviderProps {
  children: ReactNode;
}

export function ReducedMotionProvider({ children }: ReducedMotionProviderProps) {
  const [systemPrefers, setSystemPrefers] = useState(getSystemPreference);
  const [manualToggle, setManualToggle] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    function handleChange(e: MediaQueryListEvent) {
      setSystemPrefers(e.matches);
    }

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const prefersReducedMotion = systemPrefers;
  const disableAnimations = prefersReducedMotion || manualToggle;

  const toggleAnimations = useCallback(() => {
    setManualToggle((prev) => !prev);
  }, []);

  return (
    <ReducedMotionContext.Provider
      value={{ prefersReducedMotion, disableAnimations, toggleAnimations }}
    >
      {children}
    </ReducedMotionContext.Provider>
  );
}
