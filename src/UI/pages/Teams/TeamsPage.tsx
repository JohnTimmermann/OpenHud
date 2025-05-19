import { useState } from "react";
import { TeamsTable } from "./TeamsTable";
import { TeamsForm } from "./TeamForm";
import { Topbar } from "../MainPanel/Topbar";
import { useTeams } from "../../hooks";

export const TeamsPage = () => {
  const [open, setOpen] = useState(false);

  const { setIsEditing, setSelectedTeam } = useTeams();

  const handleEditTeam = (team: Team) => {
    // Handle edit player logic
    setIsEditing(true);
    setSelectedTeam(team);
    setOpen(true);
  };

  return (
    <div className="relative flex size-full flex-col">
      <Topbar header="Teams" buttonText="Team" openForm={setOpen} />
      <TeamsForm open={open} setOpen={setOpen} />
      <TeamsTable onEdit={handleEditTeam} />
    </div>
  );
};
