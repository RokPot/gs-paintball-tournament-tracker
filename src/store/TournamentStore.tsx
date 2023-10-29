import { Tournament } from 'types/Tournament';
import { create } from 'zustand';

interface TournamentStoreState {
  selectedTournament?: Tournament;
  setSelectedTournament: (league: Tournament) => void;
}

const useTournamentStore = create<TournamentStoreState>((set, get) => ({
  selectedTournament: undefined,

  setSelectedTournament: (tournament: Tournament) =>
    set(() => ({ selectedTournament: tournament })),
}));

export default useTournamentStore;
