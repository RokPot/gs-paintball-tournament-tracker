import { useMemo } from 'react';
import { isByePlaceholderGame } from 'types/BracketProperties';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import { TournamentSettings } from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';

export interface ScheduleRow {
  showDivider?: boolean;
  showGroup?: boolean;
  scheduledGame?: TournamentScheduleGame;
  previousGroupIndex?: number;
  groupIndex?: number;
  nextGroupIndex?: number;
}

const useGetScheduleRows = (
  tournamentStage?: TournamentStage,
  tournamentSettings?: TournamentSettings,
  filterScheduledGame?: (scheduledGame: TournamentScheduleGame) => boolean,
) => {
  const currentSchedule = useMemo(() => {
    if (!tournamentStage?.schedule) {
      return undefined;
    }
    const withoutByes = tournamentStage.schedule.filter(
      (scheduledGame) => !isByePlaceholderGame(scheduledGame.game),
    );
    if (!filterScheduledGame) {
      return withoutByes;
    }
    // Filtering before the rows are built keeps group headers from being
    // emitted for groups that have no remaining games.
    return withoutByes.filter(filterScheduledGame);
  }, [tournamentStage, filterScheduledGame]);

  const currentGroups = useMemo(() => {
    if (!tournamentStage?.groups) {
      return undefined;
    }
    return tournamentStage.groups;
  }, [tournamentStage?.groups]);

  const scheduleRows = useMemo(() => {
    if (!currentGroups?.length || !currentSchedule?.length) {
      return [];
    }
    const newScheduledRows: ScheduleRow[] = [];
    let currentGroupedGamesLength = 0;
    const maxGroupedGames = tournamentSettings?.switchGames ? 2 : 1;
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

    return newScheduledRows;
  }, [currentGroups?.length, currentSchedule, tournamentSettings?.switchGames]);

  return { scheduleRows };
};

export default useGetScheduleRows;
