import { TournamentStatus } from 'types/TournamentStatus';

export interface ITournamentState {
  id: string;

  isTournamentFinished: boolean;

  isGameInProgress: boolean;

  status: TournamentStatus;

  stage: number;
}
