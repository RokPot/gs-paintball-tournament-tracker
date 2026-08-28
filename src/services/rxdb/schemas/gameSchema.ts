/* eslint-disable import/prefer-default-export */

/**
 * RxDB Schema for Game collection
 * Based on GameDto structure
 *
 * See: https://rxdb.info/rx-schema.html
 */
export const gameSchema = {
  title: 'game schema',
  description: 'Game document schema for RxDB',
  version: 3,
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
    team1Id: {
      type: 'string',
      maxLength: 100,
    },
    team2Id: {
      type: 'string',
      maxLength: 100,
    },
    matches: {
      type: 'array',
      items: {
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
      default: [],
    },
    gameState: {
      type: 'string',
      maxLength: 50,
      // GameState enum: 'created' | 'inProgress' | 'finished' | etc.
    },
    team1Wins: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    team2Wins: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    bracketProperties: {
      type: ['object', 'null'],
      // BracketProperties structure:
      // {
      //   round: number,
      //   roundGameNumber: number,
      //   winnerNextRoundGameNumber: number,
      //   loserNextRoundGameNumber?: number,
      //   previousLayerGame1Number?: number,
      //   previousLayerGame2Number?: number,
      //   isFirstPlaceGame?: boolean,
      //   isThridPlaceGame?: boolean,
      //   bye: boolean
      // }
    },
    gameTime: {
      type: 'number',
      minimum: 0,
      multipleOf: 0.1,
      default: 0,
    },
    gameWinner: {
      type: 'string',
      maxLength: 50,
      // GameWinner enum: 'notYet' | 'team1' | 'team2' | 'draw'
    },
  },
  required: ['id', 'team1Id', 'team2Id', 'gameState', 'gameWinner'],
  indexes: [
    'id', // Index for quick lookup by game id
    'team1Id', // Index for finding games by team
    'team2Id', // Index for finding games by team
    'gameState', // Index for filtering by game state
  ],
};
