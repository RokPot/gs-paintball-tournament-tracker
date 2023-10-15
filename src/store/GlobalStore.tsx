import { League } from 'types/League';
import { Tournament } from 'types/Tournament';
import { create } from 'zustand';

interface GlobalStoreState {
  selectedLeague?: League;
  setSelectedLeague: (league: League) => void;
  selectedTournament?: Tournament;
  setSelectedTournament: (league: Tournament) => void;
  allLeagues: League[];
  addLeague: (league: League) => void;
}

const useGlobalStore = create<GlobalStoreState>((set) => ({
  selectedLeague: undefined,
  selectedTournament: undefined,
  allLeagues: [],
  setSelectedLeague: (league: League) =>
    set(() => ({ selectedLeague: league })),
  setSelectedTournament: (tournament: Tournament) =>
    set(() => ({ selectedTournament: tournament })),
  addLeague: (league: League) =>
    set((state) => ({ allLeagues: [...state.allLeagues, league] })),
}));

export default useGlobalStore;
