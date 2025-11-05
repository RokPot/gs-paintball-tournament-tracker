/* eslint-disable import/prefer-default-export */
// Using a more lenient type to avoid TypeScript performance issues
// with complex RxJsonSchema type analysis

/**
 * RxDB Schema for Tournament collection
 * Based on TournamentDto structure
 *
 * See: https://rxdb.info/rx-schema.html
 */
export const tournamentSchema = {
  title: 'tournament schema',
  description: 'Tournament document schema for RxDB',
  version: 0,
  type: 'object',
  primaryKey: '_id',
  properties: {
    _id: {
      type: 'string',
      maxLength: 100, // RxDB requirement
    },

    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
      maxLength: 500,
    },
    startDate: {
      type: 'string', // ISO date string
      maxLength: 100,
    },
    endDate: {
      type: 'string', // ISO date string
      maxLength: 100,
    },

    // Arrays
    teamIds: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 100,
      },
      default: [],
    },
    leaderboardTeamIds: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 100,
      },
      default: [],
    },
    stageIds: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 100,
      },
      default: [],
    },

    // Complex objects - stored as JSON objects
    state: {
      type: 'object',
      // TournamentState structure:
      // {
      //   id: string,
      //   isTournamentFinished: boolean,
      //   isGameInProgress: boolean,
      //   status: string (TournamentStatus enum),
      //   stage: number,
      //   activeGameId?: string,
      //   pairedGame1Id?: string,
      //   pairedGame2Id?: string
      // }
    },
    settings: {
      type: 'object',
      // TournamentSettings structure - complex nested object
      // We'll validate at runtime but store as object
    },
    gameSettings: {
      type: 'object',
      // GameSettings structure:
      // {
      //   id: string,
      //   longBreakTimeInSeconds: number,
      //   shortBreakTimeInSeconds: number,
      //   gameTimeInSeconds: number,
      //   betweenGamePauseTimeInSeconds: number,
      //   manualGameStartTimeInSeconds: number
      // }
    },
    schedule: {
      type: 'array',
      items: {
        type: 'object', // TournamentScheduleDto array
      },
      default: [],
    },
    stages: {
      type: 'array',
      items: {
        type: 'object', // TournamentStageDto array (embedded)
        // TournamentStageDto structure:
        // {
        //   id: string,
        //   stage: number,
        //   groupIds: string[],
        //   stageGamesType: object (TournamentType),
        //   schedule?: TournamentScheduleDto[]
        // }
      },
      default: [],
    },
  },
  required: ['id', 'name', 'state', 'settings', 'gameSettings'],
  indexes: [
    'id', // Index for quick lookup by tournament id
    'name', // Index for searching by name
  ],
};
