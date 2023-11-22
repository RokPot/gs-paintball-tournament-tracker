import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import useLeagueQueries from 'services/queries/LeagueQueries';
import League from 'types/League';

interface IProps {
  onLeagueSelected: (league?: League) => void;
}

function SelectLeague({ onLeagueSelected }: IProps) {
  const { selectedLeague, setSelectedLeague, leaguesList } = useLeagueQueries();

  const setSelectedLeagueInternal = async (e: SelectChangeEvent<League>) => {
    const newSelectedLeague = leaguesList?.find(
      (league) => league.id === e.target.value,
    );
    if (!newSelectedLeague) {
      return;
    }

    await setSelectedLeague(newSelectedLeague, selectedLeague);
    onLeagueSelected(newSelectedLeague);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">League</InputLabel>
      <Select
        value={selectedLeague || ''}
        label="League"
        onChange={(e) => setSelectedLeagueInternal(e)}
      >
        {leaguesList?.map((league, index) => (
          <MenuItem key={index} value={league.id}>
            {league.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectLeague;
