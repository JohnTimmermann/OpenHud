import { createRoot } from "react-dom/client";
import "./global.css";
import { Routes, Route, Navigate, MemoryRouter } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { MatchesPage } from "./pages/Matches/MatchPage";
import { PlayersPage } from "./pages/Players/PlayersPage";
import { TeamsPage } from "./pages/Teams/TeamsPage";
import { AdminPanel } from "./pages/AdminPanel";
import { AppProviders } from "./context/AppProviders";

createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<AdminPanel />}>
          <Route index element={<MatchesPage />} />
          <Route path="matches" element={<Navigate to="/" />} />
          <Route path="players" element={<PlayersPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </MemoryRouter>
  </AppProviders>,
);
