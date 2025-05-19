import { MdDelete, MdEdit } from "react-icons/md";
import { usePlayers, useTeams } from "../../hooks";
import { PrimaryButton } from "../../components/PrimaryButton";
import { apiUrl } from "../../api/api";
import { useState, useEffect } from "react";
import { PlayerSilhouette } from "./PlayersPage";

interface PlayersTableProps {
  onEdit: (player: Player) => void;
}

export const PlayersTable = ({ onEdit }: PlayersTableProps) => {
  const { filteredPlayers } = usePlayers();
  return (
    <table className="table-fixed">
      <thead className="sticky top-16 border-b border-border bg-background-secondary shadow">
        <tr>
          <th className="p-4 text-sm" align="left">
            Avatar
          </th>
          <th className="p-4 text-sm" align="center">
            Username
          </th>
          <th className="p-4 text-sm" align="center">
            Name
          </th>
          <th className="p-4 text-sm" align="center">
            Country
          </th>
          <th className="p-4 text-sm" align="center">
            SteamID
          </th>
          <th className="p-4 text-sm" align="center">
            Team
          </th>
          <th className="p-4 text-sm" align="right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border bg-background-secondary">
        {filteredPlayers.map((player: Player, index) => (
          <PlayerRow key={index} player={player} onEdit={onEdit} />
        ))}
      </tbody>
    </table>
  );
};

interface PlayerRowProps {
  player: Player;
  onEdit: (player: Player) => void;
}

const PlayerRow = ({ player, onEdit }: PlayerRowProps) => {
  const { deletePlayer } = usePlayers();
  const { getTeamById } = useTeams();
  const [team, setTeam] = useState<Team | null>(null);

  // Fetch team asynchronously
  useEffect(() => {
    let isMounted = true;
    getTeamById(player.team).then((result: Team) => {
      if (isMounted) setTeam(result);
    });
    return () => {
      isMounted = false;
    };
  }, [player.team, getTeamById]);

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(player); // Call onEdit prop function if provided
    }
  };

  return (
    <tr>
      <td className="px-4 py-2" align="left">
        <img
          src={player.avatar ? apiUrl + player.avatar : PlayerSilhouette}
          alt="Player avatar"
          className="size-20"
        />
      </td>
      <td className="px-4 py-2 font-semibold" align="center">
        {player.username}
      </td>
      <td className="px-4 py-2" align="center">
        {player.firstName + " " + player.lastName}
      </td>
      <td className="px-4 py-2 font-semibold" align="center">
        {player.country}
      </td>
      <td className="px-4 py-2 font-semibold" align="center">
        {player.steamid}
      </td>
      <td className="px-4 py-2 font-semibold" align="center">
        {team?.logo && <img src={apiUrl + team?.logo} alt="Team Logo" />}
      </td>
      <td className="px-4 py-2" align="right">
        <div className="inline-flex">
          <PrimaryButton onClick={() => handleEditClick()}>
            <MdEdit className="size-5" />
          </PrimaryButton>

          <PrimaryButton onClick={() => deletePlayer(player._id)}>
            <MdDelete className="size-5" />
          </PrimaryButton>
        </div>
      </td>
    </tr>
  );
};
