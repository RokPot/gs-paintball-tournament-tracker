import {
  faArrowUpRightFromSquare,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import EmptyInboxIcon from 'assets/icons/EmptyInbox';
import AddOrEditGame from 'components/game/AddOrEditGame';
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import TournamentStageTabSwitch from 'components/tournament/TournamentStageTabSwitch';
import usePdfExporter from 'hooks/exporter/usePdfExporter';
import useGameFlows from 'hooks/game/useGameFlows';
import useIPCRendererMessages from 'hooks/main/useIPCRendererMessages';
import useGetScheduleRows from 'hooks/ui/useGetScheduleRows';
import { useCallback, useContext, useState } from 'react';
import { TournamentQueries } from 'services/queries/tournament/TournamentQueries';
import { TournamentContext } from 'store/TournamentContext';
import useTournamentStore from 'store/TournamentStore';
import Game from 'types/Game';
import Tournament from 'types/Tournament';
import TournamentStage from 'types/TournamentStage';
import { TournamentStatus } from 'types/TournamentStatus';
import { reorderPlayableScheduledGames } from 'utils/scheduleReorderUtils';
import { TournamentFlow } from 'utils/tournamentFlowUtils';
import ScheduleRowGame from './ScheduleRowGame';
import ScheduleRowGroup, { StyledDivider } from './ScheduleRowGroup';

interface IProps {
  activeTournament?: Tournament;
}

const ScheduleContainer = ({ activeTournament }: IProps) => {
  const { updateGameWithMatchesAndRecalculate } = useGameFlows();
  const { forceRefreshTournament } = useContext(TournamentContext);
  const { mutateAsync: updateTournament } =
    TournamentQueries.useUpdateTournament();
  const [gameForEditModal, setGameForEditModal] = useState<Game>();
  const [selectedStageId, setSelectedStageId] = useState<string | undefined>();
  const selectedStage =
    activeTournament?.stages?.find((stage) => stage.id === selectedStageId) ||
    activeTournament?.currentStage;
  const theme = useTheme();
  const { exportScheduleToPdf } = usePdfExporter();

  const { openNewResultsWindow } = useIPCRendererMessages();
  const { isMatchInProgress, currentActiveGame } = useTournamentStore();

  const { scheduleRows } = useGetScheduleRows(
    selectedStage,
    activeTournament?.settings,
  );
  const canReorderSchedule = [
    TournamentStatus.created,
    TournamentStatus.initialized,
  ].includes(activeTournament?.state?.status || TournamentStatus.finished);
  const playableScheduleCount = scheduleRows.filter(
    (scheduleRow) => scheduleRow.scheduledGame,
  ).length;

  const onEditGame = (game: Game) => {
    setGameForEditModal(game);
  };

  const onReorderPlayableGame = useCallback(
    async (fromPlayableIndex: number, toPlayableIndex: number) => {
      if (!selectedStage?.schedule || !activeTournament) {
        return;
      }
      const nextSchedule = reorderPlayableScheduledGames(
        selectedStage.schedule,
        fromPlayableIndex,
        toPlayableIndex,
        !!activeTournament.settings.switchGames,
      );
      const nextStage = new TournamentStage({
        ...selectedStage,
        schedule: nextSchedule,
      });
      selectedStage.schedule = nextSchedule;
      const stageInTournament = activeTournament.stages?.find(
        (stage) => stage.id === selectedStage.id,
      );
      if (stageInTournament) {
        stageInTournament.schedule = nextSchedule;
      }
      if (activeTournament.currentStage?.id === selectedStage.id) {
        activeTournament.currentStage.schedule = nextSchedule;
      }
      setSelectedStageId(nextStage.id);
      await updateTournament(activeTournament);
      forceRefreshTournament?.();
    },
    [activeTournament, selectedStage, updateTournament, forceRefreshTournament],
  );

  const closeModal = () => {
    setGameForEditModal(undefined);
  };

  if (!activeTournament) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyInboxIcon fill="transparent" width="250px" />

        <Typography variant="h3">No active tournament.</Typography>
      </FlexContainer>
    );
  }

  if (!scheduleRows?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyInboxIcon />

        <Typography variant="h3">No schedule.</Typography>
      </FlexContainer>
    );
  }
  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      justifyContent="flex-start"
      alignItems="flex-start"
      gap={0}
      style={{
        paddingTop: '8px',
      }}
      position="relative"
      overflowY="auto"
    >
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        style={{
          position: 'absolute',
          right: '8px',
          top: '0px',
          zIndex: 2,
        }}
      >
        <Tooltip title="Open Schedule In New Window" arrow>
          <IconButton onClick={openNewResultsWindow}>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              width={15}
              height={15}
              color={theme.palette.primary.main}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Export Schedule" arrow>
          <IconButton onClick={() => exportScheduleToPdf(scheduleRows)}>
            <FontAwesomeIcon
              icon={faFileExport}
              width={15}
              height={15}
              color={theme.palette.primary.main}
            />
          </IconButton>
        </Tooltip>
      </FlexContainer>
      <TournamentStageTabSwitch
        selectedTournament={activeTournament}
        onStageSelected={(stage) => setSelectedStageId(stage.id)}
      />
      {scheduleRows?.map((scheduleRow, index) => {
        if (scheduleRow.showDivider) {
          return <StyledDivider key={`${index}1`} />;
        }
        if (scheduleRow.showGroup) {
          return (
            <ScheduleRowGroup
              key={`${index}1`}
              groupIndex={scheduleRow.groupIndex || index}
            />
          );
        }

        const playableIndex = scheduleRows
          .filter((row) => row.scheduledGame)
          .findIndex(
            (row) => row.scheduledGame?.id === scheduleRow.scheduledGame?.id,
          );

        return (
          <ScheduleRowGame
            key={`${index}1`}
            game={scheduleRow.scheduledGame?.game!}
            gameNumber={scheduleRow?.scheduledGame?.gameNumber || index}
            onEditGame={onEditGame}
            disableEditting={
              isMatchInProgress &&
              currentActiveGame?.id === scheduleRow.scheduledGame?.game.id
            }
            canReorder={canReorderSchedule}
            canMoveUp={playableIndex > 0}
            canMoveDown={playableIndex < playableScheduleCount - 1}
            onMoveUp={() =>
              onReorderPlayableGame(playableIndex, playableIndex - 1)
            }
            onMoveDown={() =>
              onReorderPlayableGame(playableIndex, playableIndex + 1)
            }
            nextGames={TournamentFlow.getNextGamesForEliminationsTournament(
              scheduleRow.scheduledGame?.game!,
              activeTournament?.currentStageGroups?.find(
                (group) => group.id === scheduleRow.scheduledGame?.group?.id,
              ),
              activeTournament.state.stage === 1
                ? activeTournament?.settings?.firstStageType
                : activeTournament?.settings?.secondStageType,
            )}
          />
        );
      })}
      <CustomModal isModalOpen={!!gameForEditModal} width={800}>
        {gameForEditModal && (
          <AddOrEditGame
            game={gameForEditModal}
            onConfirm={async (updatedGame) => {
              await updateGameWithMatchesAndRecalculate(
                updatedGame,
                activeTournament,
              );
              forceRefreshTournament?.();
              closeModal();
            }}
            sizeOfTeams={activeTournament?.settings?.numberOfTeamSize}
            onClose={closeModal}
          />
        )}
      </CustomModal>
    </FlexContainer>
  );
};

export default ScheduleContainer;
