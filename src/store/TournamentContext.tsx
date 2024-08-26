import useTournamentLogic from 'hooks/tournament/useTournamentLogic';
import React, { useMemo } from 'react';
import League from 'types/League';
import { Match } from 'types/Match';
import Team from 'types/Team';
import TournamentScheduleGame from 'types/TournamentScheduleGame';
import TournamentStage from 'types/TournamentStage';

export type TournamentContextProps = {
  activeLeague?: League | null;
  isFetchingActiveLeague?: boolean;
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
  setFirstLoad?: (isFirstLoad: boolean) => void;
};

export const TournamentContext = React.createContext<TournamentContextProps>(
  {},
);

const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
    setFirstLoad,
    activeLeague,
    isFetchingActiveLeague,
  } = useTournamentLogic();

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
      setFirstLoad,
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
      setFirstLoad,
    ],
  );
  return (
    <TournamentContext.Provider value={contextValue}>
      {children}
    </TournamentContext.Provider>
  );
};

export default TournamentProvider;
