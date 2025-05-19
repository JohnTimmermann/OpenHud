import path from "path";
import { app } from "electron";
import { isDev, userHasCustomHud } from "./util.js";

/* Determine preload path based on if we are in dev */
export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "/dist-electron/preload.cjs",
  );
}

// Path to our database file (stored in appdata for openhud)
export function getDatabasePath() {
  return path.join(app.getPath("userData"), "database.db");
}

// Needed for verifying URL
export function getUIPath() {
  return path.join(app.getAppPath() + "/dist-react/index.html");
}

// Path for Assets (images, icons, ect)
export function getAssetPath() {
  return path.join(app.getAppPath(), isDev() ? "." : "..", "/src/assets");
}

export function getCustomHudPath() {
  return path.join(app.getPath("home"), "OpenHud-Huds/build");
}

// Default HUD path
export function getDefaultHUDPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "/src/assets/defaultHud",
  );
}

/* If a user has a custom HUD, use that path, otherwise use the default path */
export function getHudPath() {
  return userHasCustomHud ? getCustomHudPath() : getDefaultHUDPath();
}

// Path for uploads folder
export function getUploadsPath() {
  return path.join(app.getPath("userData"), "uploads");
}

// Path for player pictures (in uploads folder)
export function getPlayerPicturesPath() {
  return path.join(getUploadsPath(), "player_pictures");
}

// Path for team logos (in uploads folder)
export function getTeamLogosPath() {
  return path.join(getUploadsPath(), "team_logos");
}
