import { Game } from './Game';
import { Team } from './Team';
import { TeamMember } from './TeamMember';
import { TournamentGroup } from './TournamentGroup';
import { ITournament } from './interfaces/ITournament';

export enum TournamentStage {
  startStage = 'startStage',
  groupStage = 'groupStage',
  eliminationsStage = 'eliminationsStage',
  endStage = 'endStage',
}
