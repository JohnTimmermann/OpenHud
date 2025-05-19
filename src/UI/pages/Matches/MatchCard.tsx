import { useEffect, useState } from "react";
import { MdRemove, MdAdd, MdClose } from "react-icons/md";
import axios from "axios";
import knifeImage from "../../assets/knifeRound.png";
import { apiUrl } from "../../api/api";
import { useMatches } from "../../hooks";
import { PrimaryButton } from "../../components/PrimaryButton";

interface MatchCardProps {
  match: Match;
}

export const MatchCard = ({ match }: MatchCardProps) => {
  const [teamOneId, setTeamOneId] = useState(null);
  const [teamOneName, setTeamOneName] = useState("");
  const [teamOneLogo, setTeamOneLogo] = useState("");
  const [teamOneWins, setTeamOneWins] = useState<number>(match.left.wins | 0);

  const [teamTwoId, setTeamTwoId] = useState(null);
  const [teamTwoName, setTeamTwoName] = useState("");
  const [teamTwoLogo, setTeamTwoLogo] = useState("");
  const [teamTwoWins, setTeamTwoWins] = useState<number>(match.right.wins | 0);

  const [coaches, setCoaches] = useState<{ steamid: string }[]>([]);
  const [coachInput, setCoachInput] = useState<string>("");

  const { fetchMatches } = useMatches();

  useEffect(() => {
    const fetchTeamNames = async () => {
      try {
        const teamOne = await axios.get(`${apiUrl}/teams/${match.left.id}`);
        const teamTwo = await axios.get(`${apiUrl}/teams/${match.right.id}`);
        setTeamOneId(teamOne.data._id);
        setTeamOneName(teamOne.data.name);
        setTeamOneLogo(teamOne.data.logo);

        setTeamTwoId(teamTwo.data._id);
        setTeamTwoName(teamTwo.data.name);
        setTeamTwoLogo(teamTwo.data.logo);
      } catch (error) {
        console.error("Error fetching team names:", error);
      }
    };
    fetchTeamNames();
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const coachesData = await axios.get(`${apiUrl}/coaches/`);
      setCoaches(coachesData.data);
    } catch (error) {
      console.error("Error fetching coaches", error);
    }
  };

  const handleAddCoach = async () => {
    try {
      await axios.post(`${apiUrl}/coaches/`, { steamid: coachInput });
      await fetchCoaches();
      setCoachInput("");
    } catch (error) {
      console.error("Error adding coach", error);
    }
  };

  const handleDeleteCoach = async (coachId: string) => {
    try {
      await axios.delete(`${apiUrl}/coaches/${coachId}`);
      await fetchCoaches();
    } catch (error) {
      console.error("Error deleting coach", error);
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

  const handleReverseSideChange = async (index: number) => {
    const updatedVetos = [...match.vetos];
    updatedVetos[index].reverseSide = !updatedVetos[index].reverseSide;

    const updatedMatch = {
      ...match,
      vetos: updatedVetos,
    };

    try {
      await axios.put(`${apiUrl}/matches/current/update`, updatedMatch);
      fetchMatches();
    } catch (error) {
      console.error("Error updating veto:", error);
    }
  };

  const handleSetWinner = async (index: number, id?: string) => {
    const updatedVetos = [...match.vetos];
    updatedVetos[index].winner = id ? id : undefined;

    const updatedMatch = {
      ...match,
      vetos: updatedVetos,
    };

    try {
      await axios.put(`${apiUrl}/matches/current/update`, updatedMatch);
      fetchMatches();
    } catch (error) {
      console.error("Error updating veto:", error);
    }
  };

  const handleChangeScore = async (
    team: "left" | "right",
    action: "add" | "subtract",
  ) => {
    let newTeamOneWins = teamOneWins;
    let newTeamTwoWins = teamTwoWins;

    if (team === "left") {
      if (action === "add") {
        newTeamOneWins += 1;
      } else {
        newTeamOneWins -= 1;
      }
      setTeamOneWins(newTeamOneWins);
    } else {
      if (action === "add") {
        newTeamTwoWins += 1;
      } else {
        newTeamTwoWins -= 1;
      }
      setTeamTwoWins(newTeamTwoWins);
    }

    const updatedMatch: Match = {
      ...match,
      left: {
        ...match.left,
        wins: newTeamOneWins,
      },
      right: {
        ...match.right,
        wins: newTeamTwoWins,
      },
    };
    try {
      await axios.put(`${apiUrl}/matches/current/update`, updatedMatch);
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  return (
    <div
      key={match.id}
      className="relative flex flex-col bg-background-secondary p-4 lg:flex-row"
    >
      <div className="flex flex-auto flex-col items-center justify-center gap-2 p-2">
        <div className="flex flex-auto flex-col items-center justify-center rounded-lg bg-background-primary px-14 py-5">
          <h1 className="text-4xl font-bold text-sky-500 md:text-5xl">
            MATCH LIVE
          </h1>
          {/* <h2 className="text-3xl font-semibold md:text-4xl">
            {teamOneName} vs {teamTwoName}
          </h2> */}
          <div id="Score" className="mb-2 flex p-2">
            <div id="Teams" className="flex gap-6">
              <div id="TeamOne" className="flex flex-col items-center gap-1">
                <img
                  src={apiUrl + teamOneLogo}
                  alt="team1"
                  className="size-14"
                />
                <h1 className="text-6xl font-bold">{match.left.wins}</h1>
                <div className="inline-flex rounded-lg">
                  <PrimaryButton
                    onClick={() => handleChangeScore("left", "add")}
                  >
                    <MdAdd />
                  </PrimaryButton>

                  <PrimaryButton
                    onClick={() => handleChangeScore("left", "subtract")}
                  >
                    <MdRemove />
                  </PrimaryButton>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="flex items-center justify-center font-bold">
                  VS
                </h1>
                <h5 className="text-text-secondary">{match.matchType}</h5>
              </div>
              <div id="TeamTwo" className="flex flex-col items-center gap-1">
                <img
                  src={apiUrl + teamTwoLogo}
                  alt="team2"
                  className="size-14"
                />
                <h1 className="text-6xl font-bold">{match.right.wins}</h1>
                <div className="inline-flex rounded-lg">
                  <PrimaryButton
                    onClick={() => handleChangeScore("right", "add")}
                  >
                    <MdAdd />
                  </PrimaryButton>

                  <PrimaryButton
                    onClick={() => handleChangeScore("right", "subtract")}
                  >
                    <MdRemove />
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleStopMatch}
            className="rounded bg-secondary px-4 py-2 font-semibold uppercase transition-colors hover:bg-secondary-dark"
          >
            Stop Match
          </button>
          <div className="mt-2 flex flex-col items-center">
            <h5>Coaches</h5>
            <div className="flex gap-2">
              <input
                className="h-5/6 w-36"
                placeholder="steamid"
                name="coaches"
                type="text"
                value={coachInput}
                onChange={(e) => setCoachInput(e.target.value)}
              />
              <button
                className="h-5/6 rounded bg-background-light px-2"
                onClick={handleAddCoach}
              >
                Add
              </button>
            </div>
            {coaches.map((coach, index) => (
              <div key={index} className="flex">
                <div className="rounded-l-lg bg-background-light px-2">
                  {coach.steamid}
                </div>
                <button
                  className="rounded-r-lg bg-red-400 px-1"
                  onClick={() => handleDeleteCoach(coach.steamid)}
                >
                  <MdClose />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <table className="flex-auto table-fixed">
        <thead className="border-b border-border">
          <tr className="p-2">
            <th className="p-1 text-sm" align="center">
              Team
            </th>
            <th className="p-1 text-sm" align="center">
              Type
            </th>
            <th className="p-1 text-sm" align="center">
              Map
            </th>
            <th className="p-1 text-sm" align="center">
              Side
            </th>
            <th className="p-1 text-sm" align="center">
              Winner
            </th>
            <th className="p-1 text-sm" align="center">
              ReverseSide
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.values(match.vetos)
            .filter((veto) => veto.teamId || veto.type === "decider")
            .map((veto, index) => (
              <tr key={index} className="border-b border-border">
                <td className="p-2 text-lg font-semibold" align="center">
                  <img
                    src={
                      veto.teamId === teamOneId
                        ? apiUrl + teamOneLogo
                        : veto.teamId === teamTwoId
                          ? apiUrl + teamTwoLogo
                          : knifeImage
                    }
                    alt="team"
                    className="size-12"
                  />
                </td>
                <td className="p-2 text-lg font-semibold" align="center">
                  {veto.type}
                </td>
                <td className="p-2 text-lg font-semibold" align="center">
                  {veto.mapName.substring(3)}
                </td>
                <td className="p-2 text-lg font-semibold" align="center">
                  {veto.side === "NO" ? "" : veto.side}
                </td>
                <td className="p-2 text-lg font-semibold" align="center">
                  <form>
                    <select
                      className="rounded-md border border-border bg-background-primary p-2"
                      value={veto.winner ? veto.winner : ""}
                      onChange={(e) => handleSetWinner(index, e.target.value)}
                    >
                      <option value="">None</option>
                      {teamOneId && (
                        <option value={teamOneId}>{teamOneName}</option>
                      )}
                      {teamTwoId && (
                        <option value={teamTwoId}>{teamTwoName}</option>
                      )}
                    </select>
                  </form>
                </td>
                <td className="p-2 text-lg font-semibold" align="center">
                  <input
                    type="checkbox"
                    className="flex items-center justify-center"
                    checked={veto.reverseSide === true}
                    onChange={() => handleReverseSideChange(index)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
