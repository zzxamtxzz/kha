"use client";
import User from "@/models/user";
import { ReactNode, createContext, useContext } from "react";
import { SheetProvider } from "./sheet";
import { PopupProvider } from "./dialog";

const HasUserContext = createContext<{
  user: User;
  //@ts-ignore
}>({ user: {} });

export function useHasUser() {
  return useContext(HasUserContext);
}

export function HasUserProvider({
  children,
  user: u,
}: {
  children: ReactNode;
  user: string;
}) {
  const user = JSON.parse(u) as User;

  return (
    <HasUserContext.Provider value={{ user }}>
      <PopupProvider>
        <SheetProvider>{children}</SheetProvider>
      </PopupProvider>
    </HasUserContext.Provider>
  );
}
