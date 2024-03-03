import { Typography } from '@mui/material';
import CustomTabs from 'components/shared/CustomTabs';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useEffect, useState } from 'react';
import LeaderboardTeam from 'types/LeadeboardTeam';
import League from 'types/League';
import TournamentGroup from 'types/TournamentGroup';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';
import { ReactComponent as EmptyState } from '../../../assets/icons/EmptyInbox.svg';

interface IProps {
  activeLeague: League;
}

const TournamentResults = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;

  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([]);

  const calculateLeaderboard = (group: TournamentGroup) => {
    const newLeaderboard = calculateTournamentGroupLeaderboard(
      group,
      selectedTournament!.settings,
    );

    setLeaderboard(newLeaderboard);
  };

  useEffect(() => {
    if (!selectedTournament?.groups?.length) {
      return;
    }
    calculateLeaderboard(selectedTournament?.groups?.[0]!);
  }, []);

  if (!selectedTournament?.groups?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyState />
        <Typography variant="h3">
          Tournament has not yet been initialized.
        </Typography>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer flexDirection="column" gap={8} height="100%">
      <CustomTabs
        items={selectedTournament.groups.map((group) => ({
          label: `Group ${group.groupIndex}`,
          value: group.id,
        }))}
        onTabChanged={(newTabGroupId) => {
          calculateLeaderboard(
            selectedTournament.groups.find(
              (group) => group.id === newTabGroupId,
            )!,
          );
        }}
      />
      <LeaderboardList teams={leaderboard} />
    </FlexContainer>
  );
};

export default TournamentResults;
