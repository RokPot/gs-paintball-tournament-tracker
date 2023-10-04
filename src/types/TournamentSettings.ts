import { GameState } from './GameState';
import { Match } from './Match';
import { Team } from './Team';
import { TeamMember } from './TeamMember';
import { TournamentGroup } from './TournamentGroup';
import { IGame } from './interfaces/IGame';

export interface TournamentSettings {
  id: string;
  numberOfWinsRequired: number;
  twoWinsDifference: boolean;
  gameTimeInSeconds: number;
}
