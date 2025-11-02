/* eslint-disable import/prefer-default-export */
// Using a more lenient type to avoid TypeScript performance issues
// with complex RxJsonSchema type analysis

/**
 * RxDB Schema for League collection
 * Based on LeagueDto structure
 *
 * See: https://rxdb.info/rx-schema.html
 */
// Note: Schema omits _rev and docType (PouchDB fields) - RxDB doesn't need them
export const leagueSchema = {
  title: 'league schema',
  description: 'League document schema for RxDB',
  version: 0, // Bumped version: Changed isLeagueSelected from nullable to required boolean
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
    // Arrays
    teamIds: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 100,
      },
      default: [],
    },
    tournamentIds: {
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
    // Optional fields
    isLeagueSelected: {
      type: 'boolean',
      default: false,
    },
    activeTournamentId: {
      type: ['string', 'null'],
      maxLength: 100,
    },
  },
  required: ['id', 'name'],
  indexes: [
    'id', // Index for quick lookup by league id
    'name', // Index for searching by name
    // Note: isLeagueSelected not indexed - boolean fields don't need indexes, and Dexie has issues with boolean indexes
  ],
};
