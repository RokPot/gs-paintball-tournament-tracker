import { Typography } from '@mui/material';
import EmptyInboxIcon from 'assets/icons/EmptyInbox';
import FlexContainer from 'components/shared/FlexContainer';
import { useState } from 'react';
import League from 'types/League';
import TournamentStage from 'types/TournamentStage';
import TournamentGroupCard from './TournamentGroupCard';
import TournamentStageTabSwitch from './TournamentStageTabSwitch';

interface IProps {
  activeLeague: League;
}

const TournamentGroupsTab: React.FC<IProps> = ({ activeLeague }) => {
  const selectedTournament = activeLeague?.activeTournament;
  const [selectedStage, setSelectedStage] = useState<
    TournamentStage | undefined
  >(selectedTournament?.currentStage);
  if (!selectedTournament?.stages?.length) {
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
      flexDirection="row"
      gap={16}
      flexWrap="wrap"
      alignItems="stretch"
      overflowY="auto"
    >
      <TournamentStageTabSwitch
        selectedTournament={selectedTournament}
        onStageSelected={setSelectedStage}
      />
      {selectedStage?.groups
        .sort((a, b) => a.groupIndex - b.groupIndex)
        .map((group, index) => (
          <TournamentGroupCard key={index} group={group} />
        ))}
    </FlexContainer>
  );
};

export default TournamentGroupsTab;
