import { Typography } from '@mui/material';
import EmptyInboxIcon from 'assets/icons/EmptyInbox';
import FlexContainer from 'components/shared/FlexContainer';
import { useContext, useState } from 'react';
import { TournamentContext } from 'store/TournamentContext';
import TournamentStageTabSwitch from './TournamentStageTabSwitch';
import TournamentTypesPreview from './visualizations/TournamentTypesPreview';

const TournamentBracketsTab: React.FC = () => {
  const { activeTournament, activeLeague } = useContext(TournamentContext);

  const [selectedStageId, setSelectedStageId] = useState<string | undefined>();
  const selectedStage =
    activeTournament?.stages?.find((stage) => stage.id === selectedStageId) ||
    activeTournament?.currentStage;

  if (!activeTournament || !activeLeague) {
    return null;
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
      flexDirection="column"
      width="100%"
      alignItems="flex-start"
      padding="20px 0px 0px 0px"
      gap={16}
      overflowY="auto"
    >
      <TournamentStageTabSwitch
        selectedTournament={activeTournament}
        onStageSelected={(stage) => setSelectedStageId(stage.id)}
      />
      <FlexContainer
        flexDirection="row"
        gap={16}
        height="100%"
        alignItems="flex-start"
      >
        {selectedStage?.groups.map((group, index) => (
          <FlexContainer
            flexDirection="column"
            alignItems="center"
            key={index}
            gap={15}
            flexWrap="wrap"
          >
            <Typography variant="h4">Group {group.groupIndex}</Typography>
            <TournamentTypesPreview group={group} />
          </FlexContainer>
        ))}
      </FlexContainer>
    </FlexContainer>
  );
};

export default TournamentBracketsTab;
