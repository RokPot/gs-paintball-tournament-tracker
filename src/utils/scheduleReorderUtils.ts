import { isByePlaceholderGame } from 'types/BracketProperties';
import TournamentScheduleGame from 'types/TournamentScheduleGame';

export const UNPAIRED_SCHEDULE_GAME_ID = 'NoPairedGameId';

export const getPlayableScheduledGames = (schedule: TournamentScheduleGame[]) =>
  schedule.filter((scheduledGame) => !isByePlaceholderGame(scheduledGame.game));

const pairConsecutivePlayableGames = (
  schedule: TournamentScheduleGame[],
  switchGames: boolean,
) => {
  const playableGames = getPlayableScheduledGames(schedule);
  playableGames.forEach((scheduledGame) => {
    scheduledGame.pairedGameId = UNPAIRED_SCHEDULE_GAME_ID;
  });
  if (!switchGames) {
    return;
  }
  for (let i = 0; i < playableGames.length; i += 2) {
    const firstGame = playableGames[i];
    const secondGame = playableGames[i + 1];
    if (!secondGame) {
      firstGame.pairedGameId = UNPAIRED_SCHEDULE_GAME_ID;
      return;
    }
    firstGame.pairedGameId = secondGame.id;
    secondGame.pairedGameId = firstGame.id;
  }
};

const renumberSchedule = (schedule: TournamentScheduleGame[]) => {
  schedule.forEach((scheduledGame, index) => {
    scheduledGame.index = index;
    scheduledGame.gameNumber = index + 1;
  });
};

export const reorderPlayableScheduledGames = (
  schedule: TournamentScheduleGame[],
  fromPlayableIndex: number,
  toPlayableIndex: number,
  switchGames: boolean,
): TournamentScheduleGame[] => {
  if (
    fromPlayableIndex === toPlayableIndex ||
    fromPlayableIndex < 0 ||
    toPlayableIndex < 0
  ) {
    return schedule;
  }

  const playableGames = getPlayableScheduledGames(schedule);
  if (
    fromPlayableIndex >= playableGames.length ||
    toPlayableIndex >= playableGames.length
  ) {
    return schedule;
  }

  const reorderedPlayableGames = [...playableGames];
  const [movedGame] = reorderedPlayableGames.splice(fromPlayableIndex, 1);
  reorderedPlayableGames.splice(toPlayableIndex, 0, movedGame);

  let playableCursor = 0;
  const nextSchedule = schedule.map((scheduledGame) => {
    if (isByePlaceholderGame(scheduledGame.game)) {
      return { ...scheduledGame };
    }
    const nextPlayableGame = reorderedPlayableGames[playableCursor];
    playableCursor += 1;
    return { ...nextPlayableGame };
  });

  renumberSchedule(nextSchedule);
  pairConsecutivePlayableGames(nextSchedule, switchGames);
  return nextSchedule;
};
