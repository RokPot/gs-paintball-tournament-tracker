import { TournamentStage } from './TournamentStage';
import { ITournamentState } from './interfaces/ITournamentState';

export class TournamentState {
  id: string;

  isTournamentFinished: boolean;

  isGameInProgress: boolean;

  stage: TournamentStage;

  constructor(props: ITournamentState) {
    this.id = props.id;
    this.isTournamentFinished = props.isTournamentFinished;
    this.isGameInProgress = props.isGameInProgress;
    this.stage = props.stage;
  }
}
