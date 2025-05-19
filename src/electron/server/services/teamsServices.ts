import db from "../../database/database.js";

//Services don't know they are working with express.

export const getTeams = () => {
  const sql = `SELECT * FROM teams`;
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Error getting teams: ", err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const createTeam = (team: Team) => {
  const sql = `
  INSERT INTO teams (_id, name, country, shortName, logo, extra)
  VALUES (?, ?, ?, ?, ?, ?)
`;
  console.log(team);
  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [
        team._id,
        team.name,
        team.country,
        team.shortName,
        team.logo,
        team.extra,
      ],
      function (err) {
        if (err) {
          console.error("Error inserting team:", err.message);
          reject(err);
        } else {
          console.log(`team ${team.name} created with ID ${team._id}`);
          resolve(team);
        }
      },
    );
  });
};

export const deleteTeam = (id: string) => {
  const sql = `DELETE FROM teams WHERE _id = ?`;
  return new Promise((resolve, reject) => {
    db.run(sql, [id], function (err) {
      if (err) {
        console.error("Error deleting team :", err.message);
        reject(err);
      } else {
        console.log(`Team deleted`);
        resolve("Team deleted");
      }
    });
  });
};

export const updateTeam = (id: string, team: Team) => {
  const sql = `UPDATE teams SET name = ?, country = ?, shortName = ?, logo = ?, extra = ? WHERE _id = ?`;
  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [team.name, team.country, team.shortName, team.logo, team.extra, id],
      function (err) {
        if (err) {
          console.error("Error updating team :", err.message);
          reject(err);
        } else {
          console.log(`Team updated with id: ${id}`);
          resolve(`Team updated with id: ${id}`);
        }
      },
    );
  });
};

export const getTeamById = (id: string) => {
  const sql = `SELECT * FROM teams WHERE _id = ?`;
  return new Promise((resolve, reject) => {
    db.get(sql, [id], function (err, row) {
      if (err) {
        console.error("Error finding team:", err.message);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};
