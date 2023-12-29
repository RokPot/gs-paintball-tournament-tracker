import Game from './Game';
import Team from './Team';
import { TournamentType } from './TournamentType';

export interface TournamentGroup {
  id: string;

  groupIndex: number;

  teams: Team[];

  games: Game[];

  groupType: TournamentType;
}
