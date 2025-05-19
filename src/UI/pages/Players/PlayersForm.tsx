import { useEffect, useState } from "react";
import {
  ButtonContained,
  Container,
  TextInput,
  Dialog,
} from "../../components";
import { countries } from "../../api/countries";
import { usePlayers, useTeams } from "../../hooks";
import { apiUrl } from "../../api/api";

interface PlayerFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const PlayerForm = ({ open, setOpen }: PlayerFormProps) => {
  const {
    createPlayer,
    updatePlayer,
    selectedPlayer,
    isEditing,
    setIsEditing,
    setSelectedPlayer,
  } = usePlayers();
  const { teams } = useTeams();

  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // For file upload
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [steamId, setSteamId] = useState("");
  const [team, setTeam] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [steamIdError, setSteamIdError] = useState("");
  const [steamIdFormatError, setSteamIdFormatError] = useState("");

  useEffect(() => {
    if (isEditing && selectedPlayer) {
      // Update form fields when selectedPlayer prop changes
      setUsername(selectedPlayer.username);
      setFirstName(selectedPlayer.firstName || "");
      setLastName(selectedPlayer.lastName || "");
      setSteamId(selectedPlayer.steamid);
      setTeam(selectedPlayer.team || "");
      setCountry(selectedPlayer.country || "");
    } else {
      handleReset();
    }
  }, [isEditing, selectedPlayer]);

  const validateForm = () => {
    let isValid = true;
    setUsernameError("");
    setSteamIdError("");
    setSteamIdFormatError("");

    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    }

    if (!steamId) {
      setSteamIdError("SteamID64 is required");
      isValid = false;
    } else if (!/^\d{17}$/.test(steamId)) {
      setSteamIdFormatError("SteamID64 must be 17 digits long");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Early return if validation fails

    setIsSubmitting(true);

    // Create a FormData object to handle file upload
    const formData = new FormData();
    if (isEditing && selectedPlayer) {
      formData.append("_id", selectedPlayer._id);
    }
    formData.append("username", username);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("steamid", steamId);
    formData.append("team", team);
    formData.append("country", country);
    if (avatarFile) {
      formData.append("avatar", avatarFile); // Append the file
    }

    try {
      if (isEditing && selectedPlayer) {
        await updatePlayer(selectedPlayer._id, formData); // Pass FormData to updatePlayer
      } else if (createPlayer) {
        await createPlayer(formData); // Pass FormData to createPlayer
      }
      setOpen(false);
      handleReset();
    } catch (error) {
      console.error("Error submitting player:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    handleReset(); // Reset form fields
    setOpen(false);
  };

  const handleReset = () => {
    setIsEditing(false);
    setSelectedPlayer(null);
    setUsername("");
    setAvatarFile(null); // Reset file input
    setFirstName("");
    setLastName("");
    setSteamId("");
    setTeam("");
    setCountry("");
    setUsernameError("");
    setSteamIdError("");
    setSteamIdFormatError("");
  };

  return (
    <Dialog onClose={handleCancel} open={open}>
      <h1>{isEditing && "Editing"}</h1>
      <div className="flex flex-1 border-b border-border">
        <h3 className="px-6 py-4 font-semibold">
          {isEditing ? `Updating: ${username}` : "Create Player"}
        </h3>
      </div>
      <Container>
        <div className="grid w-full flex-1 grid-cols-2 gap-4 overflow-y-scroll p-6">
          <TextInput
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            error={!!usernameError} // Set error state based on usernameError
            errorMessage={usernameError} // Show error message below field
          />
          <TextInput
            label="SteamID64"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            required
            error={!!steamIdError || !!steamIdFormatError} // Set error state based on steamIdError or steamIdFormatError
            errorMessage={steamIdError || steamIdFormatError} // Show error message below field
          />
          <TextInput
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextInput
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <div>
            <label htmlFor="team" className="mb-2 block font-medium text-text">
              Team
            </label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              name="Team"
            >
              <option value="" className="p-4 text-text">
                Team
              </option>
              {teams.map((team) => (
                <option
                  key={team._id}
                  value={team._id}
                  className="p-4 text-text"
                >
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-medium">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Country</option>
              {Object.entries(countries).map(([key, value]) => (
                <option key={key} value={key}>
                  {value as string}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="avatar"
              className="mb-2 block font-medium text-text"
            >
              Avatar
            </label>
            <div className="flex flex-col items-start gap-4">
              {/* Show current avatar if editing and player has one */}
              {isEditing && selectedPlayer?.avatar && (
                <img
                  src={apiUrl + selectedPlayer.avatar}
                  alt="Current Avatar"
                  className="size-36 rounded border object-cover"
                />
              )}

              {/* Hidden file input */}
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                className="hidden"
              />

              {/* Custom button to trigger file input */}
              <button
                type="button"
                onClick={() => document.getElementById("avatar")?.click()}
                className="rounded bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark"
              >
                Upload Avatar
              </button>

              {/* Display the selected file name */}
              {avatarFile && (
                <span className="text-sm text-gray-500">{avatarFile.name}</span>
              )}
            </div>
          </div>
        </div>
      </Container>
      <div className="inline-flex w-full justify-end gap-2 border-t border-border p-2">
        <div className="mt-1 flex justify-end gap-1">
          {isSubmitting ? (
            <ButtonContained disabled>Submitting...</ButtonContained>
          ) : (
            <ButtonContained onClick={handleSubmit}>Submit</ButtonContained>
          )}
          <ButtonContained onClick={handleReset}>Reset</ButtonContained>
          {isEditing && (
            <ButtonContained color="secondary" onClick={handleCancel}>
              Cancel
            </ButtonContained>
          )}
        </div>
      </div>
    </Dialog>
  );
};
