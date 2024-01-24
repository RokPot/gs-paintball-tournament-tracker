import Game from './Game';
import TournamentGroup from './TournamentGroup';

export interface TournamentSchedule {
  id: string;

  gameNumber: number;

  group: TournamentGroup;

  game: Game;
}
