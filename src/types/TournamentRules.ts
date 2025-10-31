import { v4 } from 'uuid';

export enum TieResolveCheck {
  HeadToHead = 'headToHead',
  NumberOfPoints = 'numberOfPoints',
  NumberOfCleanGames = 'numberOfCleanGames',
  NumberOfMatchesWonInTiedGames = 'numberOfMatchesWonInTiedGames',
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

export interface TournamentRules {
  id: string;
  tiebreakChecksSequence: TieResolveCheck[];
  tieBreakMode: AvailableTieBreaks;
  gameWinPoints: number;
  gameDrawPoints: number;
  gameLossPoints: number;
}

export const DefaultTournamentRules: TournamentRules = {
  id: v4(),
  tiebreakChecksSequence: [
    TieResolveCheck.HeadToHead,
    TieResolveCheck.NumberOfMatchesWonInTiedGames,
    TieResolveCheck.MatchMargin,
    TieResolveCheck.NumberOfCleanGames,
    TieResolveCheck.GreatestTimeRemainingAmongTiedWonGames,
    TieResolveCheck.GreatestTimeRemainingAmongAllWonGames,
    TieResolveCheck.LeastTimeRemainingAmongTiedLostGames,
    TieResolveCheck.LeastTimeRemainingAmongAllLostGames,
  ],
  tieBreakMode: AvailableTieBreaks.Overtime,
  gameWinPoints: 5,
  gameDrawPoints: 1,
  gameLossPoints: 0,
};
