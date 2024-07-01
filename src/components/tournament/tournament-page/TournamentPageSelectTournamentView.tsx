import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Typography, useTheme } from '@mui/material';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';
import Tournament from 'types/Tournament';
import SelectTournament from '../SelectTournament';

interface IProps {
  activeLeague?: League | null;
  onTournamentSelected: (tournament?: Tournament) => void;
  onTournamentDeselected: (tournament?: Tournament) => void;
}

const TournamentPageSelectTournamentView: React.FC<IProps> = ({
  activeLeague,
  onTournamentSelected,
  onTournamentDeselected,
}) => {
  const theme = useTheme();
  const selectedTournament = activeLeague?.activeTournament;

  if (!activeLeague) {
    return null;
  }

  if (!selectedTournament) {
    return (
      <FlexContainer
        width="100%"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        gap={8}
      >
        <Typography variant="h4">No tournament selected</Typography>
        <Typography variant="subtitle1" color={theme.palette.text.secondary}>
          {(activeLeague?.tournaments?.length || 0) > 0
            ? 'No tournament is currently selected, please create a new tournament or select existing one.'
            : 'There are currently no tournaments. Please create one before proceeding.'}
        </Typography>
        <SelectTournament onTournamentSelected={onTournamentSelected} />
      </FlexContainer>
    );
  }

  return (
    <FlexContainer flexDirection="column" width="100%" alignItems="stretch">
      <Typography variant="h5">
        Tournament -
        <Typography
          variant="h5Medium"
          display="inline-block"
          variantMapping={{ h4Medium: 'span' }}
        >
          {selectedTournament?.name}
        </Typography>
        <IconButton
          style={{ width: '20px', height: '20px', marginLeft: 'auto' }}
          onClick={() => onTournamentDeselected(undefined)}
        >
          <FontAwesomeIcon
            icon={faRemove}
            width={10}
            color={theme.palette.primary.main}
          />
        </IconButton>
      </Typography>
    </FlexContainer>
  );
};

export default TournamentPageSelectTournamentView;
