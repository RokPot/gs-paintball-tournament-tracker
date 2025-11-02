import { useCallback } from 'react';
import { useRxDB } from 'store/RxDBContext';
import { LeagueDto } from 'types/dto/LeagueDto';
import LeaderboardTeam from 'types/LeadeboardTeam';
import League from 'types/League';
import Team from 'types/Team';
import Tournament from 'types/Tournament';
import useTournamentServiceRxDB from './TournamentServiceRxDB';
/* LeagueService using RxDB
 *
 * This is a parallel implementation to the PouchDB LeagueService.
 *
 * Usage:
 * const { addNewLeague, getLeague } = useLeagueServiceRxDB();
 */
const useLeagueServiceRxDB = () => {
  const { database } = useRxDB();

  // Use RxDB service for populating tournaments
  const { getTournament, getTournaments } = useTournamentServiceRxDB();

  const addNewLeague = useCallback(
    async (league: LeagueDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      // Validate required fields
      if (!league.id || !league.name) {
        throw new Error('Missing required league fields: id or name');
      }

      try {
        // Insert league into RxDB
        const insertedDoc = await database.collections.leagues.insert(league);
        const leagueData = insertedDoc.toMutableJSON();

        // Return as League instance (without population - will be populated on read)
        return new League({
          ...leagueData,
          teams: [],
          tournaments: [],
          leaderboard: [],
        } as any);
      } catch (error: any) {
        if (error.name === 'RxError' && error.code === 'VD2') {
          // Validation error
          throw new Error(`League validation failed: ${error.message}`);
        }
        throw new Error(`Failed to create league: ${error.message}`);
      }
    },
    [database],
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
        // Get existing league document
        const existing = await database.collections.leagues
          .findOne({ selector: { _id: league._id } })
          .exec();

        if (!existing) {
          throw new Error(`League with id ${league._id} not found`);
        }

        // Update the league using incrementalModify
        await existing.incrementalModify((oldData) => ({
          ...oldData,
          ...league,
        }));

        const leagueData = existing.toMutableJSON();

        // Populate related entities
        // This will be populated on read, so return basic structure here
        return new League({
          ...leagueData,
          teams: [],
          tournaments: [],
          leaderboard: [],
        } as any);
      } catch (error: any) {
        if (error.message.includes('not found')) {
          throw error; // Re-throw not found errors as-is
        }
        throw new Error(`Failed to update league: ${error.message}`);
      }
    },
    [database],
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

        // Remove the league
        await leagueDoc.remove();

        return true;
      } catch (error: any) {
        if (error.message.includes('not found')) {
          throw error; // Re-throw not found errors as-is
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
        // Get league - Much simpler than PouchDB!
        const leagueDoc = await database.collections.leagues
          .findOne({ selector: { _id: leagueId } })
          .exec();

        if (!leagueDoc) {
          return null;
        }

        const leagueData = leagueDoc.toMutableJSON();

        // Populate teams from RxDB
        let teams: Team[] = [];
        if (leagueData.teamIds && leagueData.teamIds.length > 0) {
          try {
            // Fetch teams from RxDB using $in selector
            const teamDocs = await database.collections.teams
              .find({
                selector: {
                  _id: { $in: leagueData.teamIds },
                },
              })
              .exec();
            // Convert to Team instances
            teams = teamDocs.map((doc) => {
              const teamData = doc.toMutableJSON();
              return new Team(teamData as any);
            });
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(
              `Failed to populate teams for league ${leagueId}:`,
              error,
            );
            // Continue without teams populated
          }
        }

        // Populate tournaments from RxDB
        let tournaments: Tournament[] = [];
        if (leagueData.tournamentIds && leagueData.tournamentIds.length > 0) {
          try {
            // Fetch tournaments using TournamentServiceRxDB batch function (handles population)
            tournaments = await getTournaments(leagueData.tournamentIds);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(
              `Failed to populate tournaments for league ${leagueId}:`,
              error,
            );
            // Continue without tournaments populated
          }
        }

        // Populate active tournament if specified
        let activeTournament: Tournament | undefined;
        if (leagueData.activeTournamentId) {
          try {
            activeTournament = await getTournament(
              leagueData.activeTournamentId,
            );
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(
              `Failed to populate active tournament for league ${leagueId}:`,
              error,
            );
            // Continue without active tournament populated
          }
        }

        // TODO: Populate leaderboard
        // LeaderboardTeam is a separate document type that references teams
        // For now, return empty array - LeaderboardTeam collection needs to be added later
        // or fetched from a separate service
        const leaderboard: LeaderboardTeam[] = [];

        // Return as League instance
        return new League({
          ...leagueData,
          teams,
          tournaments,
          leaderboard,
          activeTournament,
        } as any);
      } catch (error: any) {
        throw new Error(`Failed to get league: ${error.message}`);
      }
    },
    [database, getTournaments, getTournament],
  );

  const getLeagues = useCallback(async () => {
    if (!database) {
      throw new Error('RxDB database not initialized');
    }

    try {
      // Get all leagues - Much simpler than PouchDB map/reduce!
      const leagueDocs = await database.collections.leagues.find().exec();

      // Convert to League instances and populate related entities
      const leagues = await Promise.all(
        leagueDocs.map(async (doc) => {
          const leagueData = doc.toMutableJSON();

          // Populate teams
          let teams: Team[] = [];
          if (leagueData.teamIds && leagueData.teamIds.length > 0) {
            try {
              const teamDocs = await database.collections.teams
                .find({
                  selector: {
                    _id: { $in: leagueData.teamIds },
                  },
                })
                .exec();
              teams = teamDocs.map((teamDoc) => {
                const teamData = teamDoc.toMutableJSON();
                return new Team(teamData as any);
              });
            } catch (error) {
              // eslint-disable-next-line no-console
              console.warn(
                `Failed to populate teams for league ${leagueData.id}:`,
                error,
              );
            }
          }

          // Populate tournaments
          let tournaments: Tournament[] = [];
          if (leagueData.tournamentIds && leagueData.tournamentIds.length > 0) {
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

          // Populate active tournament if specified
          let activeTournament: Tournament | undefined;
          if (leagueData.activeTournamentId) {
            try {
              activeTournament = await getTournament(
                leagueData.activeTournamentId,
              );
            } catch (error) {
              // eslint-disable-next-line no-console
              console.warn(
                `Failed to populate active tournament for league ${leagueData.id}:`,
                error,
              );
            }
          }

          // TODO: Populate leaderboard (see getLeague for details)
          const leaderboard: LeaderboardTeam[] = [];

          return new League({
            ...leagueData,
            teams,
            tournaments,
            leaderboard,
            activeTournament,
          } as any);
        }),
      );

      return leagues;
    } catch (error: any) {
      throw new Error(`Failed to get leagues: ${error.message}`);
    }
  }, [database, getTournaments, getTournament]);

  const getActiveLeague = useCallback(async () => {
    if (!database) {
      throw new Error('RxDB database not initialized');
    }

    try {
      // Find league where isLeagueSelected is true
      const leagueDoc = await database.collections.leagues
        .findOne({
          selector: {
            isLeagueSelected: true,
          },
        })
        .exec();

      if (!leagueDoc) {
        return null;
      }

      const leagueData = leagueDoc.toMutableJSON();

      // Populate teams
      let teams: Team[] = [];
      if (leagueData.teamIds && leagueData.teamIds.length > 0) {
        try {
          const teamDocs = await database.collections.teams
            .find({
              selector: {
                _id: { $in: leagueData.teamIds },
              },
            })
            .exec();
          teams = teamDocs.map((teamDoc) => {
            const teamData = teamDoc.toMutableJSON();
            return new Team(teamData as any);
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn(
            `Failed to populate teams for active league ${leagueData.id}:`,
            error,
          );
        }
      }

      // Populate tournaments
      let tournaments: Tournament[] = [];
      if (leagueData.tournamentIds && leagueData.tournamentIds.length > 0) {
        try {
          tournaments = await getTournaments(leagueData.tournamentIds);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn(
            `Failed to populate tournaments for active league ${leagueData.id}:`,
            error,
          );
        }
      }

      // Populate active tournament if specified
      let activeTournament: Tournament | undefined;
      if (leagueData.activeTournamentId) {
        try {
          activeTournament = await getTournament(leagueData.activeTournamentId);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn(
            `Failed to populate active tournament for active league ${leagueData.id}:`,
            error,
          );
        }
      }

      // TODO: Populate leaderboard (see getLeague for details)
      const leaderboard: LeaderboardTeam[] = [];

      const league = new League({
        ...leagueData,
        teams,
        tournaments,
        leaderboard,
        activeTournament,
      });

      return league;
    } catch (error: any) {
      throw new Error(`Failed to get active league: ${error.message}`);
    }
  }, [database, getTournaments, getTournament]);

  return {
    addNewLeague,
    updateLeague,
    deleteLeague,
    getLeague,
    getLeagues,
    getActiveLeague,
  };
};

export default useLeagueServiceRxDB;
