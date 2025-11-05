/* eslint-disable import/prefer-default-export */
// Using a more lenient type to avoid TypeScript performance issues
// with complex RxJsonSchema type analysis

/**
 * RxDB Schema for ActiveState collection
 * Based on IActiveState structure
 *
 * This collection should always have exactly one row (singleton pattern)
 * using a fixed _id: "active-state"
 *
 * See: https://rxdb.info/rx-schema.html
 */
export const activeStateSchema = {
  title: 'active state schema',
  description: 'Active state document schema for RxDB - singleton collection',
  version: 0,
  type: 'object',
  primaryKey: '_id',
  properties: {
    _id: {
      type: 'string',
      maxLength: 100, // RxDB requirement
    },
    gameId: {
      type: ['string', 'null'],
      maxLength: 100,
    },
    tournamentId: {
      type: ['string', 'null'],
      maxLength: 100,
    },
    leagueId: {
      type: ['string', 'null'],
      maxLength: 100,
    },
  },
  required: [],
  indexes: [
    // No indexes needed - we'll always query by _id (primary key)
  ],
};
