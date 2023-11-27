import {
  faEdit,
  faEllipsisVertical,
  faLeftLong,
  faPlus,
  faRemove,
  faRightLong,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
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
import CustomTabs from 'components/shared/CustomTabs';
import FlexContainer from 'components/shared/FlexContainer';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import PageContainer from 'components/shared/PageContainer';
import LeaderboardList from 'components/teams/LeaderboardList';
import TeamsShortList from 'components/teams/TeamShortList';
import AddOrEditTournament from 'components/tournament/AddOrEditTournament';
import InitializeTournament from 'components/tournament/InitializeTournament';
import SelectTournament from 'components/tournament/SelectTournament';
import TournamentDetailsList from 'components/tournament/TournamentDetailsList';
import useLeagueQueries from 'hooks/league/useLeagueQueries';
import useTournamentQueries from 'hooks/tournament/useTournamentQueries';
import { useCallback, useEffect, useState } from 'react';
import useActiveLeague from 'services/queries/league/useActiveLeague';
import useLeagueInvalidations from 'services/queries/league/useLeagueInvalidations';
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
const TournamentPage = () => {
  const { setSelectedLeague, setSelectedLeagueTournament } = useLeagueQueries();
  const { activeLeague, isFetchingActiveLeague } = useActiveLeague();
  const { addOrEditTournament } = useTournamentQueries();
  const { invalidateSelectedLeague } = useLeagueInvalidations();
  const [
    allowAutomaticTournamentAssignment,
    setAllowAutomaticTournamentAssignment,
  ] = useState(true);
  const [addOrEditTournamentModalProps, setAddOrEditTournamentModalProps] =
    useState<{ isOpen: boolean; tournament?: Tournament }>({ isOpen: false });
  const [isInitializeTournamentModalOpen, setIsInitializeTournamentModalOpen] =
    useState(false);

  const theme = useTheme();
  const selectedTournament = activeLeague?.activeTournament;
  const setSelectedTournament = useCallback(
    async (tournament?: Tournament) => {
      await setSelectedLeagueTournament(tournament, activeLeague);
    },
    [activeLeague, setSelectedLeagueTournament],
  );

  const addNewTournamentInternal = async (
    tournament: Tournament,
    isEdit: boolean,
  ) => {
    await addOrEditTournament(tournament, activeLeague, isEdit);
    await invalidateSelectedLeague();
    // if (!activeLeague) {
    //   return;
    // }
    // if (!isEdit) {
    //   await addNewTournamentToLeague(tournament, activeLeague);
    //   setAllowAutomaticTournamentAssignment(true);
    // } else {
    //   await updateTournament(tournament);
    // }
    setAddOrEditTournamentModalProps({ isOpen: false });
  };

  useEffect(() => {
    if (
      !activeLeague ||
      activeLeague?.activeTournament ||
      !allowAutomaticTournamentAssignment
    ) {
      if (activeLeague?.activeTournament) {
        setAllowAutomaticTournamentAssignment(false);
      }
      return;
    }

    const unfinishedLeagueTournaments = activeLeague?.tournaments.filter(
      (tournament) => tournament.state.stage !== TournamentStage.finished,
    );

    if (unfinishedLeagueTournaments?.length > 0) {
      const inProgressTournament = activeLeague?.tournaments.find(
        (tournament) => tournament.state.stage === TournamentStage.inProgress,
      );

      if (inProgressTournament) {
        setSelectedTournament(inProgressTournament);
      }
    }
    setAllowAutomaticTournamentAssignment(false);
  }, [allowAutomaticTournamentAssignment, activeLeague, setSelectedTournament]);

  const generateTournament = useCallback(() => {
    setIsInitializeTournamentModalOpen(true);
  }, []);

  return (
    <PageContainer>
      {isFetchingActiveLeague && (
        <StyledLoadingContainer>
          <LoadingIndicator height="100%" />
        </StyledLoadingContainer>
      )}
      {activeLeague ? (
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
              onClick={() => setSelectedLeague(null, activeLeague)}
            >
              <FontAwesomeIcon
                icon={faRemove}
                width={10}
                color={theme.palette.primary.main}
              />
            </IconButton>
          </Typography>
          <FlexContainer margin={8}>
            {!!selectedTournament &&
              [TournamentStage.created].includes(
                selectedTournament.state.stage,
              ) && (
                <Button variant="contained" onClick={generateTournament}>
                  <Typography variant="p1">
                    <FontAwesomeIcon icon={faRightLong} />
                    Begin Tournament
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
                  onClick: () =>
                    setAddOrEditTournamentModalProps({ isOpen: true }),
                  visible: true,
                },
              ]}
            />
          </FlexContainer>
        </FlexContainer>
      ) : (
        <Typography variant="h4">No league selected</Typography>
      )}

      {!activeLeague && (
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

      {activeLeague && (
        <>
          <Typography variant="h5">
            {selectedTournament ? (
              <>
                Tournament -
                <Typography
                  variant="h5Medium"
                  display="inline-block"
                  variantMapping={{ h5Medium: 'span' }}
                >
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
                {activeLeague?.tournaments.length > 0
                  ? 'No tournament is currently selected, please create a new tournament or select existing one.'
                  : 'There are currently no tournaments. Please create one before proceeding.'}
              </Typography>
              <SelectTournament onTournamentSelected={setSelectedTournament} />
            </FlexContainer>
          )}
          {selectedTournament && (
            <>
              <CustomTabs />
              <Typography variant="h5">Tournament details</Typography>

              <TournamentDetailsList tournament={selectedTournament} />
              <FlexContainer flexDirection="row">
                <FlexContainer
                  flexDirection="column"
                  width="100%"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  height="100%"
                >
                  <Typography variant="h5">Participating teams</Typography>
                  <TeamsShortList teams={selectedTournament.teams} />
                </FlexContainer>
                <FlexContainer
                  flexDirection="column"
                  width="100%"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  height="100%"
                >
                  <Typography variant="h5">Tournament leaderboard</Typography>

                  <LeaderboardList teams={selectedTournament.leaderboard} />
                </FlexContainer>
              </FlexContainer>
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
          league={activeLeague!}
          tournament={addOrEditTournamentModalProps.tournament}
          onAccept={addNewTournamentInternal}
          onCancel={() => setAddOrEditTournamentModalProps({ isOpen: false })}
        />
      </CustomModal>
      <CustomModal
        isModalOpen={isInitializeTournamentModalOpen}
        fullScreen
        onClose={() => setIsInitializeTournamentModalOpen(false)}
      >
        <InitializeTournament tournament={selectedTournament!} />
      </CustomModal>
    </PageContainer>
  );
};

export default TournamentPage;
