import { uniqBy } from 'lodash';
import { League } from 'types/League';
import { Team } from 'types/Team';
import { Tournament } from 'types/Tournament';
import { create } from 'zustand';

interface GlobalStoreState {
  selectedLeague?: League;
  setSelectedLeague: (league?: League) => void;
  updateSelectedLeague: (league: League) => void;

  allLeagues: League[];
  addLeague: (league: League) => void;
  updateLeague: (league: League) => void;

  selectedTournament?: Tournament;
  setSelectedTournament: (league: Tournament) => void;

  allTeams: Team[];
  addTeam: (team: Team) => void;
}

const useGlobalStore = create<GlobalStoreState>((set, get) => ({
  selectedLeague: undefined,
  selectedTournament: undefined,
  allLeagues: [],
  allTeams: [],
  setSelectedLeague: (league?: League) =>
    set((state) => {
      if (state.selectedLeague) {
        get().updateLeague({
          ...state.selectedLeague,
          isLeagueSelected: false,
        });
      }
      if (league) {
        get().updateLeague({ ...league, isLeagueSelected: true });
      }
      return { selectedLeague: league };
    }),
  setSelectedTournament: (tournament: Tournament) =>
    set(() => ({ selectedTournament: tournament })),
  addLeague: (league: League) =>
    set((state) => ({ allLeagues: [...state.allLeagues, league] })),
  addTeam: (team) => set((state) => ({ allTeams: [...state.allTeams, team] })),
  updateLeague: (league) =>
    set((state) => {
      const leagueToUdpdateIndex = state.allLeagues.findIndex(
        (lg) => league.id === lg.id
      );
      if (leagueToUdpdateIndex < 0) return state;
      let leagues = [...state.allLeagues];

      const updatedLeague: League = {
        ...leagues[leagueToUdpdateIndex],
        ...league,
      };
      console.log(
        updatedLeague,
        uniqBy([...state.allLeagues, updatedLeague], (c) => c?.id)
      );
      leagues[leagueToUdpdateIndex] = updatedLeague;
      return {
        allLeagues: leagues,
      };
    }),
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
