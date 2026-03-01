import DataStore, { MongoDocument } from 'react-native-local-mongodb';
import { AsyncStorage } from './reactNativeMock';

export const getDb = async <T = MongoDocument>(): Promise<DataStore<T>> => {
  AsyncStorage.__reset();
  const db = new DataStore<T>({
    filename: 'foo',
    storage: AsyncStorage,
  });
  await db.loadDatabaseAsync();
  return db;
};
