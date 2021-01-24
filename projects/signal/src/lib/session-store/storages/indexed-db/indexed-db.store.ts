import { Storage } from '../../storage';
import {DB_NAME, DB_VERSION, OBJECT_STORE_NAME} from './indexed-db.constants';

export class IndexedDBStorage implements Storage {

  private readonly databaseResolvingPromise: Promise<IDBDatabase>;

  constructor() {
    const request: IDBOpenDBRequest = window.indexedDB.open(
      DB_NAME,
      DB_VERSION
    );
    request.onupgradeneeded = (e) => {
      const database: IDBDatabase = (e.target as any).result;
      database?.createObjectStore(OBJECT_STORE_NAME);
    };
    this.databaseResolvingPromise = new Promise((resolve, reject) => {
      request.onsuccess = (e) => {
        resolve((e.target as any).result);
      };
      request.onerror = (_) => {
        reject('Unable to Open Database.');
      };
    });
  }

  private async getObjectStore(mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    const database: IDBDatabase = await this.databaseResolvingPromise;
    const transaction = database.transaction(OBJECT_STORE_NAME, mode);
    return transaction.objectStore(OBJECT_STORE_NAME);
  }

  async load(key: string): Promise<IDBDatabase> {
    const objectStore = await this.getObjectStore('readonly');
    return new Promise((resolve, reject) => {
      const request = objectStore.get(key);
      request.onsuccess = (e) => {
        resolve((e.target as any).result);
      };
      request.onerror = (_) => {
        reject('Error Occurred while fetching data');
      };
    });
  }
  async remove(key: string): Promise<void> {
    const objectStore = await this.getObjectStore('readwrite');
    objectStore.delete(key);
  }
  async save(key: string, data: object): Promise<void> {
    const objectStore = await this.getObjectStore('readwrite');
    objectStore.add(data, key);
  }
}

export default IndexedDBStorage;
