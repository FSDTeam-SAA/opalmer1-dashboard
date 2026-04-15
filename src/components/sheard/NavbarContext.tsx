"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface NavbarContextType {
  title: string;
  setTitle: (title: string) => void;
}

const NavbarContext = createContext<NavbarContextType>({
  title: "Main Dashboard",
  setTitle: () => {},
});

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitleState] = useState("Main Dashboard");
  const setTitle = useCallback((t: string) => setTitleState(t), []);

  return (
    <NavbarContext.Provider value={{ title, setTitle }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarTitle() {
  return useContext(NavbarContext);
}
