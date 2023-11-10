import { uniqBy } from 'lodash';
import { LeaderboardTeam } from 'types/LeadeboardTeam';
import { League } from 'types/League';
import { Team } from 'types/Team';
import { v4 } from 'uuid';
import { create } from 'zustand';

interface LeagueStoreState {
  selectedLeague?: League;
  setSelectedLeague: (league?: League) => void;
  addTeamToLeague: (league: League, team: Team) => void;
  refreshSelectedLeague: (league: League) => void;
  updateSelectedLeague: (league: League) => void;
  allLeagues: League[];
  setLeagues: (leagues?: League[]) => void;
  addLeague: (league: League) => void;
  updateLeague: (league: League) => void;
}

export const createNewLeaderboardTeam = (team: Team) => {
  const id = v4();
  return new LeaderboardTeam({
    _id: id,
    id: id,
    team,
    rank: 0,
    totalLosses: 0,
    totalPoints: 0,
    totalWins: 0,
    previousRank: 0,
  });
};

const useLeagueStore = create<LeagueStoreState>((set, get) => ({
  selectedLeague: undefined,
  selectedTournament: undefined,
  allLeagues: [],
  allTeams: [],
  refreshSelectedLeague: (league: League) =>
    set((state) => ({
      selectedLeague:
        state.selectedLeague?.id === league.id ? league : undefined,
    })),
  setLeagues: (leagues?: League[]) =>
    set(() => ({ allLeagues: leagues || [] })),
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

  addLeague: (league: League) => {
    (league.leaderboard = [
      ...league.teams.map((team) => {
        return createNewLeaderboardTeam(team);
      }),
    ]),
      set((state) => ({ allLeagues: [...state.allLeagues, league] }));
  },
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

      leagues[leagueToUdpdateIndex] = updatedLeague;
      if (state.selectedLeague && league.id === state.selectedLeague.id) {
        get().refreshSelectedLeague(updatedLeague);
      }
      return {
        allLeagues: leagues,
        selectedLeague: state.selectedLeague
          ? league.id === state.selectedLeague.id
            ? updatedLeague
            : state.selectedLeague
          : undefined,
      };
    }),
  addTeamToLeague: (leagueToUpdate, teamToAdd) => {
    const state = get();
    const selectedLeague = state.allLeagues.find(
      (league) => league.id === leagueToUpdate.id
    );
    if (!selectedLeague) {
      return state;
    }
    leagueToUpdate.addTeam(teamToAdd);
    leagueToUpdate.addLeaderboardTeam(createNewLeaderboardTeam(teamToAdd));

    const updatedLeague = { ...selectedLeague, ...leagueToUpdate };
    if (state.selectedLeague && leagueToUpdate.id === state.selectedLeague.id) {
      state.refreshSelectedLeague(updatedLeague);
    }
    state.updateLeague(updatedLeague);
  },
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

export default useLeagueStore;
