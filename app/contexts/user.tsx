"use client";
import User from "@/models/user";
import { ReactNode, createContext, useContext } from "react";
import { SheetProvider } from "./sheet";
import { PopupProvider } from "./dialog";
import { SheetProvider2 } from "./sheet2";
import { ThemeProvider } from "./theme";

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
      <ThemeProvider>
        <PopupProvider>
          <SheetProvider2>
            <SheetProvider>{children}</SheetProvider>
          </SheetProvider2>
        </PopupProvider>
      </ThemeProvider>
    </HasUserContext.Provider>
  );
}
