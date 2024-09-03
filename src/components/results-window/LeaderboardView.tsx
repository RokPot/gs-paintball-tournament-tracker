import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useEffect, useState } from 'react';
import LeaderboardTeam from 'types/LeadeboardTeam';
import League from 'types/League';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';

interface IProps {
  activeLeague: League | undefined | null;
}

const LeaderboardView: React.FC<IProps> = ({ activeLeague }) => {
  const [groupedLeaderBoardTeams, setGroupedLeaderBoardTeams] = useState<
    LeaderboardTeam[][]
  >([]);
  const activeTournament = activeLeague?.activeTournament;
  useEffect(() => {
    if (!activeTournament || !activeTournament.stages?.length) {
      return;
    }

    if (!activeTournament.currentStageGroups) {
      return;
    }
    const newGroupedLeaderboardTeams: LeaderboardTeam[][] = [];
    activeTournament.currentStageGroups.forEach((group) => {
      newGroupedLeaderboardTeams.push(
        calculateTournamentGroupLeaderboard(group, activeTournament.settings),
      );
    });
    setGroupedLeaderBoardTeams(newGroupedLeaderboardTeams);
  }, [activeTournament]);
  return (
    <FlexContainer width="100%" height="100%" flexDirection="column">
      {groupedLeaderBoardTeams?.map((groupedLeaderBoardTeam) => (
        <LeaderboardList
          showHeader
          hideFooter
          teams={groupedLeaderBoardTeam}
          showAllTeamsAtOnce
        />
      ))}
    </FlexContainer>
  );
};

export default LeaderboardView;
