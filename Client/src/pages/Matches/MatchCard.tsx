import { Delete } from '@mui/icons-material';
import { Match, Veto } from '../../api/interfaces';
import {  Box, IconButton, Typography} from '@mui/material';
import StartIcon from '@mui/icons-material/Start';
import { Edit } from '@mui/icons-material';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import ToggleButton from '@mui/material/ToggleButton';
import { useEffect, useState } from 'react';
import { socket } from '../../App';
import axios from 'axios';


interface MatchCardProps {
    match: Match;
    deleteMatch: (id: string) => void;
    onEdit?: (match: Match) => void; // Added onEdit prop
  }
  
  export const MatchCard = ({ match, deleteMatch, onEdit }: MatchCardProps) => {
    const [displayVeto, setDisplayVeto] = useState(false); // Flag to track copy state
    const [isLive, setIsLive] = useState(false);

    const handleEditClick = () => {
      if (onEdit) {
        onEdit(match); // Call onEdit prop function if provided
      }
    };

    const handleStartMatch = () => {
      setIsLive(true);
      // axios.put(`http://localhost:4000/matches/${match.id}`, { ...match, current: true });
      socket.emit('start_match', match.id);
    };

    const handleStopMatch = () => {
      setIsLive(false);
      // axios.put(`http://localhost:4000/matches/${match.id}`, { ...match, current: false });
      socket.emit('stop_match', null);
    };

    return (
      <Box key={match.id} sx={{ marginBottom: 2, border: '1px solid #ccc', padding: 2, position: "relative" }}>
        <Typography variant="h5" sx={{fontWeight: 'bold'}}>{match.left.id} VS {match.right.id} {isLive ? "MATCH IS LIVE" : ""}</Typography>
        <Typography variant="h6">{match.matchType}</Typography>
        <Typography>Team one: {match.left.id} - Wins: {match.left.wins}</Typography>
        <Typography>Team two: {match.right.id} - Wins: {match.right.wins}</Typography>
        <ToggleButton sx={{color: 'text.primary', bgcolor: `${displayVeto ? 'secondary.main' : 'primary.main'}`}} value={displayVeto} onClick={() => setDisplayVeto((displayVeto) => !displayVeto)}>{displayVeto ? "Hide Vetos" : "Show Veto"}</ToggleButton>
        <Box sx={{display: `${displayVeto ? "block" : "none"}`}}>
          {Object.values(match.vetos).map((veto, index) => (
            <li key={index}>
              <strong>{veto.teamId} {veto.type}</strong> {veto.mapName}, <strong>Side:</strong> {veto.side}
            </li>
          ))}
        </Box>
        <Box sx={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: 'end', top: 0, right: 0, width: "50%", fontSize: "12px", borderRadius: "6px", color: "text.primary" }}>
          <IconButton aria-label="edit" sx={{ color: "text.primary", p: "4px" }} onClick={() => handleEditClick()}>
            <Edit />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => deleteMatch(match.id)} sx={{ color: "text.primary", p: "4px" }}>
            <Delete />
          </IconButton>
          {isLive ? (
            <IconButton aria-label="cancel" onClick={() => handleStopMatch()} sx={{ color: "text.primary", p: "4px" }}>
              <StopCircleIcon />
            </IconButton>
          ) : (
            <IconButton aria-label="confirm" onClick={() => handleStartMatch()} sx={{ color: "text.primary", p: "4px" }}>
              <StartIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    );
  };