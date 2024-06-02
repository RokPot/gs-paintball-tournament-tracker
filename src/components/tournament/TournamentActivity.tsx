import { Typography } from '@mui/material';
import EmptyInboxIcon from 'assets/icons/EmptyInbox';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';

interface IProps {
  activeLeague: League;
}

const TournamentActivity = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;
  if (!selectedTournament?.stages?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyInboxIcon fill="transparent" width="250px" />
        <Typography variant="h3">
          Tournament has not yet been initialized.
        </Typography>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer flexDirection="column" gap={8}>
      <FlexContainer flexDirection="row" gap={8}>
        21/01/2024 10:26 --- Game 1 (team 1 vs Team 2) - Team 1 won / lost ---
        DRAFT - time: 05:11
      </FlexContainer>
    </FlexContainer>
  );
};

export default TournamentActivity;
