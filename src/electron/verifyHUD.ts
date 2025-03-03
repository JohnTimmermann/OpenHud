import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { getHudPath } from "./helpers/pathResolver.js";

export const verifyWebApp = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const hudPath = getHudPath();
  const publicKeyPath = path.join(hudPath, "key");

  // Check if the public key exists
  if (!fs.existsSync(publicKeyPath)) {
    res.status(500).send("Public key not found. Web app is not signed.");
    console.log("No key");
    return; // Return void
  }

  const publicKey = fs.readFileSync(publicKeyPath, "utf8");

  // Get all files to verify (same logic as in script.js)
  const getAllFilesToVerify = (dir: string): string[] => {
    const files: string[] = [];
    const getFiles = (folder: string) => {
      fs.readdirSync(folder).forEach((file) => {
        const filePath = path.join(folder, file);
        if (fs.statSync(filePath).isDirectory()) {
          getFiles(filePath); // Look inside folders
        } else if (filePath.endsWith(".js") || filePath.endsWith(".css")) {
          files.push(filePath); // Add files to verify
        }
      });
    };
    getFiles(dir);
    return files;
  };

  const filesToVerify = getAllFilesToVerify(hudPath);
  filesToVerify.push(path.join(hudPath, "hud.json")); // Add hud.json

  let isValid = true;

  // Verify each file
  filesToVerify.forEach((file) => {
    if (!isValid) return;

    const signedContent = fs.readFileSync(file, "utf8");
    try {
      // Verify the signed content using the public key
      jwt.verify(signedContent, publicKey, { algorithms: ["RS256"] });
    } catch (error) {
      console.error(`Signature verification failed for file: ${file}`);
      console.error(error);
      isValid = false;
    }
  });

  if (!isValid) {
    res.status(403).send("Web app files are tampered!");
    return; // Return void
  }

  next(); // Proceed to serve the web app if verification passes
};
