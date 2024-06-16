import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useEffect, useState } from 'react';
import LeaderboardTeam from 'types/LeadeboardTeam';
import League from 'types/League';
import { calculateTournamentLeaderboard } from 'utils/tournamentResultUtils';

interface IProps {
  activeLeague: League | undefined | null;
}

const LeaderboardView: React.FC<IProps> = ({ activeLeague }) => {
  const [leaderboardTeam, setLeaderboardTeam] = useState<LeaderboardTeam[]>([]);
  const activeTournament = activeLeague?.activeTournament;
  useEffect(() => {
    if (!activeTournament || !activeTournament.stages?.length) {
      return;
    }

    if (!activeTournament.currentStageGroups) {
      return;
    }
    setLeaderboardTeam(calculateTournamentLeaderboard(activeTournament));
  }, [activeTournament]);
  return (
    <FlexContainer width="100%" height="100%">
      <LeaderboardList
        showHeader
        hideFooter
        teams={leaderboardTeam}
        showAllTeamsAtOnce
      />
    </FlexContainer>
  );
};

export default LeaderboardView;
