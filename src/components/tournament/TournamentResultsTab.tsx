import { Typography } from '@mui/material';
import EmptyInboxIcon from 'assets/icons/EmptyInbox';
import CustomTabs from 'components/shared/CustomTabs';
import FlexContainer from 'components/shared/FlexContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import { useContext, useMemo, useState } from 'react';
import { TournamentContext } from 'store/TournamentContext';
import TournamentGroup from 'types/TournamentGroup';
import TournamentStage from 'types/TournamentStage';
import { calculateTournamentGroupLeaderboard } from 'utils/tournamentResultUtils';
import TournamentStageTabSwitch from './TournamentStageTabSwitch';

const TournamentResultsTab = () => {
  const { activeTournament } = useContext(TournamentContext);

  const [selectedStage, setSelectedStage] = useState<
    TournamentStage | undefined
  >(activeTournament?.currentStage);

  const [selectedGroup, setSelectedGroup] = useState<
    TournamentGroup | undefined
  >(activeTournament?.currentStage?.groups?.[0]);

  const groupLeaderboard = useMemo(() => {
    if (!selectedGroup) {
      return [];
    }

    return calculateTournamentGroupLeaderboard(
      selectedGroup,
      activeTournament!.settings,
    );
  }, [selectedGroup, activeTournament]);

  if (!activeTournament?.stages?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyInboxIcon width="250px" />

        <Typography variant="h3">
          Tournament has not yet been initialized.
        </Typography>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer
      flexDirection="column"
      gap={8}
      height="100%"
      overflowY="auto"
    >
      <TournamentStageTabSwitch
        selectedTournament={activeTournament}
        onStageSelected={setSelectedStage}
      />
      <CustomTabs
        items={
          selectedStage?.groups?.map((group) => ({
            label: `Group ${group.groupIndex}`,
            value: group.id,
          })) || []
        }
        onTabChanged={(newTabGroupId) => {
          setSelectedGroup(
            selectedStage?.groups.find((group) => group.id === newTabGroupId),
          );
        }}
      />
      <LeaderboardList teams={groupLeaderboard} />
    </FlexContainer>
  );
};

export default TournamentResultsTab;
