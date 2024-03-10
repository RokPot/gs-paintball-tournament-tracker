import Game from 'types/Game';
import Team from 'types/Team';
import { TournamentGroupSettings } from 'types/TournamentGroupSettings';
import { TournamentType } from 'types/TournamentType';
import { PouchDBDto } from 'types/dto/PouchDBDto';

export interface ITournamentGroup extends PouchDBDto {
  id: string;

  groupIndex: number;

  teams: Team[];

  games: Game[];

  groupType: TournamentType;

  stage: number;

  settings?: TournamentGroupSettings;
}
