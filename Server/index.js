import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
// import * as API from "./database/crud.js";
import * as teams from "./database/teams/teams.js";
import * as players from "./database/players/players.js";
import * as matches from "./database/matches/matches.js";
import { CSGOGSI } from "csgogsi";
const app = express();
const server = http.createServer(app);
const HOST = "localhost";
const PORT = 1349;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GSI = new CSGOGSI();

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
app.use(express.static(path.join(__dirname, "build")));

app.get("/hud", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

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

  socket.on("matchEnd", (score) => {
    console.log(score);
  });
});

// Listen for the game data POST requests to /gsi
app.post("/gsi", express.json(), (req, res) => {
  let data = req.body;
  // console.log(data);
  fixGSIData(data);
  GSI.digest(data);
  io.emit("update", data);
  res.sendStatus(200);
});
// const onRoundEnd = async (score) => {
//   if (score.loser && score.loser.logo) {
//     delete score.loser.logo;
//   }
//   if (score.winner && score.winner.logo) {
//     delete score.winner.logo;
//   }
//   const matches = await getMatches();
//   const match = matches.filter((match) => match.current)[0];
//   if (!match) return;
//   const { vetos } = match;
//   const mapName = score.map.name.substring(score.map.name.lastIndexOf("/") + 1);
//   vetos.map((veto) => {
//     if (
//       veto.mapName !== mapName ||
//       !score.map.team_ct.id ||
//       !score.map.team_t.id ||
//       veto.mapEnd
//     ) {
//       return veto;
//     }
//     if (!veto.score) {
//       veto.score = {};
//     }
//     veto.score[score.map.team_ct.id] = score.map.team_ct.score;
//     veto.score[score.map.team_t.id] = score.map.team_t.score;
//     if (veto.reverseSide) {
//       veto.score[score.map.team_t.id] = score.map.team_ct.score;
//       veto.score[score.map.team_ct.id] = score.map.team_t.score;
//     }
//     return veto;
//   });
//   match.vetos = vetos;
//   await updateMatch(match);

//   io.emit("match", true);
// };

// const onMatchEnd = async (score) => {
//   console.log("Match Ended");
//   const matches = await matches.readMatches((err, rows) => {
//     if (err) {
//       return err.message;
//     } else {
//       return rows;
//     }
//   });
//   const match = matches.filter((match) => match.current)[0];
//   const mapName = score.map.name.substring(score.map.name.lastIndexOf("/") + 1);
//   if (match) {
//     const { vetos } = match;
//     const isReversed = vetos.filter(
//       (veto) => veto.mapName === mapName && veto.reverseSide
//     )[0];
//     vetos.map((veto) => {
//       if (
//         veto.mapName !== mapName ||
//         !score.map.team_ct.id ||
//         !score.map.team_t.id
//       ) {
//         return veto;
//       }
//       veto.winner =
//         score.map.team_ct.score > score.map.team_t.score
//           ? score.map.team_ct.id
//           : score.map.team_t.id;
//       if (isReversed) {
//         veto.winner =
//           score.map.team_ct.score > score.map.team_t.score
//             ? score.map.team_t.id
//             : score.map.team_ct.id;
//       }
//       if (veto.score && veto.score[veto.winner]) {
//         veto.score[veto.winner]++;
//       }
//       veto.mapEnd = true;
//       return veto;
//     });
//     if (match.left.id === score.winner.id) {
//       if (isReversed) {
//         match.right.wins++;
//       } else {
//         match.left.wins++;
//       }
//     } else if (match.right.id === score.winner.id) {
//       if (isReversed) {
//         match.left.wins++;
//       } else {
//         match.right.wins++;
//       }
//     }
//     match.vetos = vetos;
//     await updateMatch(match);
//     await createNextMatch(match.id);
//     io.emit("match", true);
//   }
// };

let last;

GSI.on("data", async (data) => {
  // await updateRound(data);
  // let round;
  // if (
  //   (last?.map.team_ct.score !== data.map.team_ct.score) !==
  //   (last?.map.team_t.score !== data.map.team_t.score)
  // ) {
  //   if (last?.map.team_ct.score !== data.map.team_ct.score) {
  //     round = {
  //       winner: data.map.team_ct,
  //       loser: data.map.team_t,
  //       map: data.map,
  //       mapEnd: false,
  //     };
  //   } else {
  //     round = {
  //       winner: data.map.team_t,
  //       loser: data.map.team_ct,
  //       map: data.map,
  //       mapEnd: false,
  //     };
  //   }
  // }
  // console.log(round);
  // if (round) {
  //   await onRoundEnd(round);
  // }
  // if (data.map.phase === "gameover" && last.map.phase !== "gameover") {
  //   const winner =
  //     data.map.team_ct.score > data.map.team_t.score
  //       ? data.map.team_ct
  //       : data.map.team_t;
  //   const loser =
  //     data.map.team_ct.score > data.map.team_t.score
  //       ? data.map.team_t
  //       : data.map.team_ct;
  //   const final = {
  //     winner,
  //     loser,
  //     map: data.map,
  //     mapEnd: true,
  //   };
  //   await onMatchEnd(final);
  // }
  // last = GSI.last;
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
  matches.setCurrentMatch(req.params.id, current, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send(`Updated Match with ID: ${req.params.id}`);
      console.log(`Updated Match with ID: ${req.params.id}`);
      current ? io.emit("match", req.params.id) : io.emit("match", null);
    }
  });
});

// New endpoint to update the current match with new match values
app.put("/matches/current/update", (req, res) => {
  const newMatch = req.body;
  matches.updateCurrentMatch(newMatch, (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send(`Updated Current Match with ID: ${result.id}`);
      console.log(`Updated Current Match with ID: ${result.id}`);
      io.emit("match", result.id);
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

  io.emit("match", req.params.id);
});

// Export the app and io instances for testing
export { app, io, server };

server.listen(PORT, () =>
  console.log(`Server running on port ${HOST}:${PORT}`)
);
