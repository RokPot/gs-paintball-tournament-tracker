import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Typography, useTheme } from '@mui/material';
import SelectLeague from 'components/leagues/SelectLeague';
import FlexContainer from 'components/shared/FlexContainer';
import League from 'types/League';

interface IProps {
  activeLeague?: League | null;
  onLeagueSelected: (league?: League) => void;
  onLeagueDeselected: (league: League) => void;
}

const TournamentPageSelectLeagueView: React.FC<IProps> = ({
  activeLeague,
  onLeagueSelected,
  onLeagueDeselected,
}) => {
  const theme = useTheme();

  if (!activeLeague) {
    return (
      <FlexContainer
        width="100%"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        gap={8}
      >
        <Typography variant="h4">No league selected</Typography>
        <Typography variant="subtitle1" color={theme.palette.text.secondary}>
          No league is currently selected, please create a new league or select
          an existing one.
        </Typography>
        <SelectLeague onLeagueSelected={onLeagueSelected} />
      </FlexContainer>
    );
  }

  return (
    <FlexContainer width="100%" justifyContent="space-between">
      <Typography variant="h4">
        League -
        <Typography
          variant="h4Medium"
          display="inline-block"
          variantMapping={{ h4Medium: 'span' }}
        >
          {activeLeague?.name}
        </Typography>
        <IconButton
          style={{ width: '20px', height: '20px', marginLeft: 'auto' }}
          onClick={() => onLeagueDeselected(activeLeague)}
        >
          <FontAwesomeIcon
            icon={faRemove}
            width={10}
            color={theme.palette.primary.main}
          />
        </IconButton>
      </Typography>
      {/* <FlexContainer gap={8}>
        {!!selectedTournament &&
          [TournamentStatus.created].includes(
            selectedTournament.state.status,
          ) && (
            <Button variant="contained" onClick={generateTournament}>
              <Typography variant="p1">
                <FontAwesomeIcon icon={faRightLong} />
                Initialize Tournament
                <FontAwesomeIcon icon={faLeftLong} />
              </Typography>
            </Button>
          )}

        <CustomDropdownMenu
          icon={faEllipsisVertical}
          actions={[
            {
              label: 'Edit tournament',
              icon: faEdit,
              onClick: () =>
                setAddOrEditTournamentModalProps({
                  isOpen: true,
                  tournament: selectedTournament,
                }),
              visible: !!selectedTournament,
            },
            {
              label: 'Add new tournament',
              icon: faPlus,
              onClick: () => setAddOrEditTournamentModalProps({ isOpen: true }),
              visible: true,
            },
          ]}
        />
      </FlexContainer> */}
    </FlexContainer>
  );
};

export default TournamentPageSelectLeagueView;
