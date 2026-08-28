import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import useLeagueFlows from 'hooks/league/useLeagueFlows';
import { useContext } from 'react';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import { TournamentContext } from 'store/TournamentContext';
import League from 'types/League';

interface IProps {
  onLeagueSelected: (league?: League) => void;
}

const SelectLeague = ({ onLeagueSelected }: IProps) => {
  const { setSelectedLeague } = useLeagueFlows();
  const { data: leaguesList } = LeagueQueries.useLeaguesList();
  const { activeLeague } = useContext(TournamentContext);
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
