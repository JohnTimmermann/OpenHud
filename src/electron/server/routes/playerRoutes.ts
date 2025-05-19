import { Router } from "express";
import {
  getPlayersController,
  createPlayerController,
  deletePlayerController,
  getPlayerBySteamIdController,
  updatePlayerController,
} from "../controllers/index.js";
import { playerPictureStorage } from "../configs/multer.js";

export const playerRoutes = Router();

/* Players */
playerRoutes.get("/players", getPlayersController);
playerRoutes.get("/players/:steamid", getPlayerBySteamIdController);
playerRoutes.post(
  "/players",
  playerPictureStorage.single("avatar"),
  createPlayerController,
);
playerRoutes.delete("/players/:id", deletePlayerController);
playerRoutes.put(
  "/players/:id",
  playerPictureStorage.single("avatar"),
  updatePlayerController,
);
