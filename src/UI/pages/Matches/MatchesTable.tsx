import { MdPlayArrow, MdCancel, MdDelete, MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../api/socket";
import { apiUrl } from "../../api/api";
import { useMatches } from "../../hooks";
import { PrimaryButton } from "../../components/PrimaryButton";

interface MatchTableProps {
  onEdit: (match: Match) => void;
}

export const MatchesTable = ({ onEdit }: MatchTableProps) => {
  const { matches, fetchMatches } = useMatches();

  useEffect(() => {
    socket.on("match", () => {
      fetchMatches();
    });
  }, []);
  return (
    <table className="table-fixed">
      <thead className="sticky top-16 border-b border-border bg-background-secondary shadow">
        <tr>
          <th className="p-4 text-sm" align="left">
            Match
          </th>
          <th className="p-4 text-sm" align="center">
            Type
          </th>
          <th className="p-4 text-sm" align="center">
            Score
          </th>
          <th className="p-4 text-sm" align="right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border bg-background-secondary">
        {matches.map((match: Match, index) => (
          <MatchRow key={index} match={match} onEdit={onEdit} />
        ))}
      </tbody>
    </table>
  );
};

interface MatchRowProps {
  match: Match;
  onEdit: (match: Match) => void;
}

const MatchRow = ({ match, onEdit }: MatchRowProps) => {
  const [teamOneName, setTeamOneName] = useState("");
  const [teamOneLogo, setTeamOneLogo] = useState("");
  const [teamTwoName, setTeamTwoName] = useState("");
  const [teamTwoLogo, setTeamTwoLogo] = useState("");
  const { fetchMatches, deleteMatch } = useMatches();

  useEffect(() => {
    const fetchTeamNames = async () => {
      try {
        const teamOne = await axios.get(`${apiUrl}/teams/${match.left.id}`);
        const teamTwo = await axios.get(`${apiUrl}/teams/${match.right.id}`);
        setTeamOneName(teamOne.data.name);
        setTeamOneLogo(teamOne.data.logo);
        setTeamTwoName(teamTwo.data.name);
        setTeamTwoLogo(teamTwo.data.logo);
      } catch (error) {
        console.error("Error fetching team names:", error);
      }
    };

    fetchTeamNames();
  }, []);

  const handleEditClick = () => {
    onEdit(match);
  };

  const handleStartMatch = async () => {
    try {
      await axios.put(`${apiUrl}/matches/${match.id}/current`, {
        current: true,
      });

      fetchMatches();
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  const handleStopMatch = async () => {
    try {
      await axios.put(`${apiUrl}/matches/${match.id}/current`, {
        current: false,
      });
      fetchMatches();
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  return (
    <tr>
      <td className="px-4 py-2 text-xl font-semibold md:text-2xl" align="left">
        <span className="mr-4">
          {teamOneName} vs {teamTwoName}
        </span>
        {match.current ? (
          <span className="font-semibold text-secondary">LIVE</span>
        ) : (
          ""
        )}
      </td>
      <td
        className="px-4 py-2 font-semibold uppercase text-gray-400"
        align="center"
      >
        {match.matchType}
      </td>
      <td className="px-4 py-2 text-lg font-semibold" align="center">
        <h6 className="flex items-center justify-center gap-2">
          <img
            src={apiUrl + teamOneLogo}
            className="hidden size-12 md:block"
            alt="Team One Logo"
          />{" "}
          {match.left.wins} - {match.right.wins}{" "}
          <img
            className="hidden size-12 md:block"
            src={apiUrl + teamTwoLogo}
            alt="Team Two Logo"
          />
        </h6>
      </td>
      <td className="px-4 py-2" align="right">
        {match.current ? (
          <div className="inline-flex">
            <PrimaryButton onClick={handleStopMatch}>
              <MdCancel className="size-6 text-secondary-light" />
            </PrimaryButton>
          </div>
        ) : (
          <div className="inline-flex">
            <PrimaryButton onClick={handleStartMatch}>
              <MdPlayArrow className="size-6" />
            </PrimaryButton>
            <PrimaryButton onClick={() => handleEditClick()}>
              <MdEdit className="size-6" />
            </PrimaryButton>

            <PrimaryButton onClick={() => deleteMatch(match.id)}>
              <MdDelete className="size-6" />
            </PrimaryButton>
          </div>
        )}
      </td>
    </tr>
  );
};
