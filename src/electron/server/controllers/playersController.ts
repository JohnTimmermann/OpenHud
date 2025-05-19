import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  createPlayer,
  deletePlayer,
  getPlayerBySteamId,
  getPlayers,
  updatePlayer,
} from "../services/index.js";

export const getPlayersController = async (_req: Request, res: Response) => {
  try {
    const allPlayers = await getPlayers();
    res.status(201).json(allPlayers);
  } catch (error) {
    res.status(400).json(`All Players fetch failed: ${error}`);
  }
};

export const createPlayerController = async (req: Request, res: Response) => {
  const playerData = req.body;
  const avatarPath = req.file?.path
    ? `/uploads/player_pictures/${req.file.filename}`
    : ""; // Get the uploaded file path

  const newPlayer: Player = {
    ...playerData,
    _id: uuidv4(),
    avatar: avatarPath,
  };
  try {
    const result = await createPlayer(newPlayer);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json(`Player creation failed: ${error}`);
  }
};

export const deletePlayerController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await deletePlayer(id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json(`Failed to delete player: ${error}`);
  }
};

export const updatePlayerController = async (req: Request, res: Response) => {
  const player: Player = req.body;
  const avatarPath = req.file
    ? `/uploads/player_pictures/${req.file.filename}`
    : player.avatar; // Update avatar if a new file is uploaded

  const updatedPlayer = {
    ...player,
    avatar: avatarPath,
  };

  console.log(updatedPlayer);

  try {
    const result = await updatePlayer(player._id, updatedPlayer);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json(`Failed to update player: ${error}`);
  }
};

export const getPlayerBySteamIdController = async (
  req: Request,
  res: Response,
) => {
  const { steamid } = req.params;

  try {
    const player = await getPlayerBySteamId(steamid);
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json(`Player fetch failed: ${error}`);
  }
};
