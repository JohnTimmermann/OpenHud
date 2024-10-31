import React, { useEffect, useState } from "react";
import { Match } from "../../api/interfaces";
import { MatchCard } from "./MatchCard";
import { TeamProps } from "../Teams";
import { getTeams } from "../Teams";
import { Box } from "@mui/material";
import { MatchesTable } from "./MatchesTable";
import { MatchForm } from "./MatchForm";
import { getCurrentMatch } from "../../HUD/HUD";
import axios from "axios";
import { socket } from "../../App";
import { ButtonContained } from "../Components";

export const MatchTypes = ["bo1", "bo2", "bo3", "bo5"];
export const maps = [
  "de_mirage",
  "de_cache",
  "de_inferno",
  "de_dust2",
  "de_train",
  "de_overpass",
  "de_nuke",
  "de_vertigo",
  "de_ancient",
  "de_anubis",
];

export const getMatches = async () => {
  const matches = await axios.get("http://localhost:4000/matches");
  if (axios.isAxiosError(matches)) {
    console.log("Error fetching matches data");
    return [];
  }
  if (!matches) {
    return [];
  }
  // console.log('Matches data:', matches.data)
  return matches.data;
};

export const MatchesPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<TeamProps[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null); // Store selected player for editing
  const [open, setOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  // Fetch teams data when the component mounts
  useEffect(() => {
    getTeams().then((data) => {
      setTeams(data);
    });

    getMatches().then((data) => {
      setMatches(data);
    });

    const loadMatch = async () => {
      const matchData = await getCurrentMatch();
      if (!matchData) {
        setCurrentMatch(null);
        return;
      }
      setCurrentMatch(matchData);
    };

    loadMatch();

    socket.on("match-update", (data) => {
      // console.log("Match update:", data);
      loadMatch();
    });
  }, []);

  const fetchMatches = async () => {
    const data = await getMatches();
    setMatches(data);
  };

  const handleCreateMatch = async (match: Match) => {
    setIsLoading(true);
    console.log(match);
    await axios.post("http://localhost:4000/matches", match);
    await getMatches().then((data) => {
      setMatches(data);
    });
    setIsLoading(false);
  };

  const handleUpdateMatch = async (match: Match) => {
    setIsLoading(true);
    await axios.put(`http://localhost:4000/matches/${match.id}`, match);
    await getMatches().then((data) => {
      setMatches(data);
    });
    setIsLoading(false);
  };

  const handleEditMatch = (match: Match) => {
    setOpen(true);
    setIsEditing(true);
    setSelectedMatch(match);
    console.log("Selected match:", match);
    console.log(isEditing);
  };

  const handleDeleteMatch = async (id: string) => {
    setIsLoading(true);
    await axios.delete(`http://localhost:4000/matches/${id}`);
    await getMatches().then((data) => {
      setMatches(data);
    });
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        gap: 4,
      }}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-bold">Matches</h1>
        <ButtonContained onClick={() => setOpen(true)}>
          Create Match
        </ButtonContained>
      </div>
      {currentMatch && (
        <MatchCard match={currentMatch} refreshMatches={getMatches} />
      )}
      <MatchesTable
        matches={matches}
        deleteMatch={handleDeleteMatch}
        onEdit={handleEditMatch}
        refreshMatches={fetchMatches}
      />
      {isEditing && selectedMatch ? (
        <MatchForm
          teams={teams}
          match={selectedMatch}
          updateMatch={handleUpdateMatch}
          isEditing={isEditing}
          onCancel={() => setIsEditing(false)}
          setOpen={setOpen}
          open={open}
        />
      ) : (
        <MatchForm
          teams={teams}
          createMatch={handleCreateMatch}
          setOpen={setOpen}
          open={open}
        />
      )}
    </Box>
  );
};
