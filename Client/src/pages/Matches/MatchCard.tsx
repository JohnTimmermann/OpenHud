import { useEffect, useState } from "react";
import { Match } from "../../api/interfaces";
import { MdRemove, MdAdd } from "react-icons/md";
import axios from "axios";
import knifeImage from "../../assets/knifeRound.png";
import { PORT, HOST } from "../../App";

interface MatchCardProps {
  match: Match;
  refreshMatches: () => void;
}

export const MatchCard = ({ match, refreshMatches }: MatchCardProps) => {
  const [teamOneName, setTeamOneName] = useState("");
  const [teamOneLogo, setTeamOneLogo] = useState("");
  const [teamTwoName, setTeamTwoName] = useState("");
  const [teamTwoLogo, setTeamTwoLogo] = useState("");
  const [teamOneId, setTeamOneId] = useState(null);
  const [teamTwoId, setTeamTwoId] = useState(null);

  useEffect(() => {
    const fetchTeamNames = async () => {
      try {
        const teamOne = await axios.get(
          `${HOST}:${PORT}/teams/${match.left.id}`,
        );
        const teamTwo = await axios.get(
          `${HOST}:${PORT}/teams/${match.right.id}`,
        );
        setTeamOneName(teamOne.data.name);
        setTeamOneLogo(teamOne.data.logo);
        setTeamTwoName(teamTwo.data.name);
        setTeamTwoLogo(teamTwo.data.logo);
        setTeamOneId(teamOne.data._id);
        setTeamTwoId(teamTwo.data._id);
      } catch (error) {
        console.error("Error fetching team names:", error);
      }
    };

    fetchTeamNames();
  }, []);

  const handleStopMatch = async () => {
    try {
      await axios.put(`${HOST}:${PORT}/matches/${match.id}/current`, {
        current: false,
      });
      refreshMatches();
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
      await axios.put(`${HOST}:${PORT}/matches/current/update`, updatedMatch);
      refreshMatches();
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
      await axios.put(`${HOST}:${PORT}/matches/current/update`, updatedMatch);
      refreshMatches();
    } catch (error) {
      console.error("Error updating veto:", error);
    }
  };
  const handleSetScore = async (
    index: number,
    teamOneScore: number,
    teamTwoScore: number,
  ) => {
    const updatedVetos = [...match.vetos];
    updatedVetos[index].score = {
      teamOne: teamOneScore,
      teamTwo: teamTwoScore,
    };

    const updatedMatch = {
      ...match,
      vetos: updatedVetos,
    };

    try {
      await axios.put(`${HOST}:${PORT}/matches/current/update`, updatedMatch);
      refreshMatches();
    } catch (error) {
      console.error("Error updating veto:", error);
    }
  };

  const handleChangeScore = async (
    team: "left" | "right",
    action: "add" | "subtract",
  ) => {
    try {
      await axios.put(`${HOST}:${PORT}/matches/${match.id}/${team}`, {
        action,
      });
      refreshMatches();
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  return (
    <div
      key={match.id}
      className="relative flex flex-col bg-background2 p-4 lg:flex-row"
    >
      <div className="flex flex-auto flex-col items-center justify-center gap-2 p-2">
        <div className="flex flex-auto flex-col items-center justify-center rounded-lg bg-background px-14 py-5">
          <h1 className="text-4xl font-bold text-sky-500 md:text-5xl">
            MATCH LIVE
          </h1>
          <h2 className="text-3xl font-semibold md:text-4xl">
            {teamOneName} vs {teamTwoName}
          </h2>
          <h5>{match.matchType}</h5>
          <div id="Score" className="mb-2 flex flex-col p-2">
            <div id="Teams" className="flex gap-2">
              <div
                id="TeamOne"
                className="flex flex-col items-center justify-center gap-1"
              >
                <h1 className="text-6xl font-bold">{match.left.wins}</h1>
                <img src={teamOneLogo} alt="team1" width="50" />
                <div className="inline-flex">
                  <button
                    className="relative inline-flex min-w-[40px] items-center justify-center rounded-l border border-r-0 border-primary/50 p-2 px-4 py-1 text-primary transition-colors hover:bg-primary/10"
                    onClick={() => handleChangeScore("left", "add")}
                  >
                    <MdAdd />
                  </button>

                  <button
                    className="relative inline-flex min-w-[40px] items-center justify-center rounded-r border border-primary/50 p-2 px-4 py-1 text-primary transition-colors hover:bg-primary/10"
                    onClick={() => handleChangeScore("left", "subtract")}
                  >
                    <MdRemove />
                  </button>
                </div>
              </div>
              <div
                id="TeamTwo"
                className="flex flex-col items-center justify-center gap-1"
              >
                <h1 className="text-6xl font-bold">{match.right.wins}</h1>
                <img src={teamTwoLogo} alt="team2" width="50" />
                <div className="inline-flex">
                  <button
                    className="relative inline-flex min-w-[40px] items-center justify-center rounded-l border border-r-0 border-primary/50 p-2 px-4 py-1 text-primary transition-colors hover:bg-primary/10"
                    onClick={() => handleChangeScore("right", "add")}
                  >
                    <MdAdd />
                  </button>

                  <button
                    className="relative inline-flex min-w-[40px] items-center justify-center rounded-r border border-primary/50 p-2 px-4 py-1 text-primary transition-colors hover:bg-primary/10"
                    onClick={() => handleChangeScore("right", "subtract")}
                  >
                    <MdRemove />
                  </button>
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
            {/* <th className="p-1 text-sm" align="center">
              Map Score
            </th> */}
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
                        ? teamOneLogo
                        : veto.teamId === teamTwoId
                          ? teamTwoLogo
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
                      className="rounded-md border border-border bg-background p-2"
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
                {/* <td className="p-2 text-lg font-semibold" align="center">
                  {veto.type !== "ban" && (
                    <div className="flex w-1/3 gap-2">
                      <input
                        className={`h-14 w-full rounded-md border border-gray-500 bg-background2 px-3 py-2 placeholder:text-text-secondary focus:border-0 focus:outline-none focus:ring-2 focus:ring-primary`}
                        type="number"
                        value={veto.score?.teamOne || 0}
                        onChange={(e) =>
                          handleSetScore(
                            index,
                            veto.score?.teamOne || 0,
                            parseInt(e.target.value),
                          )
                        }
                      />
                      <input
                        className={`h-14 w-full rounded-md border border-gray-500 bg-background2 px-3 py-2 placeholder:text-text-secondary focus:border-0 focus:outline-none focus:ring-2 focus:ring-primary`}
                        type="number"
                        value={veto.score?.teamOne || 0}
                        onChange={(e) =>
                          handleSetScore(
                            index,
                            veto.score?.teamOne || 0,
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  )}
                </td> */}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
