import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useMemo } from 'react';
import League from 'types/League';
import { calculateTournamentLeaderboard } from 'utils/tournamentResultUtils';
import TournamentDetailsList from './TournamentDetailsList';

interface IProps {
  activeLeague: League;
}

const TournamentDetailsTab = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;

  const tournamentLeaderboard = useMemo(() => {
    return calculateTournamentLeaderboard(selectedTournament);
  }, [selectedTournament]);

  if (!selectedTournament || !activeLeague) {
    return null;
  }

  return (
    <FlexContainer flexDirection="column" style={{ flexGrow: 1 }}>
      <TournamentDetailsList tournament={selectedTournament} />

      <Typography variant="h5">Tournament leaderboard</Typography>

      <LeaderboardList teams={tournamentLeaderboard} />
    </FlexContainer>
  );
};

export default TournamentDetailsTab;
