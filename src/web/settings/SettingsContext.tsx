import { createContext, RenderableProps } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";

interface SettingsContext {
  accessibleFont: boolean;
  excludeAccessories: boolean;
  pageSize: number;
  toggleAccessibleFont: () => void;
  toggleExcludeAccessories: () => void;
  togglePageSize: (newValue: number) => void;
}

export const SettingsContext = createContext<SettingsContext>({
  accessibleFont: false,
  excludeAccessories: false,
  pageSize: 20,
  toggleAccessibleFont: () => undefined,
  toggleExcludeAccessories: () => undefined,
  togglePageSize: () => undefined,
});

export function SettingsProvider({ children }: RenderableProps<unknown>) {
  const [accessibleFont, setAccessibleFont] = useState(
    () => localStorage.getItem("accessibleFont") === "true"
  );

  const [excludeAccessories, setExcludeAccessories] = useState(
    () => localStorage.getItem("excludeAccessories") === "true"
  );

  const [pageSize, setPageSize] = useState(
    () => parseInt(localStorage.getItem("pageSize")!) || 20
  );

  const toggleAccessibleFont = useCallback(() => {
    setAccessibleFont((previous) => {
      localStorage.setItem("accessibleFont", `${!previous}`);
      return !previous;
    });
  }, []);

  const toggleExcludeAccessories = useCallback(() => {
    setExcludeAccessories((previous) => {
      localStorage.setItem("excludeAccessories", `${!previous}`);
      return !previous;
    });
  }, []);

  const togglePageSize = useCallback((newValue: number) => {
    setPageSize(newValue);
    localStorage.setItem("pageSize", newValue.toString());
  }, []);

  const value = useMemo(
    () => ({
      accessibleFont,
      excludeAccessories,
      pageSize,
      toggleAccessibleFont,
      toggleExcludeAccessories,
      togglePageSize,
    }),
    [
      accessibleFont,
      excludeAccessories,
      pageSize,
      toggleAccessibleFont,
      toggleExcludeAccessories,
      togglePageSize,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
