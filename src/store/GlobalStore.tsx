import { uniqBy } from 'lodash';
import { League } from 'types/League';
import { Team } from 'types/Team';
import { Tournament } from 'types/Tournament';
import { create } from 'zustand';

interface GlobalStoreState {
  selectedLeague?: League;
  setSelectedLeague: (league?: League) => void;
  updateSelectedLeague: (league: League) => void;

  selectedTournament?: Tournament;
  setSelectedTournament: (league: Tournament) => void;

  allLeagues: League[];
  addLeague: (league: League) => void;

  allTeams: Team[];
  addTeam: (team: Team) => void;
}

const useGlobalStore = create<GlobalStoreState>((set) => ({
  selectedLeague: undefined,
  selectedTournament: undefined,
  allLeagues: [],
  allTeams: [],
  setSelectedLeague: (league?: League) =>
    set(() => ({ selectedLeague: league })),
  setSelectedTournament: (tournament: Tournament) =>
    set(() => ({ selectedTournament: tournament })),
  addLeague: (league: League) =>
    set((state) => ({ allLeagues: [...state.allLeagues, league] })),
  addTeam: (team) => set((state) => ({ allTeams: [...state.allTeams, team] })),
  updateSelectedLeague: (league) => {
    set((state) => {
      if (!state.selectedLeague) return state;

      const updatedLeague = {
        ...state.selectedLeague,
        ...league,
      };
      return {
        selectedLeague: updatedLeague,
        allLeagues: uniqBy([...state.allLeagues, updatedLeague], (c) => c?.id),
      };
    });
  },
}));

export default useGlobalStore;
