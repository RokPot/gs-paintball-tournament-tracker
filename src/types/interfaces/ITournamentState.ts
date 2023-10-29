import { TournamentStage } from 'types/TournamentStage';

export interface ITournamentState {
  id: string;

  isTournamentFinished: boolean;

  isGameInProgress: boolean;

  stage: TournamentStage;
}
