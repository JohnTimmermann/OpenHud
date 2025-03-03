// src/middlewares/decodeFiles.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { getHudPath } from "./helpers/pathResolver.js";

export const decodeFiles = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const hudPath = getHudPath();
  const publicKeyPath = path.join(hudPath, "key");

  // Check if the public key exists
  if (!fs.existsSync(publicKeyPath)) {
    res.status(500).send("Public key not found. Web app is not signed.");
    return;
  }

  const publicKey = fs.readFileSync(publicKeyPath, "utf8");

  // Get the requested file path
  const requestedFilePath = path.join(hudPath, req.path);

  // Check if the file exists
  if (!fs.existsSync(requestedFilePath)) {
    res.status(404).send("File not found.");
    return;
  }

  // Read the JWT-encoded file content
  const jwtContent = fs.readFileSync(requestedFilePath, "utf8");

  try {
    // Decode the JWT to get the original file content
    const decodedContent = jwt.verify(jwtContent, publicKey, {
      algorithms: ["RS256"],
    });

    // Serve the decoded content
    res.type(path.extname(requestedFilePath)); // Set the correct content type (e.g., text/javascript, text/css)
    res.send(decodedContent);
  } catch (error) {
    console.error(`Failed to decode file: ${requestedFilePath}`);
    console.error(error);
    res.status(403).send("File is tampered or invalid.");
  }
};
