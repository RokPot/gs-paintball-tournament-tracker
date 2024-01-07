import Game from './Game';
import TournamentGroup from './TournamentGroup';

export interface TournamentSchedule {
  id: string;

  gameNumber: number;

  groupId: TournamentGroup;

  game: Game;
}
