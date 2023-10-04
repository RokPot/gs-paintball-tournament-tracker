import { Game } from './Game';
import { Team } from './Team';
import { TeamMember } from './TeamMember';
import { TournamentGroup } from './TournamentGroup';
import { TournamentStage } from './TournamentStage';
import { ITournament } from './interfaces/ITournament';
import { ITournamentState } from './interfaces/ITournamentState';

export class TournamentState {
  id: string;

  isTournamentFinished: boolean;

  isGameInProgress: TournamentGroup[];

  stage: TournamentStage;

  constructor(props: ITournamentState) {
    this.id = props.id;
    this.isTournamentFinished = props.isTournamentFinished;
    this.isGameInProgress = props.isGameInProgress;
    this.stage = props.stage;
  }
}
