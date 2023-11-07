export class IPouchDB {
  _id: string;
  _rev?: string;
  docType?: string;

  constructor(id: string, rev?: string, docType?: string) {
    this._id = id;
    this._rev = rev;
    this.docType = docType;
  }
}
