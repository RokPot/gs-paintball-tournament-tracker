import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useMemo } from 'react';
import LeaderboardTeam from 'types/LeadeboardTeam';
import League from 'types/League';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';
import TournamentDetailsList from './TournamentDetailsList';

interface IProps {
  activeLeague: League;
}

const TournamentDetails = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;

  const tournamentLeaderboard = useMemo(() => {
    const leadearboard: LeaderboardTeam[] = [];
    calculateTournamentGroupLeaderboard(
      selectedGroup,
      selectedTournament!.settings,
    );
    return leadearboard;
  }, []);

  if (!selectedTournament || !activeLeague) {
    return null;
  }

  return (
    <FlexContainer flexDirection="column">
      <TournamentDetailsList tournament={selectedTournament} />
      <FlexContainer flexDirection="column" width="100%">
        <Typography variant="h5">Tournament leaderboard</Typography>

        <LeaderboardList teams={tournamentLeaderboard} />
      </FlexContainer>
    </FlexContainer>
  );
};

export default TournamentDetails;
