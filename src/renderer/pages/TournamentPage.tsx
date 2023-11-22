import {
  faEdit,
  faEllipsisVertical,
  faPlus,
  faRemove,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconButton,
  Typography,
  alpha,
  css,
  styled,
  useTheme,
} from '@mui/material';
import SelectLeague from 'components/leagues/SelectLeague';
import CustomDropdownMenu from 'components/shared/CustomDropdownMenu';
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import PageContainer from 'components/shared/PageContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import TeamsShortList from 'components/teams/TeamShortList';
import AddOrEditTournament from 'components/tournament/AddOrEditTournament';
import SelectTournament from 'components/tournament/SelectTournament';
import TournamentDetailsList from 'components/tournament/TournamentDetailsList';
import { useCallback, useEffect, useState } from 'react';
import useLeagueQueries from 'services/queries/LeagueQueries';
import useTournamentQueries from 'services/queries/TournamentQueries';
import Tournament from 'types/Tournament';
import { TournamentStage } from 'types/TournamentStage';

const StyledLoadingContainer = styled('div')(
  (props) => css`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    padding: 16px 16px;
    overflow: auto;
    z-index: 12;
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    background: ${alpha(props.theme.palette.grey[200], 0.7)};
    transition: all 0.5s ease-in;
  `,
);

function TournamentPage() {
  const {
    isLoading,
    selectedLeague,
    setSelectedLeague,
    updateExistingLeague,
    invalidateSelectedLeague,
  } = useLeagueQueries();
  const { addNewTournamentToLeague } = useTournamentQueries();
  const [
    allowAutomaticTournamentAssignment,
    setAllowAutomaticTournamentAssignment,
  ] = useState(true);
  const [addOrEditTournamentModalProps, setAddOrEditTournamentModalProps] =
    useState<{ isOpen: boolean; tournament?: Tournament }>({ isOpen: false });

  const theme = useTheme();
  const selectedTournament = selectedLeague?.activeTournament;
  const setSelectedTournament = useCallback(
    async (tournament?: Tournament) => {
      if (!selectedLeague) {
        return;
      }
      const updatedLeague = selectedLeague;
      updatedLeague.activeTournament = tournament || undefined;
      await updateExistingLeague(updatedLeague);

      await invalidateSelectedLeague();
    },
    [invalidateSelectedLeague, selectedLeague, updateExistingLeague],
  );

  const addNewTournamentInternal = async (tournament: Tournament) => {
    if (!selectedLeague) {
      return;
    }
    await addNewTournamentToLeague(tournament, selectedLeague);
    setAllowAutomaticTournamentAssignment(true);
    setAddOrEditTournamentModalProps({ isOpen: false });
  };

  useEffect(() => {
    if (
      !selectedLeague ||
      selectedLeague.activeTournament ||
      !allowAutomaticTournamentAssignment
    ) {
      if (selectedLeague?.activeTournament) {
        setAllowAutomaticTournamentAssignment(false);
      }
      return;
    }

    const unfinishedLeagueTournaments = selectedLeague.tournaments.filter(
      (tournament) => tournament.state.stage !== TournamentStage.finished,
    );

    if (unfinishedLeagueTournaments?.length > 0) {
      const inProgressTournament = selectedLeague.tournaments.find(
        (tournament) => tournament.state.stage === TournamentStage.inProgress,
      );
      if (inProgressTournament) {
        setSelectedTournament(inProgressTournament);
      }

      const initializedTournament = selectedLeague.tournaments.find(
        (tournament) => tournament.state.stage === TournamentStage.initialized,
      );
      if (initializedTournament) {
        setSelectedTournament(initializedTournament);
      }
      const createdTournament = selectedLeague.tournaments.find(
        (tournament) => tournament.state.stage === TournamentStage.created,
      );
      if (createdTournament) {
        setSelectedTournament(createdTournament);
      }
    }
    setAllowAutomaticTournamentAssignment(false);
  }, [
    allowAutomaticTournamentAssignment,
    selectedLeague,
    setSelectedTournament,
  ]);

  return (
    <PageContainer>
      {isLoading && (
        <StyledLoadingContainer>
          <LoadingIndicator height="100%" />
        </StyledLoadingContainer>
      )}
      {selectedLeague ? (
        <FlexContainer width="100%" justifyContent="space-between">
          <Typography variant="h4">
            League -
            <Typography variant="h4Medium" display="inline-block">
              {selectedLeague.name}
            </Typography>
            <IconButton
              style={{ width: '20px', height: '20px', marginLeft: 'auto' }}
              onClick={() => setSelectedLeague(null, selectedLeague)}
            >
              <FontAwesomeIcon
                icon={faRemove}
                width={10}
                color={theme.palette.primary.main}
              />
            </IconButton>
          </Typography>
          <CustomDropdownMenu
            icon={faEllipsisVertical}
            actions={[
              {
                label: 'Edit tournament',
                icon: faEdit,
                onClick: () =>
                  setAddOrEditTournamentModalProps({
                    isOpen: false,
                    tournament: selectedTournament,
                  }),
                visible: !!selectedTournament,
              },
              {
                label: 'Add new tournament',
                icon: faPlus,
                onClick: () =>
                  setAddOrEditTournamentModalProps({ isOpen: false }),
                visible: true,
              },
            ]}
          />
        </FlexContainer>
      ) : (
        <Typography variant="h4">No league selected</Typography>
      )}

      {!selectedLeague && (
        <FlexContainer
          width="100%"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          margin={8}
        >
          <Typography variant="subtitle1" color={theme.palette.text.secondary}>
            No league is currently selected, please create a new league or
            select an existing one.
          </Typography>
          <SelectLeague
            onLeagueSelected={() => setAllowAutomaticTournamentAssignment(true)}
          />
        </FlexContainer>
      )}

      {selectedLeague && (
        <>
          <Typography variant="h5">
            {selectedTournament ? (
              <>
                Tournament -
                <Typography variant="h5Medium" display="inline-block">
                  {selectedTournament?.name}
                </Typography>
              </>
            ) : (
              'No tournament selected'
            )}
            {selectedTournament && (
              <IconButton
                style={{ width: '20px', height: '20px', marginLeft: 'auto' }}
                onClick={() => setSelectedTournament(undefined)}
              >
                <FontAwesomeIcon
                  icon={faRemove}
                  width={10}
                  color={theme.palette.primary.main}
                />
              </IconButton>
            )}
          </Typography>
          {!selectedTournament && (
            <FlexContainer
              width="100%"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              margin={8}
            >
              <Typography
                variant="subtitle1"
                color={theme.palette.text.secondary}
              >
                {selectedLeague?.tournaments.length > 0
                  ? 'No tournament is currently selected, please create a new tournament or select existing one.'
                  : 'There are currently no tournaments. Please create one before proceeding.'}
              </Typography>
              <SelectTournament onTournamentSelected={setSelectedTournament} />
            </FlexContainer>
          )}
          {selectedTournament && (
            <>
              <Typography variant="h5">Tournament details</Typography>
              <TournamentDetailsList tournament={selectedTournament} />
              <Typography variant="h5">Participating teams</Typography>
              <TeamsShortList teams={selectedTournament.teams} />
              <Typography variant="h5">Tournament leaderboard</Typography>

              <LeaderboardList teams={selectedTournament.leaderboard} />
            </>
          )}
        </>
      )}

      <CustomModal
        isModalOpen={addOrEditTournamentModalProps?.isOpen}
        onClose={() => {
          setAddOrEditTournamentModalProps({ isOpen: false });
        }}
        width={700}
      >
        <AddOrEditTournament
          league={selectedLeague!}
          tournament={addOrEditTournamentModalProps.tournament}
          onAccept={addNewTournamentInternal}
          onCancel={() => setAddOrEditTournamentModalProps({ isOpen: false })}
        />
      </CustomModal>
    </PageContainer>
  );
}

export default TournamentPage;
