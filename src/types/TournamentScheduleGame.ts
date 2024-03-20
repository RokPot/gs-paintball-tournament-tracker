import Game from './Game';
import TournamentGroup from './TournamentGroup';

export default interface TournamentScheduleGame {
  id: string;

  gameNumber: number;

  game: Game;

  group: TournamentGroup;

  index: number;
}
