import { useCallback } from 'react';
import { toPersistedLeaderboardTeam } from 'services/rxdb/database';
import { useRxDB } from 'store/RxDBContext';
import LeaderboardTeam from 'types/LeadeboardTeam';
import Team from 'types/Team';
import { LeaderboardTeamDto } from 'types/dto/LeaderboardTeamDto';
import { TeamDto } from 'types/dto/TeamDto';
import { sortTeamsByCreatedAt } from 'utils/teamUtils';

/**
 * TeamService using RxDB
 *
 * Usage:
 * const { addNewTeam, getTeam } = useTeamServiceRxDB();
 */
const useTeamServiceRxDB = () => {
  const { database } = useRxDB();

  const addNewTeam = useCallback(
    async (team: TeamDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      // Validate required fields
      if (!team.id || !team.teamName || !team.teamTag) {
        throw new Error(
          'Missing required team fields: id, teamName, or teamTag',
        );
      }

      try {
        // Insert team into RxDB (insert returns the document)
        const insertedDoc = await database.collections.teams.insert(team);
        const teamData = insertedDoc.toMutableJSON();

        // Return as Team instance
        return new Team({
          ...teamData,
        } as any);
      } catch (error: any) {
        if (error.name === 'RxError' && error.code === 'VD2') {
          // Validation error
          throw new Error(`Team validation failed: ${error.message}`);
        }
        throw new Error(`Failed to create team: ${error.message}`);
      }
    },
    [database],
  );

  const updateTeam = useCallback(
    async (team: TeamDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!team._id) {
        throw new Error('Team _id is required for update');
      }

      try {
        // Get existing team document
        const existing = await database.collections.teams
          .findOne({ selector: { _id: team._id } })
          .exec();

        if (!existing) {
          throw new Error(`Team with id ${team._id} not found`);
        }

        // Update the team using incrementalModify
        await existing.incrementalModify((oldData: any) => ({
          ...oldData,
          ...team,
          createdAt: oldData.createdAt || team.createdAt,
        }));

        const teamData = existing.toMutableJSON();

        return new Team({
          ...teamData,
        } as any);
      } catch (error: any) {
        if (error.message.includes('not found')) {
          throw error; // Re-throw not found errors as-is
        }
        throw new Error(`Failed to update team: ${error.message}`);
      }
    },
    [database],
  );

  const deleteTeam = useCallback(
    async (team: TeamDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!team._id) {
        throw new Error('Team _id is required for deletion');
      }

      try {
        const teamDoc = await database.collections.teams
          .findOne({ selector: { _id: team._id } })
          .exec();

        if (!teamDoc) {
          throw new Error(`Team with id ${team._id} not found`);
        }

        // Remove the team
        await teamDoc.remove();

        return true;
      } catch (error: any) {
        if (error.message.includes('not found')) {
          throw error; // Re-throw not found errors as-is
        }
        throw new Error(`Failed to delete team: ${error.message}`);
      }
    },
    [database],
  );

  const getTeam = useCallback(
    async (teamId: string) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      if (!teamId) {
        throw new Error('Team ID is required');
      }

      try {
        const teamDoc = await database.collections.teams
          .findOne({ selector: { _id: teamId } })
          .exec();

        if (!teamDoc) {
          return null;
        }

        const teamData = teamDoc.toMutableJSON();

        // Return as Team instance
        return new Team({
          ...teamData,
        } as any);
      } catch (error: any) {
        throw new Error(`Failed to get team: ${error.message}`);
      }
    },
    [database],
  );

  const getTeams = useCallback(
    async (teamIds?: string[]) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      try {
        // Build selector - if teamIds provided, filter by them
        // Query by id (indexed field) since teamIds arrays typically contain id values
        const selector: any = {};
        if (teamIds && teamIds.length > 0) {
          selector.id = { $in: teamIds };
        }

        // No need to filter by docType - collection already contains only teams!
        const teamDocs = await database.collections.teams
          .find({ selector })
          .exec();

        // Convert to Team instances
        const teams = teamDocs.map((doc: any) => {
          const teamData = doc.toMutableJSON();

          return new Team({
            ...teamData,
          } as any);
        });

        return sortTeamsByCreatedAt(teams);
      } catch (error: any) {
        throw new Error(`Failed to get teams: ${error.message}`);
      }
    },
    [database],
  );

  const addNewLeaderboardTeam = useCallback(
    async (leaderboardTeam: LeaderboardTeamDto) => {
      if (!database) {
        throw new Error('RxDB database not initialized');
      }

      const stored = toPersistedLeaderboardTeam(leaderboardTeam);
      if (!stored.id || !stored.teamId) {
        throw new Error('Missing required leaderboard team fields');
      }

      const insertedDoc =
        await database.collections.leaderboardTeams.insert(stored);
      const data = insertedDoc.toMutableJSON();
      const team = leaderboardTeam.team
        ? new Team(leaderboardTeam.team as any)
        : await getTeam(stored.teamId);

      return new LeaderboardTeam({
        ...data,
        team: team || ({} as any),
      } as any);
    },
    [database, getTeam],
  );

  return {
    addNewTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    getTeams,
    addNewLeaderboardTeam,
  };
};

export default useTeamServiceRxDB;
