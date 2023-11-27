import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import useLeagueQueries from 'hooks/league/useLeagueQueries';
import useActiveLeague from 'services/queries/league/useActiveLeague';
import useLeaguesList from 'services/queries/league/useLeaguesList';
import League from 'types/League';

interface IProps {
  onLeagueSelected: (league?: League) => void;
}

const SelectLeague = ({ onLeagueSelected }: IProps) => {
  const { setSelectedLeague } = useLeagueQueries();
  const { leaguesList } = useLeaguesList();
  const { activeLeague } = useActiveLeague();
  const setSelectedLeagueInternal = async (e: SelectChangeEvent<League>) => {
    const newSelectedLeague = leaguesList?.find(
      (league) => league.id === e.target.value,
    );
    if (!newSelectedLeague) {
      return;
    }

    await setSelectedLeague(newSelectedLeague, activeLeague);
    onLeagueSelected(newSelectedLeague);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">League</InputLabel>
      <Select
        value={activeLeague || ''}
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
};

export default SelectLeague;
