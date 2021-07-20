const DATA_VERSION = 1;
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
    const openRequest = window.indexedDB.open('Teleuzi', DATA_VERSION + 1);
    openRequest.onupgradeneeded = async () => {
      this.response = openRequest.result;
      this.response.createObjectStore('Users', {
        keyPath: 'name',
        autoIncrement: true,
      });
      this.response.createObjectStore('GameConfig', {
        autoIncrement: true,
      });
      this.response.createObjectStore('ReplaysStore', {
        keyPath: 'date',
        autoIncrement: true,
      });
      this.response.close();
    };
  }

  create(entity: T): void {
    const openRequest = window.indexedDB.open('Teleuzi', DATA_VERSION + 1);
    openRequest.onupgradeneeded = () => {
      this.response = openRequest.result;
      this.response.createObjectStore(this.objectStorename, {
        keyPath: this.keyPath,
        autoIncrement: true,
      });
    };
    openRequest.onblocked = () => console.log('block');
    openRequest.onerror = () => console.log('error');
    openRequest.onsuccess = async () => {
      this.response = openRequest.result;
      console.log(this.response);
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
    const openRequest = window.indexedDB.open('Teleuzi', DATA_VERSION + 1);
    const list: Array<T> = [];
    let request: IDBRequest;
    return new Promise<T[]>((resolve, reject) => {
      openRequest.onblocked = () => console.log('block');
      openRequest.onerror = () => reject();
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
    const openRequest = window.indexedDB.open('Teleuzi', DATA_VERSION + 1);
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
