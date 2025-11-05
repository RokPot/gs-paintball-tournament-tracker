import Game from 'types/Game';
import Team from 'types/Team';
import { TournamentGroupSettings } from 'types/TournamentGroupSettings';
import { TournamentType } from 'types/TournamentType';
import { RxDBDto } from 'types/dto/RxDBDto';

export interface ITournamentGroup extends RxDBDto {
  id: string;

  groupIndex: number;

  teams: Team[];

  games: Game[];

  groupType: TournamentType;

  stage: number;

  settings?: TournamentGroupSettings;
}
