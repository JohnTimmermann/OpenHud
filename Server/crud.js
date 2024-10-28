import { db } from "./database.js";

export const createPlayer = (alias, steam_id, team, real_name, country, avatar, last_updated, callback) => {
    const sql = `INSERT INTO players(alias,steam_id,team,real_name,country,avatar,last_updated) VALUES(?,?,?,?,?,?,?)`;
    db.run(sql, [alias, steam_id, team, real_name, country, avatar, last_updated], function(err) {
        callback(err, { id: this.lastID });
        if (err) {
            console.error(err.message);
        }
    });
};

export const readPlayers = (callback) => {
    const sql = `SELECT * FROM players`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
        if (err) {
            return console.error(err.message);
        }
    });
};

export const updatePlayer = (id, alias, steam_id, team, real_name, country, avatar, last_updated, callback) => {
    const sql = `UPDATE players SET alias = ?, steam_id = ?, team = ?, real_name = ?, country = ?, avatar = ?, last_updated = ? WHERE id = ?`;
    db.run(sql, [alias, steam_id, team, real_name, country, avatar, last_updated, id], function(err) {
        callback(err);
        if (err) {
            return console.error(err.message);
        }
    });
};

export const deletePlayer = (id, callback) => {
    const sql = `DELETE FROM players WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
        if (err) {
            return console.error(err.message);
        }
    });
};

export const getPlayerBySteamId = (steam_id, callback) => {
    const sql = `SELECT * FROM players WHERE steam_id = ?`;
    db.get(sql, [steam_id], (err, row) => {
        callback(err, row);
        if (err) {
            return console.error(err.message);
        }
        // console.log("Player sent: ", row);
    });
};

export const createTeam = (name, shortName, logo, country, last_updated, callback) => {
    const sql = `INSERT INTO teams(name,shortName,logo,country,last_updated) VALUES(?,?,?,?,?)`;
    db.run(sql, [name, shortName, logo, country, last_updated], function(err) {
        callback(err, { id: this.lastID });
        if (err) {
            console.error(err.message);
        }
    });
};

export const readTeams = (callback) => {
    const sql = `SELECT * FROM teams`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
        if (err) {
            return console.error(err.message);
        }
    });
};

export const updateTeam = (id, name, shortName, logo, country, last_updated, callback) => {
    const sql = `UPDATE teams SET name = ?, shortName = ?, logo = ?, country = ?, last_updated = ? WHERE id = ?`;
    db.run(sql, [name, shortName, logo, country, last_updated, id], function(err) {
        callback(err);
        if (err) {
            return console.error(err.message);
        }
    });
};

export const deleteTeam = (id, callback) => {
    const sql = `DELETE FROM teams WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
        if (err) {
            return console.error(err.message);
        }
    });
};

export const getTeamByName = (name, callback) => {
    const sql = `SELECT * FROM teams WHERE name = ?`;
    db.get(sql, [name], (err, row) => {
        callback(err, row);
        if (err) {
            return console.error(err.message);
        }
    });
};

export const getTeamById = (id, callback) => {
    const sql = `SELECT * FROM teams WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
        if (err) {
            return console.error(err.message);
        }
    });
};

export const getTeamLogo = (id, callback) => {
    const sql = `SELECT logo FROM teams WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        callback(err, row);
        if (err) {
            return console.error(err.message);
        }
    });
};

export const createMatch = (current, left, right, matchType, vetos, callback) => {
    const sql = `INSERT INTO matches(current, left, right, matchType, vetos) VALUES(?,?,?,?,?)`;
    // Convert objects to JSON strings
    const leftJson = JSON.stringify(left);
    const rightJson = JSON.stringify(right);
    const vetosJson = JSON.stringify(vetos);
    db.run(sql, [current ? 1 : 0, leftJson, rightJson, matchType, vetosJson], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, this.lastID); 
    });
};


export const readMatches = (callback) => {
    const sql = `SELECT * FROM matches`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return callback(err);
        }

        // Parse JSON fields back to objects
        const matches = rows.map(row => ({
            id: row.id,
            current: Boolean(row.current),
            left: JSON.parse(row.left),
            right: JSON.parse(row.right),  
            matchType: row.matchType,
            vetos: JSON.parse(row.vetos)
        }));

        callback(null, matches);
    });
};




export const updateMatch = (id, current, left, right, matchType, vetos, callback) => {
    const leftJson = JSON.stringify(left);
    const rightJson = JSON.stringify(right);
    const vetosJson = JSON.stringify(vetos);
    const sql = `UPDATE matches SET current = ?, left = ?, right = ?, matchType = ?, vetos = ? WHERE id = ?`;
    db.run(sql, [current, leftJson, rightJson, matchType, vetosJson, id], function(err) {
        callback(err);
        if (err) {
            return console.error(err.message);
        }
    });
};

export const updateScore = (id, team, action, callback) => {
    const getMatchSql = `SELECT * FROM matches WHERE id = ?`;

    db.get(getMatchSql, [id], (err, row) => {
        if (err) {
            return callback(err);
        }

        if (!row) {
            return callback(new Error('Match not found'));
        }

        const match = {
            id: row.id,
            current: Boolean(row.current),
            left: JSON.parse(row.left),
            right: JSON.parse(row.right),
            matchType: row.matchType,
            vetos: JSON.parse(row.vetos)
        };

        if (team === 'left') {
            match.left.wins = action === 'add' ? match.left.wins + 1 : Math.max(match.left.wins - 1, 0);
        } else if (team === 'right') {
            match.right.wins = action === 'add' ? match.right.wins + 1 : Math.max(match.right.wins - 1, 0);
        }

        const leftJson = JSON.stringify(match.left);
        const rightJson = JSON.stringify(match.right);
        const updateSql = `UPDATE matches SET left = ?, right = ? WHERE id = ?`;

        db.run(updateSql, [leftJson, rightJson, id], function (err) {
            callback(err);
            if (err) {
                return console.error(err.message);
            }
        });
    });
};

export const updateCurrentMatch = (id, current, callback) => {
    const checkCurrentSql = `SELECT id FROM matches WHERE current = 1`;

    // First, check if there's already a current match
    db.get(checkCurrentSql, [], (err, row) => {
        if (err) {
            return callback(err);
        }

        // If a current match exists and we're trying to set a new one
        if (row && current) {
            return callback(new Error("There is already a current match"));
        }

        // Proceed with the update if no current match exists or if setting current to false
        const updateSql = `UPDATE matches SET current = ? WHERE id = ?`;
        db.run(updateSql, [current, id], function (err) {
            callback(err);
            if (err) {
                console.error(err.message);
            }
        });
    });
};


export const deleteMatch = (id, callback) => {
    const sql = `DELETE FROM matches WHERE id = ?`;
    db.run(sql, [id], (err) => {
        callback(err);
        if (err) {
            return console.error(err.message);
        }
    });
};

export const getMatchById = (id, callback) => {
    const sql = `SELECT * FROM matches WHERE id = ?`;

    db.get(sql, [id], (err, row) => {
        if (err) {
            return callback(err);
        }

        if (!row) {
            return callback(new Error('Match not found'));
        }

        // Parse JSON fields back to objects
        const match = {
            id: row.id,
            current: Boolean(row.current),
            left: JSON.parse(row.left),
            right: JSON.parse(row.right),  
            matchType: row.matchType,
            vetos: JSON.parse(row.vetos)
        };

        callback(null, match);
    });
};

export const getCurrentMatch = (callback) => {
    const sql = `SELECT * FROM matches WHERE current = 1`;

    db.get(sql, (err, row) => {
        if (err) {
            return callback(err);
        }

        if (!row) {
            return callback(null, null);
        }

        // Parse JSON fields back to objects
        const match = {
            id: row.id,
            current: Boolean(row.current),
            left: JSON.parse(row.left),
            right: JSON.parse(row.right),  
            matchType: row.matchType,
            vetos: JSON.parse(row.vetos)
        };

        callback(null, match);
    });
};