import Game from 'types/Game';
import Team from 'types/Team';
import { TournamentType } from 'types/TournamentType';
import { PouchDBDto } from 'types/dto/PouchDBDto';

export interface ITournamentGroup extends PouchDBDto {
  id: string;

  groupIndex: number;

  teams: Team[];

  games: Game[];

  groupType: TournamentType;

  stage: number;
}
