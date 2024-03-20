import Game from 'types/Game';
import TournamentGroup from 'types/TournamentGroup';
import { PouchDBDto } from 'types/dto/PouchDBDto';

export interface ITournamentScheduleGame extends PouchDBDto {
  id: string;

  gameNumber: number;

  group: TournamentGroup;

  game: Game;
}
