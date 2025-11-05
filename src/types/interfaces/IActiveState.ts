import { PouchDBDto } from 'types/dto/PouchDBDto';

export interface IActiveState extends PouchDBDto {
  gameId: string | null;
  tournamentId: string | null;
  leagueId: string | null;
}
