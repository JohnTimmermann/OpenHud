import { BrowserWindow } from "electron";
import { getHudPath, getPreloadPath } from "./helpers/index.js";
import { checkDirectories } from "./helpers/util.js";
import path from "path";

export function createHudWindow() {
  const hudWindow = new BrowserWindow({
    fullscreen: true,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    focusable: true,
    frame: false,
    webPreferences: {
      preload: getPreloadPath(),
      backgroundThrottling: false,
    },
  });

  checkDirectories();
  hudWindow.loadFile(path.join(getHudPath(), "index.html"));
  hudWindow.setIgnoreMouseEvents(true);

  hudWindow.on("show", () => {
    setTimeout(() => {
      hudWindow.focus();
    }, 200);
  });

  return hudWindow;
}
