import Game from './Game';
import TournamentGroup from './TournamentGroup';

export interface TournamentScheduleGame {
  id: string;

  gameNumber: number;

  group: TournamentGroup;

  game: Game;
}
