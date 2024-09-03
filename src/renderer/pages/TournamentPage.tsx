import {
  faEdit,
  faEllipsisVertical,
  faLeftLong,
  faPlus,
  faRightLong,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Typography, alpha, css, styled } from '@mui/material';
import CustomDropdownMenu from 'components/shared/CustomDropdownMenu';
import CustomModal from 'components/shared/CustomModal';
import CustomTabs from 'components/shared/CustomTabs';
import FlexContainer from 'components/shared/FlexContainer';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import PageContainer from 'components/shared/PageContainer';
import AddOrEditTournament from 'components/tournament/AddOrEditTournament';
import InitializeTournament from 'components/tournament/InitializeTournament';
import TournamentActivityTab from 'components/tournament/TournamentActivityTab';
import TournamentBracketsTab from 'components/tournament/TournamentBracketsTab';
import TournamentButtonsTab from 'components/tournament/TournamentButtonsTab';
import TournamentDetailsTab from 'components/tournament/TournamentDetailsTab';
import TournamentGroupsTab from 'components/tournament/TournamentGroupsTab';
import TournamentResultsTab from 'components/tournament/TournamentResultsTab';

import TournamentScheduleTab from 'components/tournament/TournamentScheduleTab';
import TournamentPageSelectLeagueView from 'components/tournament/tournament-page/TournamentPageSelectLeagueView';
import TournamentPageSelectTournamentView from 'components/tournament/tournament-page/TournamentPageSelectTournamentView';
import ScheduleUpcomingGames from 'components/tournament/visualizations/schedule/ScheduleUpcomingGames';
import useLeagueFlows from 'hooks/league/useLeagueFlows';
import useTournamentFlows from 'hooks/tournament/useTournamentFlows';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import { TournamentQueries } from 'services/queries/tournament/TournamentQueries';
import Tournament from 'types/Tournament';
import { TournamentSettings } from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';
import { TournamentStatus } from 'types/TournamentStatus';
import { snackbarSuccessOptions } from 'utils/snackbarUtils';

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

enum TournamentTabs {
  tournamentDetails = 'tournamentDetails',
  brackets = 'brackets',
  groups = 'groups',
  schedule = 'schedule',
  results = 'results',
  activity = 'activity',
  buttons = 'buttons',
}
enum TournamentTabsLabel {
  tournamentDetails = 'Tournament Details',
  brackets = 'Brackets',
  groups = 'Groups',
  schedule = 'Schedule',
  activity = 'Activity',
  results = 'Results',
  buttons = 'Buttons',
}

const TournamentPage = () => {
  const [activeTab, setActiveTab] = useState(TournamentTabs.tournamentDetails);

  const [
    allowAutomaticTournamentAssignment,
    setAllowAutomaticTournamentAssignment,
  ] = useState(true);

  const [addOrEditTournamentModalProps, setAddOrEditTournamentModalProps] =
    useState<{ isOpen: boolean; tournament?: Tournament }>({ isOpen: false });

  const [isInitializeTournamentModalOpen, setIsInitializeTournamentModalOpen] =
    useState(false);

  const { setSelectedLeague, setSelectedLeagueTournament } = useLeagueFlows();

  const { data: activeLeague, isLoading: isFetchingActiveLeague } =
    LeagueQueries.useActiveLeague();

  const { addNewTournamentToLeague, initializeTournament } =
    useTournamentFlows();

  const { invalidateSelectedLeague } = LeagueQueries.useLeagueInvalidations();

  const { mutateAsync: updateTournament } =
    TournamentQueries.useUpdateTournament();

  const { data: leaguesList } = LeagueQueries.useLeaguesList();

  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const selectedTournament = activeLeague?.activeTournament;

  const setSelectedTournament = useCallback(
    async (tournament?: Tournament) => {
      await setSelectedLeagueTournament(tournament, activeLeague);
      setActiveTab(TournamentTabs.tournamentDetails);
    },
    [activeLeague, setSelectedLeagueTournament],
  );

  const addNewTournamentInternal = async (
    tournament: Tournament,
    isEdit: boolean,
  ) => {
    if (isEdit) {
      await updateTournament(tournament);
      enqueueSnackbar('Tournament updated', snackbarSuccessOptions);
    } else {
      await addNewTournamentToLeague(tournament, activeLeague);
    }
    await invalidateSelectedLeague();

    setAddOrEditTournamentModalProps({ isOpen: false });
  };

  const initializeTournamentInternal = async (
    stage: TournamentStage,
    settings: TournamentSettings,
  ) => {
    if (!selectedTournament) {
      return;
    }

    await initializeTournament(selectedTournament, stage, settings);

    setIsInitializeTournamentModalOpen(false);
  };

  useEffect(() => {
    if (
      !activeLeague ||
      activeLeague?.activeTournament ||
      !allowAutomaticTournamentAssignment ||
      params?.leagueId
    ) {
      if (activeLeague?.activeTournament) {
        setAllowAutomaticTournamentAssignment(false);
      }
      return;
    }

    const unfinishedLeagueTournaments = activeLeague?.tournaments.filter(
      (tournament) => tournament.state.status !== TournamentStatus.finished,
    );

    if (unfinishedLeagueTournaments?.length > 0) {
      const inProgressTournament = activeLeague?.tournaments.find(
        (tournament) => tournament.state.status === TournamentStatus.inProgress,
      );

      if (inProgressTournament) {
        setSelectedTournament(inProgressTournament);
      }
    }
    setAllowAutomaticTournamentAssignment(false);
  }, [
    allowAutomaticTournamentAssignment,
    activeLeague,
    setSelectedTournament,
    params?.leagueId,
  ]);

  useEffect(() => {
    const { leagueId } = params;
    if (!leagueId) {
      return;
    }
    const trySetNewActiveLeague = async () => {
      const leagueToSetActive = leaguesList?.find(
        (league) => league.id === leagueId,
      );
      await setSelectedLeague(leagueToSetActive);
      setAddOrEditTournamentModalProps({ isOpen: true });
    };
    trySetNewActiveLeague();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <FlexContainer
        gap={8}
        style={{ position: 'absolute', right: '15px', top: '-1px' }}
      >
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
      </FlexContainer>
      <TournamentPageSelectLeagueView
        activeLeague={activeLeague}
        onLeagueDeselected={(league) => setSelectedLeague(null, league)}
        onLeagueSelected={() => setAllowAutomaticTournamentAssignment(true)}
      />
      <TournamentPageSelectTournamentView
        activeLeague={activeLeague}
        onTournamentDeselected={() => setSelectedTournament(undefined)}
        onTournamentSelected={(tournament) => setSelectedTournament(tournament)}
      />

      {activeLeague && selectedTournament && (
        <FlexContainer
          height="100%"
          flexDirection="column"
          alignItems="stretch"
          overflow="hidden"
          style={{ maxHeight: 'calc(100% - 100px)' }}
        >
          <CustomTabs
            items={Object.values(TournamentTabs).map((key) => ({
              label: TournamentTabsLabel[key],
              value: key,
            }))}
            onTabChanged={(newTab) => {
              setActiveTab(TournamentTabs[newTab as TournamentTabs]);
            }}
          />
          {activeTab === TournamentTabs.tournamentDetails && (
            <TournamentDetailsTab />
          )}
          {activeTab === TournamentTabs.groups && <TournamentGroupsTab />}
          {activeTab === TournamentTabs.brackets && <TournamentBracketsTab />}
          {activeTab === TournamentTabs.results && <TournamentResultsTab />}
          {activeTab === TournamentTabs.activity && <TournamentActivityTab />}
          {activeTab === TournamentTabs.schedule && <TournamentScheduleTab />}
          {activeTab === TournamentTabs.buttons && <TournamentButtonsTab />}
        </FlexContainer>
      )}
      <ScheduleUpcomingGames />

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
        title={`Initialize ${selectedTournament?.name}`}
        showHeader
      >
        <InitializeTournament
          tournament={selectedTournament!}
          onConfirm={initializeTournamentInternal}
        />
      </CustomModal>
    </PageContainer>
  );
};

export default TournamentPage;
