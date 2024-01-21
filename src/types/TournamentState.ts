import { TournamentStatus } from './TournamentStatus';
import { ITournamentState } from './interfaces/ITournamentState';

export default class TournamentState {
  id: string;

  isTournamentFinished: boolean;

  isGameInProgress: boolean;

  status: TournamentStatus;

  currentGameId?: string;

  currentGroupId?: string;

  stage: number;

  constructor(props: ITournamentState) {
    this.id = props.id;
    this.isTournamentFinished = props.isTournamentFinished;
    this.isGameInProgress = props.isGameInProgress;
    this.status = props.status;
    this.stage = props.stage || 0;
    this.currentGameId = props.currentGameId;
    this.currentGroupId = props.currentGroupId;
  }
}
