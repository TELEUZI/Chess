import { IndexedDBStores, INDEXED_DB_NAME, INDEXED_DB_VERSION } from '@chess/config';

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

  public create(entity: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
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
          resolve();
        };
        item.onerror = () => {
          reject(new Error('Put request error'));
        };
      };
      openRequest.onerror = () => {
        reject(new Error('IndexedDB open request error'));
      };
    });
  }

  public findAll(): Promise<T[]> {
    const openRequest = window.indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION + 1);
    const list: T[] = [];
    return new Promise<T[]>((resolve, reject) => {
      openRequest.onerror = () => {
        reject(new Error('Request error'));
      };
      openRequest.onsuccess = () => {
        this.response = openRequest.result;
        const store = this.response
          .transaction([this.objectStorename], 'readonly')
          .objectStore(this.objectStorename);
        const request = store.openCursor();
        request.onerror = () => {
          reject(new Error('Cursor error'));
        };
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

  public get(): Promise<T> {
    const openRequest = window.indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION + 1);
    return new Promise<T>((resolve, reject) => {
      openRequest.onsuccess = () => {
        this.response = openRequest.result;
        const store = this.response
          .transaction([this.objectStorename], 'readonly')
          .objectStore(this.objectStorename);
        const request = store.openCursor();
        request.onerror = () => {
          reject(new Error('Cursor error'));
        };
        request.onsuccess = () => {
          const cursor = request.result;
          resolve(cursor?.value as T);
        };
      };
    });
  }

  private createStores(): void {
    const openRequest = window.indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION + 1);
    openRequest.onupgradeneeded = () => {
      this.response = openRequest.result;
      const stores = [
        {
          name: IndexedDBStores.USERS,
          options: { keyPath: 'name', autoIncrement: true },
        },
        { name: IndexedDBStores.GAME_CONFIG, options: { autoIncrement: true } },
        {
          name: IndexedDBStores.REPLAY_STORE,
          options: { keyPath: 'date', autoIncrement: true },
        },
      ];
      stores.forEach((store) => {
        this.response?.createObjectStore(store.name, store.options);
      });
      this.response.close();
    };
  }
}
