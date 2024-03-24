import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import Tournament from 'types/Tournament';

interface IProps {
  onTournamentSelected: (tournament: Tournament) => void;
}

const SelectTournament = ({ onTournamentSelected }: IProps) => {
  const { data: activeLeague } = LeagueQueries.useActiveLeague();
  const selectedTournament = activeLeague?.activeTournament;
  const leagueTournaments = activeLeague?.tournaments;

  const setSelectedTournamentInternal = async (
    e: SelectChangeEvent<Tournament>,
  ) => {
    const newSelectedTournament = leagueTournaments?.find(
      (tournament) => tournament.id === e.target.value,
    );
    if (!newSelectedTournament) {
      return;
    }
    onTournamentSelected(newSelectedTournament);
  };

  if (!leagueTournaments?.length) {
    return null;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Tournament</InputLabel>
      <Select
        value={selectedTournament || ''}
        label="Tournament"
        onChange={(e) => setSelectedTournamentInternal(e)}
      >
        {leagueTournaments?.map((tournament, index) => (
          <MenuItem key={index} value={tournament.id}>
            {tournament.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectTournament;
