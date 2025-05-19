import { BrowserWindow, shell } from "electron";
import {
  ipcMainHandle,
  ipcMainOn,
  openHudsDirectory,
} from "../helpers/index.js";
import { createHudWindow } from "../hudWindow.js";
import { getPlayers } from "../server/services/index.js";
// Handle expects a response
export function ipcMainEvents(mainWindow: BrowserWindow) {
  ipcMainHandle("getPlayers", async () => {
    const players = await getPlayers();
    return players;
  });

  ipcMainOn("sendFrameAction", (payload) => {
    switch (payload) {
      case "CLOSE":
        mainWindow.close();
        break;
      case "MINIMIZE":
        mainWindow.minimize();
        break;
      case "MAXIMIZE":
        mainWindow.maximize();
        break;
      case "CONSOLE":
        mainWindow.webContents.toggleDevTools();
        break;
      case "RESET":
        mainWindow.unmaximize();
        break;
    }
  });

  ipcMainOn("startOverlay", () => {
    const hudWindow = createHudWindow();
    hudWindow.show();
  });

  ipcMainOn("openExternalLink", (url) => {
    shell.openExternal(url);
  });

  ipcMainOn("openHudsDirectory", () => {
    openHudsDirectory();
  });
}
