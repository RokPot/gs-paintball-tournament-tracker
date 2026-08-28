/* eslint-disable import/prefer-default-export */

/**
 * RxDB Schema for LeaderboardTeam collection
 * Based on LeaderboardTeamDto structure (without nested team)
 *
 * See: https://rxdb.info/rx-schema.html
 */
export const leaderboardTeamSchema = {
  title: 'leaderboard team schema',
  description: 'Leaderboard team document schema for RxDB',
  version: 0,
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
    totalWins: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    totalLosses: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    totalDraws: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    totalPoints: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    rank: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    previousRank: {
      type: ['number', 'null'],
      minimum: 0,
      multipleOf: 1,
    },
    teamId: {
      type: 'string',
      maxLength: 100,
    },
  },
  required: [
    'id',
    'totalWins',
    'totalLosses',
    'totalDraws',
    'totalPoints',
    'rank',
    'teamId',
  ],
  indexes: ['id', 'teamId'],
};
