const DATA_VERSION = 8;
export default abstract class BaseDao<T> {
  openRequest: IDBOpenDBRequest;

  response: IDBDatabase;

  entity: T;

  objectStorename: string;

  keyPath: string;

  key: number;

  constructor(objectStorename: string, keyPath: string, key: number) {
    this.objectStorename = objectStorename;
    this.keyPath = keyPath;
    this.key = key;
    this.createStores();
  }

  createStores(): void {
    let openRequest = window.indexedDB.open('Teleuzi', DATA_VERSION + 1);
    openRequest.onupgradeneeded = async () => {
      this.response = openRequest.result;
      this.response.createObjectStore('users', {
        keyPath: 'email',
        autoIncrement: true,
      });
      this.response.close();
      openRequest = window.indexedDB.open('Teleuzi', DATA_VERSION + 2);
      openRequest.onupgradeneeded = () => {
        this.response = openRequest.result;
        this.response.createObjectStore('GameConfig', {
          autoIncrement: true,
        });
        this.response.close();
      };
    };
  }

  create(entity: T): void {
    const openRequest = window.indexedDB.open('Teleuzi', DATA_VERSION + 2);
    openRequest.onupgradeneeded = () => {
      this.response = openRequest.result;
      this.response.createObjectStore(this.objectStorename, {
        keyPath: this.keyPath,
        autoIncrement: true,
      });
    };
    openRequest.onsuccess = async () => {
      this.response = openRequest.result;
      const item = this.response
        .transaction([this.objectStorename], 'readwrite')
        .objectStore(this.objectStorename)
        .put(entity, this.key);
      item.onsuccess = () => {
        this.response.close();
      };
    };
  }

  public async findAll(): Promise<T[]> {
    const openRequest = window.indexedDB.open('Teleuzi', DATA_VERSION + 2);
    const list: Array<T> = [];
    let request: IDBRequest;
    return new Promise<T[]>((resolve) => {
      openRequest.onsuccess = () => {
        this.response = openRequest.result;
        const store = this.response
          .transaction([this.objectStorename], 'readonly')
          .objectStore(this.objectStorename);
        request = store.openCursor();
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            list.push(cursor.value);
            cursor.continue();
          } else {
            this.response.close();
            resolve(list);
          }
        };
      };
    });
  }

  async get(): Promise<T> {
    const openRequest = window.indexedDB.open('Teleuzi', DATA_VERSION + 2);
    return new Promise<T>((resolve) => {
      openRequest.onsuccess = () => {
        this.response = openRequest.result;
        const store = this.response
          .transaction([this.objectStorename], 'readonly')
          .objectStore(this.objectStorename);
        const request = store.openCursor();
        request.onsuccess = () => {
          const cursor = request.result;
          resolve(cursor.value);
        };
      };
    });
  }
}
