import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface IslandDockData {
  islandId: string;
  label: string;
  value?: string;
  progress?: number;
  progressColor?: string;
  quickActions?: { label: string; onClick?: () => void }[];
}

interface IslandDockContextValue {
  data: IslandDockData | null;
  setData: (data: IslandDockData | null) => void;
}

const IslandDockContext = createContext<IslandDockContextValue>({
  data: null,
  setData: () => {},
});

export function IslandDockProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<IslandDockData | null>(null);
  const setDataStable = useCallback((d: IslandDockData | null) => setData(d), []);
  return (
    <IslandDockContext.Provider value={{ data, setData: setDataStable }}>
      {children}
    </IslandDockContext.Provider>
  );
}

export function useIslandDock() {
  return useContext(IslandDockContext);
}
