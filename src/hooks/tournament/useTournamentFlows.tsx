import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { GameQueries } from 'services/queries/game/GameQueries';
import { GroupQueries } from 'services/queries/group/GroupQueries';
import { LeagueQueries } from 'services/queries/league/LeagueQueries';
import { StageQueries } from 'services/queries/stage/StageQueries';
import { TournamentQueries } from 'services/queries/tournament/TournamentQueries';
import Game from 'types/Game';
import League from 'types/League';
import Tournament from 'types/Tournament';
import { TournamentSettings } from 'types/TournamentSettings';
import TournamentStage from 'types/TournamentStage';
import { TournamentStatus } from 'types/TournamentStatus';
import { snackbarSuccessOptions } from 'utils/snackbarUtils';

const useTournamentFlows = () => {
  const { mutateAsync: addTournament } = TournamentQueries.useAddTournament();
  const { mutateAsync: updateExistingLeagueMutate } =
    LeagueQueries.useUpdateLeague();
  const { invalidateLeaguesList, invalidateSelectedLeague } =
    LeagueQueries.useLeagueInvalidations();
  const { mutateAsync: updateTournament } =
    TournamentQueries.useUpdateTournament();
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: addGames } = GameQueries.useAddGames();
  const { mutateAsync: addGroups } = GroupQueries.useAddGroups();
  const { mutateAsync: addStage } = StageQueries.useAddStage();

  const addNewTournamentToLeague = useCallback(
    async (
      tournament: Tournament,
      league?: League | null,
      selectedLeague?: League,
    ): Promise<League | undefined> => {
      if (!league) {
        return undefined;
      }
      const newTournament = await addTournament(tournament);
      if (!newTournament) {
        return undefined;
      }
      league.tournaments = [...league.tournaments, newTournament];
      await updateExistingLeagueMutate(league);
      await invalidateLeaguesList();
      if (league.id === selectedLeague?.id) {
        await invalidateSelectedLeague();
      }
      enqueueSnackbar('Tournament created', snackbarSuccessOptions);

      return league;
    },
    [
      addTournament,
      enqueueSnackbar,
      invalidateLeaguesList,
      invalidateSelectedLeague,
      updateExistingLeagueMutate,
    ],
  );

  const addStageToTournament = useCallback(
    async (tournament: Tournament, newStage: TournamentStage) => {
      if (!newStage || !tournament) {
        return;
      }
      await addGames(
        newStage.groups.reduce((prev: Game[], curr) => {
          prev.push(...curr.games);
          return prev;
        }, []),
      );
      await addGroups(newStage.groups);
      await addStage(newStage);
      if (!tournament?.stages?.length) {
        tournament.stages = [newStage];
      } else {
        tournament.stages.push(newStage);
      }
      await updateTournament(tournament);

      await invalidateSelectedLeague();
    },
    [addGames, addGroups, addStage, invalidateSelectedLeague, updateTournament],
  );

  const initializeTournament = useCallback(
    async (
      tournament: Tournament,
      initialStage: TournamentStage,
      settings: TournamentSettings,
    ) => {
      if (!tournament) {
        return;
      }
      tournament.settings = settings;
      tournament.state.status = TournamentStatus.initialized;

      await addStageToTournament(tournament, initialStage);
      enqueueSnackbar('Tournament initialized', snackbarSuccessOptions);
    },
    [addStageToTournament, enqueueSnackbar],
  );

  return {
    addNewTournamentToLeague,
    initializeTournament,
    addStageToTournament,
  };
};

export default useTournamentFlows;
