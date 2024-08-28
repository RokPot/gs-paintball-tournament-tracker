import { Typography } from '@mui/material';
import EmptyInboxIcon from 'assets/icons/EmptyInbox';
import FlexContainer from 'components/shared/FlexContainer';
import { useState } from 'react';
import League from 'types/League';
import TournamentStage from 'types/TournamentStage';
import TournamentStageTabSwitch from './TournamentStageTabSwitch';
import TournamentTypesPreview from './visualizations/TournamentTypesPreview';

interface IProps {
  activeLeague: League;
}

const TournamentBracketsTab: React.FC<IProps> = ({ activeLeague }) => {
  const selectedTournament = activeLeague?.activeTournament;

  const [selectedStage, setSelectedStage] = useState<
    TournamentStage | undefined
  >(selectedTournament?.currentStage);

  if (!selectedTournament || !activeLeague) {
    return null;
  }

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
      flexDirection="column"
      width="100%"
      alignItems="flex-start"
      padding="20px 0px 0px 0px"
      gap={16}
      overflowY="auto"
    >
      <TournamentStageTabSwitch
        selectedTournament={selectedTournament}
        onStageSelected={setSelectedStage}
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
