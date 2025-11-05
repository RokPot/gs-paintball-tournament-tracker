import useBroadcastResultsSnapshot from 'hooks/results/useBroadcastResultsSnapshot';
import useTournamentLogic from 'hooks/tournament/useTournamentLogic';
import React, { useMemo } from 'react';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import League from 'types/League';
import { Match } from 'types/Match';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import TournamentStage from 'types/TournamentStage';

export type TournamentContextProps = {
  activeLeague?: League | null;
  isFetchingActiveLeague?: boolean;
  activeTournament?: Tournament;
  currentStage?: number;
  activeGame?: TournamentScheduleGame;
  timingBreak?: boolean;
  isMatchInProgress?: boolean;
  finishMatch?: (match: Match) => Promise<void>;
  beginTournament?: () => Promise<void>;
  startStopMatch?: () => void;
  setFinishMatchModal?: (shouldShowFinishMatchModal: boolean) => void;
  hasGameTimeRanOut?: boolean;
  showFinishMatchModal?: boolean;
  isProcessing?: boolean;
  confirmNextTournamentStage?: (nextStage: TournamentStage) => Promise<void>;
  onTeamPause?: (team: Team, isRefereeAction?: boolean | undefined) => void;
  forceRefreshTournament?: () => void;
};

export const TournamentContext = React.createContext<TournamentContextProps>(
  {},
);

const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: activeLeague, isLoading: isFetchingActiveLeague } =
    LeagueQueries.useActiveLeague();
  console.log('activeLeague', activeLeague);
  const {
    finishMatch,
    beginTournament,
    startStopMatch,
    setFinishMatchModal,
    activeGame,
    timingBreak,
    isMatchInProgress,
    hasGameTimeRanOut,
    showFinishMatchModal,
    isProcessing,
    confirmNextTournamentStage,
    onTeamPause,
    forceRefreshTournament,
  } = useTournamentLogic(activeLeague);

  useBroadcastResultsSnapshot(activeLeague);

  const contextValue = useMemo(
    () => ({
      activeLeague,
      isFetchingActiveLeague,
      finishMatch,
      beginTournament,
      startStopMatch,
      setFinishMatchModal,
      activeGame,
      timingBreak,
      isMatchInProgress,
      hasGameTimeRanOut,
      showFinishMatchModal,
      isProcessing,
      confirmNextTournamentStage,
      onTeamPause,
      forceRefreshTournament,
      activeTournament: activeLeague?.activeTournament,
    }),
    [
      activeGame,
      activeLeague,
      beginTournament,
      confirmNextTournamentStage,
      finishMatch,
      hasGameTimeRanOut,
      isFetchingActiveLeague,
      isMatchInProgress,
      isProcessing,
      onTeamPause,
      setFinishMatchModal,
      showFinishMatchModal,
      startStopMatch,
      timingBreak,
      forceRefreshTournament,
    ],
  );
  return (
    <TournamentContext.Provider value={contextValue}>
      {children}
    </TournamentContext.Provider>
  );
};

export default TournamentProvider;
