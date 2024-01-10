import { Typography } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';
import { ReactComponent as EmptyState } from '../../../assets/icons/EmptyInbox.svg';
import TournamentGroupCard from './TournamentGroupCard';

interface IProps {
  activeLeague: League;
}

const TournamentGroups: React.FC<IProps> = ({ activeLeague }) => {
  const selectedTournament = activeLeague?.activeTournament;

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
    <FlexContainer
      flexDirection="row"
      gap={16}
      flexWrap="wrap"
      alignItems="stretch"
    >
      {selectedTournament.groups
        .sort((a, b) => a.groupIndex - b.groupIndex)
        .map((group, index) => (
          <TournamentGroupCard key={index} group={group} />
        ))}
    </FlexContainer>
  );
};

export default TournamentGroups;
