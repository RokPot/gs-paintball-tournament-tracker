import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useEffect, useState } from 'react';
import useActiveLeague from 'services/queries/league/useActiveLeague';
import LeaderboardTeam from 'types/LeadeboardTeam';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';

interface IProps {}

const LeaderboardView: React.FC<IProps> = () => {
  const { activeLeague, isFetchingActiveLeague } = useActiveLeague();
  const [leaderboardTeam, setLeaderboardTeam] = useState<LeaderboardTeam[]>([]);
  const activeTournament = activeLeague?.activeTournament;
  useEffect(() => {
    if (
      isFetchingActiveLeague ||
      !activeTournament ||
      !activeTournament.groups?.length
    ) {
      return;
    }

    setLeaderboardTeam(
      calculateTournamentGroupLeaderboard(
        activeTournament.groups[0],
        activeTournament.settings,
      ),
    );
  }, [activeTournament, isFetchingActiveLeague]);
  return (
    <FlexContainer loading={isFetchingActiveLeague} width="100%">
      <LeaderboardList showHeader teams={leaderboardTeam} />
    </FlexContainer>
  );
};

export default LeaderboardView;
