import Game from './Game';
import Team from './Team';

export interface TournamentGroup {
  id: string;

  groupIndex: number;

  teams: Team[];

  games: Game[];
}
