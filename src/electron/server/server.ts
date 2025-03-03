import express, { Express } from "express";
import cors from "cors";
import http from "http";
import { initializeSocket } from "./sockets/socket.js";
import { readGameData } from "./sockets/GSI.js";
import {
  playerRoutes,
  teamRoutes,
  matchRoutes,
  coachRoutes,
  settingsRoutes,
} from "./routes/index.js";
import { BrowserWindow } from "electron";
import { ipcWebContentsSend } from "../helpers/util.js";
import { getHudPath } from "../helpers/index.js";
import path from "path";
import { verifyWebApp } from "../verifyHUD.js";

const port = process.env.PORT || "1349";

export const startServer = (mainWindow: BrowserWindow) => {
  const app: Express = express();
  const server = http.createServer(app);
  initializeSocket(server);

  app.use(cors());
  app.use(express.json());
  app.use(express.static(getHudPath()));

  /* Game Data */
  app.post("/gsi", readGameData);

  /* Hud */
  // Apply verifyWebApp middleware to the /hud route
  app.use("/hud", verifyWebApp, express.static(getHudPath())); // Serve static files after verification

  /* Routes */
  app.use(playerRoutes);
  app.use(teamRoutes);
  app.use(matchRoutes);
  app.use(coachRoutes);
  app.use(settingsRoutes);

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  ipcWebContentsSend(
    "startServer",
    mainWindow.webContents,
    "Server started on port",
  );

  return server;
};

export function shutDown(server: http.Server) {
  console.log("Received kill server signal, shutting down gracefully");
  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });
}
