import { v4 } from 'uuid';

enum TieBreakCheckings {
  HeadToHead = 'headToHead',
  NumberOfPoints = 'numberOfPoints',
  NumberOfMatchesWon = 'numberOfMatchesWon',
  MatchMargin = 'matchMargin',
  GreatestTimeRemainingAmongAllWonGames = 'greatestTimeRemainingAmongAllWonGames',
  GreatestTimeRemainingAmongTiedWonGames = 'greatestTimeRemainingAmongTiedWonGames',
  LeastTimeRemainingAmongAllLostGames = 'leastTimeRemainingAmongAllLostGames',
  LeastTimeRemainingAmongTiedLostGames = 'leastTimeRemainingAmongTiedLostGames',
}
enum AvailableTieBreaks {
  TieBreakerGames = 'tieBreakerGames',
  Overtime = 'overtime',
}

interface TieBreakSequenceCheck {
  priority: number;
  tieBreakCheck: TieBreakCheckings;
}

export interface TournamentRules {
  id: string;
  tiebreakChecksSequence: TieBreakSequenceCheck[];
  tieBreakMode: AvailableTieBreaks;
}

export const DefaultTournamentRules: TournamentRules = {
  id: v4(),
  tiebreakChecksSequence: [],
  tieBreakMode: AvailableTieBreaks.Overtime,
};
