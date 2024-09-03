import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useContext, useMemo } from 'react';
import { TournamentContext } from 'store/TournamentContext';
import { calculateTournamentLeaderboard } from 'utils/tournamentResultUtils';
import TournamentDetailsList from './TournamentDetailsList';

const TournamentDetailsTab = () => {
  const { activeTournament, activeLeague } = useContext(TournamentContext);

  const tournamentLeaderboard = useMemo(() => {
    return calculateTournamentLeaderboard(activeTournament);
  }, [activeTournament]);

  if (!activeTournament || !activeLeague) {
    return null;
  }

  return (
    <FlexContainer
      flexDirection="column"
      style={{ flexGrow: 1 }}
      overflowY="auto"
    >
      <TournamentDetailsList tournament={activeTournament} />

      <Typography variant="h5">Tournament leaderboard</Typography>

      <LeaderboardList teams={tournamentLeaderboard} />
    </FlexContainer>
  );
};

export default TournamentDetailsTab;
