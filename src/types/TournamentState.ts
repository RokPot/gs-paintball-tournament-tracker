import { TournamentStatus } from './TournamentStatus';
import { ITournamentState } from './interfaces/ITournamentState';

export default class TournamentState {
  id: string;

  isTournamentFinished: boolean;

  isGameInProgress: boolean;

  status: TournamentStatus;

  activeGameId?: string;

  pairedGame1Id?: string;

  pairedGame2Id?: string;

  activeGroupId?: string;

  stage: number;

  constructor(props: ITournamentState) {
    this.id = props.id;
    this.isTournamentFinished = props.isTournamentFinished;
    this.isGameInProgress = props.isGameInProgress;
    this.status = props.status;
    this.stage = props.stage || 0;
    this.activeGameId = props.activeGameId;
    this.pairedGame1Id = props.pairedGame1Id;
    this.pairedGame2Id = props.pairedGame2Id;
    this.activeGroupId = props.activeGroupId;
  }
}
