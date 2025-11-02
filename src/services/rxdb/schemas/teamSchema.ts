/* eslint-disable import/prefer-default-export */
// Using a more lenient type to avoid TypeScript performance issues
// with complex RxJsonSchema type analysis

/**
 * RxDB Schema for Team collection
 * Based on TeamDto structure
 *
 * See: https://rxdb.info/rx-schema.html
 */
// Note: Schema omits _rev and docType (PouchDB fields) - RxDB doesn't need them
export const teamSchema = {
  title: 'team schema',
  description: 'Team document schema for RxDB',
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
    teamName: {
      type: 'string',
      maxLength: 100,
    },
    teamTag: {
      type: 'string',
      maxLength: 50,
    },
    wins: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    loses: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    draw: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
      default: 0,
    },
    color: {
      type: 'string',
      maxLength: 50, // Hex color code
    },
    // Members array - complex nested objects
    members: {
      type: 'array',
      items: {
        type: 'object',
        // TeamMember structure:
        // {
        //   name: string,
        //   email?: string,
        //   phone?: string,
        //   // ... other fields
        // }
      },
      default: [],
    },
  },
  required: ['id', 'teamName', 'teamTag', 'wins', 'loses', 'draw'],
  indexes: [
    'id', // Index for quick lookup by team id
    'teamName', // Index for searching by name
    'teamTag', // Index for searching by tag
    // Note: docType not indexed - not needed since collection already separates document types
  ],
};
