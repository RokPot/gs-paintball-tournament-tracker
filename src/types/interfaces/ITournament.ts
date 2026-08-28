import { GameSettings } from 'types/GameSettings';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';
import { TournamentSettings } from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';
import TournamentState from 'types/TournamentState';
import { RxDBDto } from 'types/dto/RxDBDto';

export interface ITournament extends RxDBDto {
  id: string;

  teams?: Team[];

  state: TournamentState;

  name: string;

  startDate?: string;

  endDate?: string;

  settings?: TournamentSettings;

  gameSettings?: GameSettings;

  leaderboard?: LeaderboardTeam[];

  stages?: TournamentStage[];
}
