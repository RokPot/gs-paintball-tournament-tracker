import { Team } from 'types/Team';
import { create } from 'zustand';

interface TeamStoreState {
  allTeams: Team[];
  addTeam: (team: Team) => void;
  setAllTeams: (teams: Team[]) => void;
}

const useTeamStore = create<TeamStoreState>((set, get) => ({
  allTeams: [],
  addTeam: (team) => set((state) => ({ allTeams: [...state.allTeams, team] })),
  setAllTeams: (teams) => set(() => ({ allTeams: [...teams] })),
}));

export default useTeamStore;
