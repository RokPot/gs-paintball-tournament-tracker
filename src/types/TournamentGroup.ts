import { Game } from './Game';
import { GameState } from './GameState';
import { Match } from './Match';
import { Team } from './Team';
import { TeamMember } from './TeamMember';

export interface TournamentGroup {
  id: string;

  groupIndex: number;

  teams: Team[];
  games: Game[];
}
