import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { CSGO, GSISocket, CSGORaw } from "csgogsi-socket";
import { AdminPanel } from "./pages/AdminPanel";
import { Dashboard } from "./pages/Dashboard";
import { MatchesPage } from "./pages/Matches/MatchPage";
import { PlayersPage } from "./pages/Players/PlayersPage";
import { TeamsPage } from "./pages/Teams";
import { Hud } from "./pages/HUD/Hud";

export const PORT = 1349;
export const HOST = `http://localhost`;
export const { GSI, socket } = GSISocket(`${HOST}:${PORT}`, "update");

/*
  TODO:
  - Add a new route for the HUD component. Look into React Portals, Server-Side File Uploads, and iFrames (need a way to use tailwindcss for only the admin panel and scss for the hud).
  - useMem and useContext hooks for cacheing so we don't have to make an api call every action.
  - Work on an Electron App.
  - Work on a temp HUD overlay while the Electron app is being developed.
  - Update ports so they are not using a common port, and also not hardcoded in.
  - Local file uploads for players pictures and teams logo.
  - Better way of handling Reversing Teams.
  - Add a way to set winners for matches (in the actual vetos).
  - Avatars (players without pictures) not swapping when teams switch sides
  - Player stats to players in team boxes
*/

export const App = () => {
  const [gameData, setGameData] = useState<CSGO | null>(null);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<AdminPanel />}>
        <Route index element={<MatchesPage />} />
        <Route path="matches" element={<Navigate to="/" />} />
        <Route path="players" element={<PlayersPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="dashboard" element={<Dashboard gameData={gameData} />} />
        <Route path="hud" element={<Hud />} />
      </Route>,
    ),
  );

  useEffect(() => {
    socket.on("update", (data: CSGORaw) => {
      const digestData = GSI.digest(data);
      setGameData(digestData);
    });

    return () => {
      socket.off("update");
    };
  }, []);

  return (
    <div className={`App size-full`}>
      <RouterProvider router={router} />
    </div>
  );
};
