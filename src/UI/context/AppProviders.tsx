import React from "react";
import { PlayersProvider } from "./PlayersContext";
import { TeamsProvider } from "./TeamsContext";
import { MatchesProvider } from "./MatchesContext";
import { ThemesProvider } from "./ThemesContext";
import { DrawerProvider } from "./DrawerContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemesProvider>
      <MatchesProvider>
        <PlayersProvider>
          <DrawerProvider>
            <TeamsProvider>{children}</TeamsProvider>
          </DrawerProvider>
        </PlayersProvider>
      </MatchesProvider>
    </ThemesProvider>
  );
};
