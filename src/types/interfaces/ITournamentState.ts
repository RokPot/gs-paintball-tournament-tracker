import { TournamentGroup } from 'types/TournamentGroup';
import { TournamentStage } from 'types/TournamentStage';

export interface ITournamentState {
  id: string;

  isTournamentFinished: boolean;

  isGameInProgress: TournamentGroup[];

  stage: TournamentStage;
}
