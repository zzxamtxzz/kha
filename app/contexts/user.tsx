"use client";
import User from "@/models/user";
import { ReactNode, createContext, useContext } from "react";
import { SheetProvider } from "./sheet";
import { PopupProvider } from "./dialog";
import { SheetProvider2 } from "./sheet2";
import { ThemeProvider } from "./theme";
import { Toaster } from "@/components/ui/toaster";

const HasUserContext = createContext<{
  user: User;
}>({ user: {} as unknown as User });

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
        <SheetProvider2>
          <PopupProvider>
            <SheetProvider>{children}</SheetProvider>
          </PopupProvider>
          <Toaster />
        </SheetProvider2>
      </ThemeProvider>
    </HasUserContext.Provider>
  );
}
