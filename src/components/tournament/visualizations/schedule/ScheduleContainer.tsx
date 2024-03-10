import { Typography } from '@mui/material';
import AddOrEditGame from 'components/game/AddOrEditGame';
import CustomModal from 'components/shared/CustomModal';
import FlexContainer from 'components/shared/FlexContainer';
import useGameQueries from 'hooks/game/useGameQueries';
import { useEffect, useState } from 'react';
import Game from 'types/Game';
import League from 'types/League';
import { TournamentScheduleGame } from 'types/TournamentScheduleGame';
import { ReactComponent as EmptyState } from '../../../../../assets/icons/EmptyInbox.svg';
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
}

const ScheduleContainer = ({ activeLeague, disableEditting }: IProps) => {
  const selectedTournament = activeLeague.activeTournament!;
  const { updateGameWithMatchesAndRecalculate } = useGameQueries();
  const [gameForEditModal, setGameForEditModal] = useState<Game>();
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([]);
  const { numberOfTeamSize } = selectedTournament.settings;
  const switchGames = true;
  const onEditGame = (game: Game) => {
    setGameForEditModal(game);
  };

  const closeModal = () => {
    setGameForEditModal(undefined);
    setGameForEditModal(undefined);
  };

  useEffect(() => {
    if (
      !selectedTournament?.groups?.length ||
      !selectedTournament?.schedule?.length
    ) {
      return;
    }
    const newScheduledRows: ScheduleRow[] = [];
    let currentGroupedGamesLength = 0;
    const maxGroupedGames = switchGames ? 2 : 1;
    selectedTournament?.schedule?.forEach((scheduledGame, index) => {
      const previousScheduledGame = selectedTournament?.schedule?.[index - 1];
      const currentScheduledGame = scheduledGame;
      const nextScheduledGame = selectedTournament?.schedule?.[index + 1];

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
          index + 1 < (selectedTournament.schedule?.length || 0)
        ) {
          // newScheduledRows.push({ showDivider: true });
          currentGroupedGamesLength = 0;
        }
      }
    });
    setScheduleRows(newScheduledRows);
  }, [
    selectedTournament?.groups?.length,
    selectedTournament?.schedule,
    switchGames,
  ]);

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

  if (!selectedTournament?.schedule?.length) {
    return (
      <FlexContainer
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <EmptyState />
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
    >
      {scheduleRows?.map((scheduleRow, index) => {
        if (scheduleRow.showDivider) {
          return <StyledDivider key={`${index}1`} />;
        }
        if (scheduleRow.showGroup) {
          return (
            <ScheduleRowGroup groupIndex={scheduleRow.groupIndex || index} />
          );
        }

        return (
          <ScheduleRowGame
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
