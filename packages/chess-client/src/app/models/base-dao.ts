import { IndexedDBStores, INDEXED_DB_NAME, INDEXED_DB_VERSION } from '../config';

export default abstract class BaseDao<T> {
  private response: IDBDatabase | undefined;

  private readonly objectStorename: string;

  private readonly keyPath?: string;

  private readonly key: number | undefined;

  constructor(objectStorename: string, keyPath?: string, key?: number) {
    this.objectStorename = objectStorename;
    this.keyPath = keyPath;
    this.key = key;
    this.createStores();
  }

  createStores(): void {
    const openRequest = window.indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION + 1);
    openRequest.onupgradeneeded = () => {
      this.response = openRequest.result;
      this.response.createObjectStore(IndexedDBStores.USERS, {
        keyPath: 'name',
        autoIncrement: true,
      });
      this.response.createObjectStore(IndexedDBStores.GAME_CONFIG, {
        autoIncrement: true,
      });
      this.response.createObjectStore(IndexedDBStores.REPLAY_STORE, {
        keyPath: 'date',
        autoIncrement: true,
      });
      this.response.close();
    };
  }

  create(entity: T): void {
    const openRequest = window.indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION + 1);
    openRequest.onupgradeneeded = () => {
      this.response = openRequest.result;
      this.response.createObjectStore(this.objectStorename, {
        keyPath: this.keyPath,
        autoIncrement: true,
      });
    };
    openRequest.onsuccess = () => {
      this.response = openRequest.result;
      const item = this.response
        .transaction([this.objectStorename], 'readwrite')
        .objectStore(this.objectStorename)
        .put(entity, this.key);
      item.onsuccess = () => {
        this.response?.close();
      };
    };
  }

  public async findAll(): Promise<T[]> {
    const openRequest = window.indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION + 1);
    const list: T[] = [];
    return new Promise<T[]>((resolve, reject) => {
      openRequest.onerror = () => {
        reject();
      };
      openRequest.onsuccess = () => {
        this.response = openRequest.result;
        const store = this.response
          .transaction([this.objectStorename], 'readonly')
          .objectStore(this.objectStorename);
        const request = store.openCursor();
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            list.push(cursor.value as T);
            cursor.continue();
          } else {
            this.response?.close();
            resolve(list);
          }
        };
      };
    });
  }

  async get(): Promise<T> {
    const openRequest = window.indexedDB.open('Teleuzi', INDEXED_DB_VERSION + 1);
    return new Promise<T>((resolve) => {
      openRequest.onsuccess = () => {
        this.response = openRequest.result;
        const store = this.response
          .transaction([this.objectStorename], 'readonly')
          .objectStore(this.objectStorename);
        const request = store.openCursor();
        request.onsuccess = () => {
          const cursor = request.result;
          resolve(cursor?.value as T);
        };
      };
    });
  }
}
