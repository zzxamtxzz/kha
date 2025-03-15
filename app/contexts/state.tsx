"use client";
// StateContext.js
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

const StateContext = createContext<{
  state: "list" | "card";
  setState: Dispatch<SetStateAction<"list" | "card">>;
}>({ state: "list", setState: () => {} });

export const useViewMode = () => useContext(StateContext);

export const StateProvider = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const key = `${title}state`;
  const [state, setState] = useState<"list" | "card">(
    (localStorage.getItem(key) || "list") as "list" | "card"
  );

  // Update localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem(key, state);
  }, [state]);

  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};
