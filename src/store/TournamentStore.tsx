import Game from 'types/Game';
import { create } from 'zustand';

interface TournamentStoreState {
  currentActiveGame?: Game;
  isMatchInProgress: boolean;
  setCurrentActiveGame: (game: Game, isMatchInProgress: boolean) => void;
  setIsMatchInProgress: (isMatchInProgress: boolean) => void;
  showFinishMatchModal: boolean;
  setShowFinishMatchModal: (showFinishMatchModal: boolean) => void;
  hasGameTimeRanOut: boolean;
  setHasGameTimeRanOut: (hasGameTimeRanOut: boolean) => void;
}

const useTournamentStore = create<TournamentStoreState>((set) => ({
  currentActiveGame: undefined,
  isMatchInProgress: false,
  showFinishMatchModal: false,
  hasGameTimeRanOut: false,

  setHasGameTimeRanOut: (hasGameTimeRanOut) => {
    set(() => ({
      hasGameTimeRanOut,
    }));
  },
  setCurrentActiveGame: (currentActiveGame, isMatchInProgress) => {
    set(() => ({
      currentActiveGame,
      isMatchInProgress,
    }));
  },

  setIsMatchInProgress: (isMatchInProgress) => {
    set(() => ({
      isMatchInProgress,
    }));
  },

  setShowFinishMatchModal: (showFinishMatchModal) => {
    set(() => ({
      showFinishMatchModal,
    }));
  },
}));

export default useTournamentStore;
