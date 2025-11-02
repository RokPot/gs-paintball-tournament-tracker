/* eslint-disable import/prefer-default-export */
// Using a more lenient type to avoid TypeScript performance issues
// with complex RxJsonSchema type analysis

/**
 * RxDB Schema for TournamentStage collection
 * Based on TournamentStageDto structure
 *
 * See: https://rxdb.info/rx-schema.html
 */
// Note: Schema omits _rev and docType (PouchDB fields) - RxDB doesn't need them
export const tournamentStageSchema = {
  title: 'tournament stage schema',
  description: 'Tournament stage document schema for RxDB',
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
    stage: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
    },

    stageGamesType: {
      type: 'object',
      // TournamentType structure:
      // {
      //   type: string (TournamentTypeEnum),
      //   settings: {
      //     numberOfWinsRequired: number,
      //     firstPlaceNumberOfWinsRequired: number,
      //     thirdPlaceNumberOfWinsRequired: number
      //   }
      // }
    },
    schedule: {
      type: 'array',
      items: {
        type: 'object',
        // TournamentScheduleDto structure:
        // {
        //   id: string,
        //   gameNumber: number,
        //   groupId: string,
        //   gameId: string,
        //   index: number,
        //   pairedGameId: string
        // }
      },
      default: [],
    },
    groups: {
      type: 'array',
      items: {
        type: 'object', // TournamentGroupDto array (embedded)
        // TournamentGroupDto structure:
        // {
        //   id: string,
        //   groupIndex: number,
        //   teamIds: string[],
        //   gameIds: string[],
        //   groupType: object (TournamentType),
        //   stage: number,
        //   settings?: object (TournamentGroupSettings)
        // }
      },
      default: [],
    },
  },
  required: ['id', 'stage', 'stageGamesType'],
  indexes: [
    'id', // Index for quick lookup by stage id
    'stage', // Index for sorting/filtering by stage number
  ],
};
