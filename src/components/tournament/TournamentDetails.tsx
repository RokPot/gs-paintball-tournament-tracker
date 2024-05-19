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
    if (
      selectedTournament?.settings.secondStageType &&
      selectedTournament?.state.stage > 1
    ) {
      const firstStage = selectedTournament?.stages?.find(
        (stage) => stage.stage === 1,
      );
      const firstStageGroupsLeaderboard: LeaderboardTeam[] = [];
      firstStage?.groups?.forEach((group) => {
        firstStageGroupsLeaderboard.push(
          ...calculateTournamentGroupLeaderboard(
            group,
            selectedTournament!.settings,
          ),
        );
      });
      const secondStage = selectedTournament?.currentStageGroups;
    }
    if (!selectedTournament?.currentStageGroups?.[0]) {
      return [];
    }
    return calculateTournamentGroupLeaderboard(
      selectedTournament?.currentStageGroups?.[0]!,
      selectedTournament!.settings,
    );
  }, []);

  if (!selectedTournament || !activeLeague) {
    return null;
  }

  return (
    <FlexContainer flexDirection="column">
      <TournamentDetailsList tournament={selectedTournament} />

      <Typography variant="h5">Tournament leaderboard</Typography>

      <LeaderboardList teams={tournamentLeaderboard} />
    </FlexContainer>
  );
};

export default TournamentDetails;
