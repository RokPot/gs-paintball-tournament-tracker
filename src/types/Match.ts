import { MatchState } from './MatchState';
import { Team } from './Team';
import { TeamMember } from './TeamMember';

export interface Match {
  id: string;

  matchState: MatchState;

  team1Margin: number;
  team2Margin: number;
}
