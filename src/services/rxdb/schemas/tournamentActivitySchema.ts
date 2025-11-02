/* eslint-disable import/prefer-default-export */
// Using a more lenient type to avoid TypeScript performance issues
// with complex RxJsonSchema type analysis

/**
 * RxDB Schema for TournamentActivity collection
 * Based on TournamentActivityDto structure
 *
 * See: https://rxdb.info/rx-schema.html
 */
// Note: Schema omits _rev and docType (PouchDB fields) - RxDB doesn't need them
export const tournamentActivitySchema = {
  title: 'tournament activity schema',
  description: 'Tournament activity document schema for RxDB',
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
    tournamentId: {
      type: 'string',
      maxLength: 100,
    },
    gameId: {
      type: 'string',
      maxLength: 100,
    },
    stage: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
    },
    changeType: {
      type: 'string',
      maxLength: 50,
      // ActivityChangeType enum: 'MatchFinished' | 'GameEdited'
    },
    previousTeam1Wins: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    previousTeam2Wins: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    nextTeam1Wins: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    nextTeam2Wins: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    gameTime: {
      type: ['number', 'null'],
      minimum: 0,
      multipleOf: 1,
    },
    updatedAt: {
      type: 'string', // ISO date string
      maxLength: 100,
    },
    match: {
      type: 'object',
      // Match structure:
      // {
      //   id: string,
      //   matchState: MatchState,
      //   team1Margin: number,
      //   team2Margin: number,
      //   matchDurationInSeconds: number
      // }
    },
  },
  required: [
    'id',
    'tournamentId',
    'gameId',
    'changeType',
    'stage',
    'updatedAt',
  ],
  indexes: [
    'id', // Index for quick lookup by activity id
    'tournamentId', // Index for filtering activities by tournament
    'gameId', // Index for filtering activities by game
    'updatedAt', // Index for sorting by date
  ],
};
