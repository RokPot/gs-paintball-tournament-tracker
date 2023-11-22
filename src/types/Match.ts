import MatchState from './MatchState';

export interface Match {
  id: string;

  matchState: MatchState;

  team1Margin: number;

  team2Margin: number;
}
