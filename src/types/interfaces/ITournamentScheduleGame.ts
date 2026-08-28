import Game from 'types/Game';
import TournamentGroup from 'types/TournamentGroup';
import { RxDBDto } from 'types/dto/RxDBDto';

export interface ITournamentScheduleGame extends RxDBDto {
  id: string;

  gameNumber: number;

  group: TournamentGroup;

  game: Game;
}
