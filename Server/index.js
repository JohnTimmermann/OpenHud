import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import multer from "multer";
import path from "path";
// import * as API from "./database/crud.js";
import * as teams from "./database/teams/teams.js";
import * as players from "./database/players/players.js";
import * as matches from "./database/matches/matches.js";

const app = express();
const server = http.createServer(app);
const HOST = "localhost";
const PORT = 4000;

// Create a new instance of the socket.io server to send real time updates to the client
const io = new Server(server, {
  cors: {
    origin: "*",
    // methods: ['GET', 'POST'],
  },
});

// Use the middleware to enable CORS (Cross-Origin Resource Sharing)
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// As of 10/07/2024, the GSI data has a bug where the observer_slots are off by 1, so we need to fix it before sending it to the client
const fixGSIData = (data) => {
  if (data.player) {
    data.player.observer_slot =
      data.player.observer_slot === 9 ? 0 : data.player.observer_slot + 1;
  }

  if (data.allplayers) {
    for (const playerId in data.allplayers) {
      if (data.allplayers.hasOwnProperty(playerId)) {
        data.allplayers[playerId].observer_slot =
          data.allplayers[playerId].observer_slot === 9
            ? 0
            : data.allplayers[playerId].observer_slot + 1;
      }
    }
  }
};

// Listen for the client connection and disconnection events
// Emit the 'update' event to send the game data to the client when the client connects
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.emit("update", { data: "Initial data from server" });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("swap-teams", (swapTeams) => {
    io.emit("swap-teams", swapTeams);
    console.log("Teams swapped", swapTeams);
  });
});

// Listen for the game data POST requests to /gsi
app.post("/gsi", express.json(), (req, res) => {
  let data = req.body;
  fixGSIData(data);
  io.emit("update", data);
  res.sendStatus(200);
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.json(req.file);
});

app.get("/players", (req, res) => {
  // GET a player
  players.readPlayers((err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send(rows);
      // console.log("Players sent");
    }
  });
});

app.post("/players", (req, res) => {
  // POST a player
  const { username, steamid, team, firstName, lastName, country, avatar } =
    req.body;
  players.createPlayer(
    username,
    steamid,
    team,
    firstName,
    lastName,
    country,
    avatar,
    (err, data) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(201).send(`Player added, ID: ${data.id}`);
        console.log(`Player added, ID: ${data.id}`);
      }
    }
  );
});

app.put("/players/:id", (req, res) => {
  // UPDATE a player
  const { username, steamid, team, firstName, lastName, country, avatar } =
    req.body;
  players.updatePlayer(
    req.params.id,
    username,
    steamid,
    team,
    firstName,
    lastName,
    country,
    avatar,
    (err) => {
      if (err) {
        console.log(`error updating player: ${err}`);
        res.status(500).send(err.message);
      } else {
        res.status(201).send(`Player added, ID: ${"Updated Player"}`);
        console.log(`Updated Player with ID: ${req.params.id}`);
      }
    }
  );
});

app.delete("/players/:id", (req, res) => {
  // DELETE a player
  players.deletePlayer(req.params.id, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send(`Deleted Player`);
      console.log(`Deleted Player with ID: ${req.params.id}`);
    }
  });
});

app.get("/players/:steamid", (req, res) => {
  // GET a player by steam_id
  players.getPlayerBySteamId(req.params.steamid, (err, row) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!row) {
      res.send(null);
      // console.log(`Player with steam_id: ${req.params.steam_id} not found`);
    } else {
      res.status(200).send(row);
      // console.log(`Player with steam_id: ${req.params.steam_id} sent`);
    }
  });
});

app.get("/teams/:id", (req, res) => {
  // GET a team by id
  teams.getTeamById(req.params.id, (err, row) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!row) {
      res.status(404).send(`Team with ID: ${req.params.id} not found`);
    } else {
      res.status(200).send(row);
      // console.log(`Team with ID: ${req.params.id} sent`);
    }
  });
});

app.get("/teams", (req, res) => {
  // GET a team
  teams.readTeams((err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send(rows);
      // console.log("Teams sent");
    }
  });
});

app.post("/teams", (req, res) => {
  // POST a player
  const { name, shortName, logo, country } = req.body;
  teams.createTeam(name, shortName, logo, country, Date.now(), (err, data) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send(`Team added, ID: ${data.id}`);
      console.log(`Team added, ID: ${data.id}`);
    }
  });
});

app.put("/teams/:id", (req, res) => {
  // UPDATE a team
  const { name, shortName, logo, country } = req.body;
  teams.updateTeam(
    req.params.id,
    name,
    shortName,
    logo,
    country,
    Date.now(),
    (err) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(201).send(`Updated Team with ID: ${req.params.id}`);
        console.log(`Updated Team with ID: ${req.params.id}`);
      }
    }
  );
});

app.delete("/teams/:id", (req, res) => {
  // DELETE a team
  teams.deleteTeam(req.params.id, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send(`Deleted Team with ID: ${req.params.id}`);
      console.log(`Deleted Team with ID: ${req.params.id}`);
    }
  });
});

app.get("/teams/:name", (req, res) => {
  // GET a team by name
  teams.getTeamByName(req.params.name, (err, row) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!row) {
      res.send(null);
      // console.log(`Team with name: ${req.params.name} not found`);
    } else {
      res.status(200).send(row);
      // console.log(`Team with name: ${req.params.name} sent`);
    }
  });
});

app.get("/teams/:id/logo", (req, res) => {
  // GET a team's logo by id
  teams.getTeamLogo(req.params.id, (err, row) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!row) {
      res.send(null);
      // console.log(`Team with ID: ${req.params.id} not found`);
    } else {
      res.status(200).send(row);
      // console.log(`Team with ID: ${req.params.id} sent`);
    }
  });
});

app.get("/matches", (req, res) => {
  // GET a match
  matches.readMatches((err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send(rows);
      // console.log("Matches sent");
    }
  });
});

app.post("/matches", (req, res) => {
  // POST a match
  const { current, left, right, matchType, vetos } = req.body;
  matches.createMatch(current, left, right, matchType, vetos, (err, data) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send(`Match added, ID: ${data.id}`);
      console.log(`Match added, ID: ${data.id}`);
    }
  });
});

app.put("/matches/:id", (req, res) => {
  // UPDATE a match
  const { current, left, right, matchType, vetos } = req.body;
  matches.updateMatch(
    req.params.id,
    current,
    left,
    right,
    matchType,
    vetos,
    (err) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(201).send(`Updated Match with ID: ${req.params.id}`);
        console.log(`Updated Match with ID: ${req.params.id}`);
      }
    }
  );
});

app.put("/matches/:id/current", (req, res) => {
  // UPDATE a match's current status
  const { current } = req.body;
  matches.updateCurrentMatch(req.params.id, current, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send(`Updated Match with ID: ${req.params.id}`);
      console.log(`Updated Match with ID: ${req.params.id}`);
      current
        ? io.emit("match-update", req.params.id)
        : io.emit("match-update", null);
    }
  });
});

app.delete("/matches/:id", (req, res) => {
  // DELETE a match
  matches.deleteMatch(req.params.id, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send(`Deleted Match with ID: ${req.params.id}`);
      console.log(`Deleted Match with ID: ${req.params.id}`);
    }
  });
});

app.get("/matches/:id", (req, res) => {
  // GET a match by id
  matches.getMatchById(req.params.id, (err, row) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!row) {
      res.send(null);
      // console.log(`Match with ID: ${req.params.id} not found`);
    } else {
      res.status(200).send(row);
      // console.log(`Match with ID: ${req.params.id} sent`);
    }
  });
});

app.get("/current_match", (req, res) => {
  // GET the current match
  console.log("Current Match requested");
  matches.getCurrentMatch((err, row) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!row) {
      res.send(null);
      // console.log(`Current Match not found`);
    } else {
      res.status(200).send(row);
      // console.log(`Current Match sent`);
    }
  });
});

app.put("/matches/:id/:team", (req, res) => {
  const { id, team } = req.params;
  const { action } = req.body;

  if (
    !["left", "right"].includes(team) ||
    !["add", "subtract"].includes(action)
  ) {
    return res.status(400).send("Invalid team or action");
  }

  matches.updateScore(id, team, action, (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send("Score updated");
  });

  io.emit("match-update", req.params.id);
});

// Export the app and io instances for testing
export { app, io, server };

server.listen(PORT, () =>
  console.log(`Server running on port ${HOST}:${PORT}`)
);
