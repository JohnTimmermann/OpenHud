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
import { getHudPath, getUploadsPath } from "../helpers/index.js";
import path from "path";
import { verifyWebApp } from "../verifyHUD.js";

const port = process.env.PORT || "1349";

export const startServer = (mainWindow: BrowserWindow) => {
  const expressApp: Express = express();
  const server = http.createServer(expressApp);
  initializeSocket(server);
  expressApp.use(cors());
  expressApp.use(express.json());
  expressApp.use(express.static(getHudPath()));

  /* Serve static files from the uploads directory */
  expressApp.use("/uploads", express.static(getUploadsPath()));

  /* Game Data */
  expressApp.post("/gsi", readGameData);

  /* Hud */
  // Apply verifyWebApp middleware to the /hud route
  // app.use("/hud", verifyWebApp, express.static(getHudPath())); // Serve static files after verification

  expressApp.get("/hud", (_req, res) => {
    res.sendFile(path.join(getHudPath(), "index.html"));
  });

  /* Routes */
  expressApp.use(playerRoutes);
  expressApp.use(teamRoutes);
  expressApp.use(matchRoutes);
  expressApp.use(coachRoutes);
  expressApp.use(settingsRoutes);

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
