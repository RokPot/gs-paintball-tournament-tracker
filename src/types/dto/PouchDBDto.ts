import { DocType } from 'services/pouchDB';

export interface PouchDBDto {
  _id: string;
  _rev?: string;
  docType?: DocType;
}
