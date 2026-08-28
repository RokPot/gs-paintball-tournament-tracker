import { RxDBDto } from 'types/dto/RxDBDto';

export interface IActiveState extends RxDBDto {
  gameId: string | null;
  tournamentId: string | null;
  leagueId: string | null;
}
