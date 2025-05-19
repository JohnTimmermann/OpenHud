import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  getPlayerPicturesPath,
  getTeamLogosPath,
} from "../../helpers/pathResolver.js";

// Player avatar storage
export const playerPictureStorage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, getPlayerPicturesPath());
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, JPG and WEBP are allowed.",
        ),
      );
    }
  },
});

// Team logo storage
export const teamLogoStorage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, getTeamLogosPath());
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, JPG and WEBP are allowed.",
        ),
      );
    }
  },
});
