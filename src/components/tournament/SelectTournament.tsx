import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import useLeagueQueries from 'services/queries/LeagueQueries';
import useTournamentStore from 'store/TournamentStore';
import { Tournament } from 'types/Tournament';

interface IProps {}

const SelectTournament: React.FC<IProps> = ({}) => {
  const { selectedLeague, setSelectedLeague, leaguesList } = useLeagueQueries();
  const { selectedTournament, setSelectedTournament } = useTournamentStore();

  const leagueTournaments = selectedLeague?.tournaments;

  const setSelectedTournamentInternal = async (
    e: SelectChangeEvent<Tournament>
  ) => {
    const newSelectedTournament = leagueTournaments?.find(
      (tournament) => tournament.id === e.target.value
    );
    if (!newSelectedTournament) {
      return;
    }
    await setSelectedTournament(newSelectedTournament);
  };

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
