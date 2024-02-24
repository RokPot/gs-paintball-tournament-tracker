import { DocType } from 'types/interfaces/IPouchDB';

export interface PouchDBDto {
  _id: string;
  _rev?: string;
  docType?: DocType;
}
