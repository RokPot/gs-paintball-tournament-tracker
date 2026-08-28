import { useCallback } from 'react';
import { toPersistedLeaderboardTeam } from 'services/rxdb/database';
import { useRxDB } from 'store/RxDBContext';
import { LeagueDto } from 'types/dto/LeagueDto';
import LeaderboardTeam from 'types/LeadeboardTeam';
import League from 'types/League';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import useTournamentServiceRxDB from './TournamentServiceRxDB';

const toPersistedLeague = (league: LeagueDto) => ({
  _id: league._id,
  id: league.id,
  name: league.name,
  createdAt: league.createdAt || new Date().toISOString(),
  teamIds: league.teamIds || [],
  tournamentIds: league.tournamentIds || [],
  leaderboardTeamIds: league.leaderboardTeamIds || [],
  activeTournamentId: league.activeTournamentId || null,
});

const useLeagueServiceRxDB = () => {
  const { database } = useRxDB();
  const { getTournament, getTournaments } = useTournamentServiceRxDB();

  const persistLeaderboardTeams = useCallback(
    async (league: LeagueDto) => {
      if (!database || !league.leaderboard?.length) {
        return;
      }

      await Promise.all(
        league.leaderboard.map(async (leaderboardTeam) => {
          const stored = toPersistedLeaderboardTeam(leaderboardTeam);
          const existing = await database.collections.leaderboardTeams
            .findOne({ selector: { _id: stored._id } })
            .exec();
          if (existing) {
            await existing.incrementalModify((oldData: any) => ({
              ...oldData,
              ...stored,
            }));
            return;
          }
          await database.collections.leaderboardTeams.insert(stored);
        }),
      );
    },
    [database],
  );

  const populateLeaderboard = useCallback(
    async (leaderboardTeamIds?: string[]) => {
      if (!database || !leaderboardTeamIds?.length) {
        return [];
      }

      const leaderboardDocs = await database.collections.leaderboardTeams
        .find({
          selector: {
            _id: { $in: leaderboardTeamIds },
          },
        })
        .exec();

      const teamIds = leaderboardDocs
        .map((doc: any) => doc.toMutableJSON().teamId)
        .filter(Boolean);

      const teamDocs =
        teamIds.length > 0
          ? await database.collections.teams
              .find({
                selector: {
                  _id: { $in: teamIds },
                },
              })
              .exec()
          : [];

      const teamsById = new Map(
        teamDocs.map((doc: any) => {
          const teamData = doc.toMutableJSON();
          return [teamData._id, new Team(teamData as any)];
        }),
      );

      return leaderboardDocs
        .map((doc: any) => {
          const leaderboardData = doc.toMutableJSON();
          const team = teamsById.get(leaderboardData.teamId);
          if (!team) {
            return null;
          }
          return new LeaderboardTeam({
            ...leaderboardData,
            team,
          } as any);
        })
        .filter((item: LeaderboardTeam | null): item is LeaderboardTeam => !!item);
    },
    [database],
  );

  const populateLeague = useCallback(
    async (leagueData: LeagueDto) => {
      let teams: Team[] = [];
      if (leagueData.teamIds?.length) {
        try {
          const teamDocs = await database!.collections.teams
            .find({
              selector: {
                _id: { $in: leagueData.teamIds },
              },
            })
            .exec();
          teams = teamDocs.map((doc: any) => new Team(doc.toMutableJSON() as any));
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn(
            `Failed to populate teams for league ${leagueData.id}:`,
            error,
          );
        }
      }

      let tournaments: Tournament[] = [];
      if (leagueData.tournamentIds?.length) {
        try {
          tournaments = await getTournaments(leagueData.tournamentIds);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn(
            `Failed to populate tournaments for league ${leagueData.id}:`,
            error,
          );
        }
      }

      let activeTournament: Tournament | undefined;
      if (leagueData.activeTournamentId) {
        try {
          activeTournament = await getTournament(leagueData.activeTournamentId);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn(
            `Failed to populate active tournament for league ${leagueData.id}:`,
            error,
          );
        }
      }

      const leaderboard = await populateLeaderboard(
        leagueData.leaderboardTeamIds,
      );

      return new League({
        ...leagueData,
        teams,
        tournaments,
        leaderboard,
        activeTournament,
      } as any);
    },
    [database, getTournament, getTournaments, populateLeaderboard],
  );

  const addNewLeague = useCallback(
    async (league: LeagueDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!league.id || !league.name) {
        throw new Error('Missing required league fields: id or name');
      }

      try {
        await persistLeaderboardTeams(league);
        const insertedDoc = await database.collections.leagues.insert(
          toPersistedLeague(league),
        );
        return populateLeague(insertedDoc.toMutableJSON());
      } catch (error: any) {
        if (error.name === 'RxError' && error.code === 'VD2') {
          throw new Error(`League validation failed: ${error.message}`);
        }
        throw new Error(`Failed to create league: ${error.message}`);
      }
    },
    [database, persistLeaderboardTeams, populateLeague],
  );

  const updateLeague = useCallback(
    async (league: LeagueDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!league._id) {
        throw new Error('League _id is required for update');
      }

      try {
        const existing = await database.collections.leagues
          .findOne({ selector: { _id: league._id } })
          .exec();

        if (!existing) {
          throw new Error(`League with id ${league._id} not found`);
        }

        await persistLeaderboardTeams(league);
        await existing.incrementalModify((oldData: any) => ({
          ...oldData,
          ...toPersistedLeague(league),
          createdAt: oldData.createdAt || league.createdAt,
        }));

        return populateLeague(existing.toMutableJSON());
      } catch (error: any) {
        if (error.message.includes('not found')) {
          throw error;
        }
        throw new Error(`Failed to update league: ${error.message}`);
      }
    },
    [database, persistLeaderboardTeams, populateLeague],
  );

  const deleteLeague = useCallback(
    async (league: LeagueDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!league._id) {
        throw new Error('League _id is required for deletion');
      }

      try {
        const leagueDoc = await database.collections.leagues
          .findOne({ selector: { _id: league._id } })
          .exec();

        if (!leagueDoc) {
          throw new Error(`League with id ${league._id} not found`);
        }

        if (league.leaderboardTeamIds?.length) {
          const leaderboardDocs = await database.collections.leaderboardTeams
            .find({
              selector: { _id: { $in: league.leaderboardTeamIds } },
            })
            .exec();
          await Promise.all(leaderboardDocs.map((doc: any) => doc.remove()));
        }

        await leagueDoc.remove();
        return true;
      } catch (error: any) {
        if (error.message.includes('not found')) {
          throw error;
        }
        throw new Error(`Failed to delete league: ${error.message}`);
      }
    },
    [database],
  );

  const getLeague = useCallback(
    async (leagueId: string) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!leagueId) {
        throw new Error('League ID is required');
      }

      try {
        const leagueDoc = await database.collections.leagues
          .findOne({ selector: { _id: leagueId } })
          .exec();

        if (!leagueDoc) {
          return null;
        }

        return populateLeague(leagueDoc.toMutableJSON());
      } catch (error: any) {
        throw new Error(`Failed to get league: ${error.message}`);
      }
    },
    [database, populateLeague],
  );

  const getLeagues = useCallback(async () => {
    if (!database) {
      throw new Error('RxDB database not initialized');
    }

    try {
      const leagueDocs = await database.collections.leagues.find().exec();
      return Promise.all(
        leagueDocs.map((doc: any) => populateLeague(doc.toMutableJSON())),
      );
    } catch (error: any) {
      throw new Error(`Failed to get leagues: ${error.message}`);
    }
  }, [database, populateLeague]);

  return {
    addNewLeague,
    updateLeague,
    deleteLeague,
    getLeague,
    getLeagues,
  };
};

export default useLeagueServiceRxDB;
