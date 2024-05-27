import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import AddOrEditGame from 'components/game/AddOrEditGame';
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import useGameFlows from 'hooks/game/useGameFlows';
import { useEffect, useMemo, useState } from 'react';
import Game from 'types/Game';
import League from 'types/League';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import EmptyState from '../../../../../assets/icons/EmptyInbox.svg';
import ScheduleRowGame from './ScheduleRowGame';
import ScheduleRowGroup, { StyledDivider } from './ScheduleRowGroup';

interface ScheduleRow {
  showDivider?: boolean;
  showGroup?: boolean;
  scheduledGame?: TournamentScheduleGame;
  previousGroupIndex?: number;
  groupIndex?: number;
  nextGroupIndex?: number;
}

interface IProps {
  activeLeague: League;
  disableEditting?: boolean;
  disableNewWindowOpen?: boolean;
}

const ScheduleContainer = ({
  activeLeague,
  disableEditting,
  disableNewWindowOpen,
}: IProps) => {
  const selectedTournament = activeLeague.activeTournament!;
  const { updateGameWithMatchesAndRecalculate } = useGameFlows();
  const [gameForEditModal, setGameForEditModal] = useState<Game>();
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([]);
  const theme = useTheme();
  const { numberOfTeamSize, switchGames } = selectedTournament.settings;

  const currentSchedule = useMemo(() => {
    if (!selectedTournament?.currentStageSchedule) {
      return undefined;
    }
    return selectedTournament.currentStageSchedule;
  }, [selectedTournament?.currentStageSchedule]);

  const currentGroups = useMemo(() => {
    if (!selectedTournament?.currentStageGroups) {
      return undefined;
    }
    return selectedTournament.currentStageGroups;
  }, [selectedTournament.currentStageGroups]);

  const onEditGame = (game: Game) => {
    setGameForEditModal(game);
  };

  const closeModal = () => {
    setGameForEditModal(undefined);
    setGameForEditModal(undefined);
  };

  useEffect(() => {
    if (!currentGroups?.length || !currentSchedule?.length) {
      return;
    }
    const newScheduledRows: ScheduleRow[] = [];
    let currentGroupedGamesLength = 0;
    const maxGroupedGames = switchGames ? 2 : 1;
    currentSchedule?.forEach((scheduledGame, index) => {
      const previousScheduledGame = currentSchedule[index - 1];
      const currentScheduledGame = scheduledGame;
      const nextScheduledGame = currentSchedule[index + 1];

      const isNextGroupDifferent =
        index > 0 &&
        previousScheduledGame?.group.groupIndex !==
          currentScheduledGame?.group.groupIndex;
      const isFirstRow = index === 0;

      if (isFirstRow) {
        newScheduledRows.push({
          showGroup: true,
          groupIndex: currentScheduledGame.group.groupIndex,
        });
        newScheduledRows.push({
          scheduledGame,
        });
        currentGroupedGamesLength += 1;
        if (maxGroupedGames === currentGroupedGamesLength) {
          // newScheduledRows.push({ showDivider: true });
          currentGroupedGamesLength = 0;
        }
        return;
      }
      if (isNextGroupDifferent) {
        newScheduledRows.push({
          showGroup: true,
          groupIndex: currentScheduledGame.group.groupIndex,
        });
      }
      currentGroupedGamesLength += 1;
      newScheduledRows.push({
        scheduledGame,
      });
      if (maxGroupedGames === currentGroupedGamesLength) {
        if (nextScheduledGame?.group.id === currentScheduledGame.group.id) {
          // newScheduledRows.push({ showDivider: true });
          currentGroupedGamesLength = 0;
        }
      }
      if (maxGroupedGames !== currentGroupedGamesLength) {
        if (
          nextScheduledGame?.group.id !== currentScheduledGame.group.id &&
          index + 1 < (currentSchedule?.length || 0)
        ) {
          // newScheduledRows.push({ showDivider: true });
          currentGroupedGamesLength = 0;
        }
      }
    });
    setScheduleRows(newScheduledRows);
  }, [currentGroups, currentSchedule, selectedTournament, switchGames]);

  if (!currentGroups?.length) {
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

  if (!currentSchedule?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <img src={EmptyState} alt="empty" />

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
      style={{ paddingTop: '8px' }}
      position="relative"
    >
      {!disableNewWindowOpen && (
        <Tooltip title="Open Schedule In New Window" arrow placement="left">
          <IconButton
            onClick={() => {
              window.electron.ipcRenderer.sendMessage(
                'open-new-window',
                'new_window.html',
              );
            }}
            style={{
              width: '40px',
              position: 'absolute',
              right: '8px',
              top: '0px',
            }}
          >
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              width={15}
              height={15}
              color={theme.palette.primary.main}
            />
          </IconButton>
        </Tooltip>
      )}

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

        return (
          <ScheduleRowGame
            key={`${index}1`}
            game={scheduleRow.scheduledGame?.game!}
            gameNumber={scheduleRow?.scheduledGame?.gameNumber || index}
            onEditGame={onEditGame}
            disableEditting={disableEditting}
          />
        );
      })}
      <CustomModal isModalOpen={!!gameForEditModal} width={600}>
        {gameForEditModal && (
          <AddOrEditGame
            game={gameForEditModal}
            onConfirm={async (updatedGame) => {
              await updateGameWithMatchesAndRecalculate(updatedGame);
              closeModal();
            }}
            sizeOfTeams={numberOfTeamSize}
            onClose={closeModal}
          />
        )}
      </CustomModal>
    </FlexContainer>
  );
};

export default ScheduleContainer;
