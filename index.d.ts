declare module 'react-native-local-mongodb' {
  export interface StorageStatic {
    getItem(
      key: string,
      callback?: (error?: Error | null, result?: string | null) => void
    ): Promise<string | null>;

    setItem(
      key: string,
      value: string,
      callback?: (error?: Error | null) => void
    ): Promise<void>;

    removeItem(
      key: string,
      callback?: (error?: Error | null) => void
    ): Promise<void>;

    // Allow any additional properties
    [key: string]: any;
  }

  export interface Options {
    filename?: string;
    inMemoryOnly?: boolean;
    timestampData?: boolean;
    autoload?: boolean;
    onload?: Function;
    afterSerialization?: Function;
    beforeDeserialization?: Function;
    corruptAlertThreshold?: number;
    compareStrings?: Function;
    storage: StorageStatic;
  }

  export interface IndexOptions {
    fieldName: string;
    unique?: boolean;
    sparse?: boolean;
    expireAfterSeconds?: number;
  }

  export interface UpdateOptions {
    multi?: boolean;
    upsert?: boolean;
    returnUpdatedDocs?: boolean;
  }

  export interface RemoveOptions {
    multi?: boolean;
  }

  export interface MongoDocument {
    _id?: string;
    [key: string]: any;
  }

  export type SortOrder = 1 | -1;
  export type SortQuery = Record<string, SortOrder>;
  // callback result can be undefined when having error
  export type ExecCallback<T> = (err: Error | null, result?: T) => void;

  export interface Cursor<T> {
    exec(): Promise<T>;

    exec(callback: ExecCallback<T>): void;

    skip(value: number): Cursor<T>;

    limit(value: number): Cursor<T>;

    sort(sortQuery: SortQuery): Cursor<T>;
  }

  export type Query = object;
  export type UpdateQuery = object;
  export type Projection = object;
  export type EnsureIndexCallback = (err: Error | null) => void;
  export type RemoveIndexCallback = (err: Error | null) => void;
  export type GetCandidatesCallback<T> = (
    err: Error | null,
    candidates?: T[]
  ) => void;
  export type InsertCallback<T> = (err: Error | null, insertedDoc?: T) => void;
  export type CountCallback = (err: Error | null, count?: number) => void;
  export type FindCallback<T> = (err: Error | null, docs?: T[]) => void;
  export type FindOneCallback<T> = (err: Error | null, doc?: T | null) => void; // doc can be null when not found
  export type UpdateCallback<T> = (
    err: Error | null,
    numAffected?: number,
    affectedDocuments?: T | T[] | null,
    upsert?: boolean
  ) => void;
  export type RemoveCallback = (err: Error | null, numRemoved?: number) => void;

  export default class Datastore<T = MongoDocument> {
    constructor(options?: Options);

    public loadDatabase(): void;

    public getAllData(): T[];

    public resetIndexes(newData?: T | T[]): void;

    public ensureIndex(
      options: IndexOptions,
      callback?: EnsureIndexCallback
    ): void;

    public removeIndex(fieldName: string, callback?: RemoveIndexCallback): void;

    public addToIndexes(doc: T): void;

    public removeFromIndexes(doc: T): void;

    public updateIndexes(pairs: Array<{ oldDoc: T; newDoc: T }>): void;
    public updateIndexes(oldDoc: T, newDoc: T): void;

    public getCandidates(
      query: Query,
      dontExpireStaleDocs: boolean,
      callback?: GetCandidatesCallback<T>
    ): void;

    public insert(newDoc: T, callback?: InsertCallback<T>): void;

    public createNewId(): number;

    public count(query: Query): Cursor<number>;
    public count(query: Query, callback: CountCallback): void;

    public find(query: Query): Cursor<T[]>;
    public find(query: Query, projection: Projection): Cursor<T[]>;
    public find(
      query: Query,
      projection: Projection,
      callback: FindCallback<T>
    ): void;

    public findOne(query: Query): Cursor<T | null>;
    public findOne(query: Query, projection: Projection): Cursor<T | null>;
    public findOne(
      query: Query,
      projection: Projection,
      callback: FindOneCallback<T>
    ): void;

    public update(
      query: Query,
      updateQuery: UpdateQuery,
      options?: UpdateOptions,
      callback?: UpdateCallback<T>
    ): void;

    public remove(
      query: Query,
      options?: RemoveOptions,
      callback?: RemoveCallback
    ): void;

    public loadDatabaseAsync(): Promise<void>;

    public findAsync(query: Query): Promise<T[]>;

    public findOneAsync(query: Query): Promise<T | null>;

    public insertAsync(newDoc: T): Promise<T>;

    public updateAsync(
      query: Query,
      updateQuery: UpdateQuery,
      options?: UpdateOptions
    ): Promise<number>;

    public removeAsync(query: Query, options?: RemoveOptions): Promise<number>;
  }
}
