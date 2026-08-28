declare module 'rxdb' {
  export const addRxPlugin: any;
  export const createRxDatabase: any;
  export type RxCollection<T = any> = any;
  export type RxDatabase<T = any> = any;
}

declare module 'rxdb/plugins/migration-schema' {
  export const RxDBMigrationSchemaPlugin: any;
}

declare module 'rxdb/plugins/dev-mode' {
  export const RxDBDevModePlugin: any;
}

declare module 'rxdb/plugins/storage-dexie' {
  export const getRxStorageDexie: any;
}

declare module 'rxdb/plugins/validate-z-schema' {
  export const wrappedValidateZSchemaStorage: (options: { storage: any }) => any;
}
