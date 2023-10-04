import { Game } from 'types/Game';
import { Team } from 'types/Team';
import { TournamentGroup } from 'types/TournamentGroup';
import { TournamentState } from 'types/TournamentState';

export interface ITournament {
  id: string;

  teams: Team[];

  groups: TournamentGroup[];

  state: TournamentState;
}
