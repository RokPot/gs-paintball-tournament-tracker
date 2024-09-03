import { Typography } from '@mui/material';
import EmptyInboxIcon from 'assets/icons/EmptyInbox';
import FlexContainer from 'components/shared/FlexContainer';
import { useContext, useState } from 'react';
import { TournamentContext } from 'store/TournamentContext';
import TournamentStage from 'types/TournamentStage';
import TournamentGroupCard from './TournamentGroupCard';
import TournamentStageTabSwitch from './TournamentStageTabSwitch';

interface IProps {}

const TournamentGroupsTab: React.FC<IProps> = () => {
  const { activeTournament } = useContext(TournamentContext);

  const [selectedStage, setSelectedStage] = useState<
    TournamentStage | undefined
  >(activeTournament?.currentStage);

  if (!activeTournament) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyInboxIcon width="250px" />

        <Typography variant="h3">No active tournament.</Typography>
      </FlexContainer>
    );
  }

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
      flexDirection="row"
      gap={16}
      flexWrap="wrap"
      alignItems="stretch"
      overflowY="auto"
    >
      <TournamentStageTabSwitch
        selectedTournament={activeTournament}
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
