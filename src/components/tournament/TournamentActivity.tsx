import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';
import { ReactComponent as EmptyState } from '../../../assets/icons/EmptyInbox.svg';

interface IProps {
  activeLeague: League;
}

const TournamentActivity = ({ activeLeague }: IProps) => {
  const selectedTournament = activeLeague?.activeTournament;
  console.log(selectedTournament);
  if (!selectedTournament?.stages?.length) {
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
    <FlexContainer flexDirection="column" gap={8}>
      <FlexContainer flexDirection="row" gap={8}>
        21/01/2024 10:26 --- Game 1 (team 1 vs Team 2) - Team 1 won / lost ---
        DRAFT - time: 05:11
      </FlexContainer>
    </FlexContainer>
  );
};

export default TournamentActivity;
