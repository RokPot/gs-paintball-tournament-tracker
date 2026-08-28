/* eslint-disable import/prefer-default-export */
// Using a more lenient type to avoid TypeScript performance issues
// with complex RxJsonSchema type analysis

/**
 * RxDB Schema for League collection
 * Based on LeagueDto structure
 *
 * See: https://rxdb.info/rx-schema.html
 */
export const leagueSchema = {
  title: 'league schema',
  description: 'League document schema for RxDB',
  version: 4,
  type: 'object',
  primaryKey: '_id',
  properties: {
    _id: {
      type: 'string',
      maxLength: 100,
    },
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
      maxLength: 500,
    },
    createdAt: {
      type: 'string',
      maxLength: 100,
    },
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
    activeTournamentId: {
      type: ['string', 'null'],
      maxLength: 100,
    },
  },
  required: ['id', 'name', 'createdAt'],
  indexes: ['id', 'name', 'createdAt'],
};
