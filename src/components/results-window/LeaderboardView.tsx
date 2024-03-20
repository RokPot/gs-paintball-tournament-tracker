import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useEffect, useState } from 'react';
import LeaderboardTeam from 'types/LeadeboardTeam';
import League from 'types/League';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';

interface IProps {
  activeLeague?: League;
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
    setLeaderboardTeam(
      calculateTournamentGroupLeaderboard(
        activeTournament.currentStageGroups?.[0],
        activeTournament.settings,
      ),
    );
  }, [activeTournament]);
  return (
    <FlexContainer width="100%" height="100%">
      <LeaderboardList showHeader hideFooter teams={leaderboardTeam} />
    </FlexContainer>
  );
};

export default LeaderboardView;
