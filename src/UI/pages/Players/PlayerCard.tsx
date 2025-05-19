import { PlayerSilhouette } from "./PlayersPage";
import { MdEdit, MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { usePlayers, useTeams } from "../../hooks";
import { apiUrl } from "../../api/api";

interface PlayerCardProps {
  player: Player;
  onEdit?: (player: Player) => void;
}

export const PlayerCard = ({ player, onEdit }: PlayerCardProps) => {
  const [team, setTeam] = useState<Team | null>(null);
  const { deletePlayer } = usePlayers();
  const { getTeamById } = useTeams();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const teamData = await getTeamById(player.team);
        if (!teamData) {
          setTeam(null);
          return;
        }
        setTeam(teamData);
      } catch (error) {
        console.log(error);
        setTeam(null);
      }
    };
    fetchTeam();
  }, [player, getTeamById]);

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(player);
    }
  };

  return (
    <div className="relative flex w-full flex-col rounded-lg border border-border bg-background-secondary px-2 py-2">
      {team?.logo && (
        <img
          src={apiUrl + team.logo}
          className="absolute top-2 size-8 opacity-15"
        />
      )}
      <div className="relative flex w-full justify-center">
        <img
          className="mx-4 size-24 rounded-lg"
          src={player.avatar ? apiUrl + player.avatar : PlayerSilhouette}
          alt="Player Avatar"
        />
      </div>
      <h4 className="text-center font-semibold">{player.username}</h4>
      <div className="flex w-full items-center justify-center">
        <button
          className="relative z-10 flex items-center justify-center rounded-lg p-1 transition-colors hover:bg-background-light"
          onClick={() => handleEditClick()}
        >
          <MdEdit className="size-5" />
        </button>
        <button
          className="relative z-10 flex items-center justify-center rounded-lg p-1 transition-colors hover:bg-background-light"
          onClick={() => deletePlayer(player._id)}
        >
          <MdDelete className="size-5" />
        </button>
      </div>
    </div>
  );
};
