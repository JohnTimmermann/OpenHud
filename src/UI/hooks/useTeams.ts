import { useTeamsContext } from "../context/TeamsContext";
import axios from "axios";
import { apiUrl } from "../api/api";

export const useTeams = () => {
  const {
    teams,
    selectedTeam,
    filteredTeams,
    isLoading,
    isEditing,
    setSelectedTeam,
    setFilteredTeams,
    fetchTeams,
    setIsLoading,
    setIsEditing,
  } = useTeamsContext();

  const searchTeams = (searchValue: string) => {
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(searchValue.toLowerCase()),
    );
    if (searchValue === "") {
      setFilteredTeams(teams);
    } else {
      setFilteredTeams(filtered);
    }
  };

  const createTeam = async (team: FormData) => {
    // Handle create or update player logic
    setIsLoading(true);
    await axios.post(`${apiUrl}/teams`, team);
    fetchTeams();
    setIsLoading(false);
  };

  const updateTeam = async (team_id: string, team: FormData) => {
    // Handle update player logic
    setIsLoading(true);
    await axios.put(`${apiUrl}/teams/${team_id}`, team);
    fetchTeams();
    setSelectedTeam(null);
    setIsLoading(false);
  };

  const deleteTeam = async (id: string) => {
    // Handle delete player logic
    setIsLoading(true);
    await axios.delete(`${apiUrl}/teams/${id}`);
    fetchTeams();
    setIsLoading(false);
  };

  const getTeams = async () => {
    try {
      const teams = await axios.get(`${apiUrl}/teams`);
      if (!teams) {
        return [];
      }
      return teams.data;
    } catch (error) {
      console.log("Error getting teams:\n", error);
      return [];
    }
  };

  const getTeamById = async (id: string) => {
    try {
      const team = await axios.get(`${apiUrl}/teams/${id}`);
      if (!teams) {
        return [];
      }
      return team.data;
    } catch (error) {
      console.log("Error getting teams:\n", error);
      return [];
    }
  };

  return {
    teams,
    selectedTeam,
    filteredTeams,
    isLoading,
    isEditing,
    setFilteredTeams,
    setSelectedTeam,
    setIsEditing,
    fetchTeams,
    searchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeams,
    getTeamById,
  };
};
