import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';
import EmptyState from '../../../assets/icons/EmptyInbox.svg';
import TournamentGroupCard from './TournamentGroupCard';

interface IProps {
  activeLeague: League;
}

const TournamentGroups: React.FC<IProps> = ({ activeLeague }) => {
  const selectedTournament = activeLeague?.activeTournament;

  if (!selectedTournament?.stages?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <img src={EmptyState} alt="empty" />
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
    >
      {selectedTournament?.currentStage?.groups
        .sort((a, b) => a.groupIndex - b.groupIndex)
        .map((group, index) => (
          <TournamentGroupCard key={index} group={group} />
        ))}
    </FlexContainer>
  );
};

export default TournamentGroups;
