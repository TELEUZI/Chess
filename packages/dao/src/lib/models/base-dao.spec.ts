import { BaseDao } from '@chess/dao';
import { IndexedDBStores } from '@chess/config';
import type { Replay } from '@chess/game-common';
import { GameMode } from '@chess/game-common';

describe('BaseDao', () => {
  // create a new instance of BaseDao with valid parameters and ensure it is created successfully
  it('should create a new instance of BaseDao with valid parameters', () => {
    const baseDao = new BaseDao<Replay>(IndexedDBStores.REPLAY_STORE, 'date');
    expect(baseDao).toBeInstanceOf(BaseDao);
  });

  // create a new entity using create() method and ensure it is added to the object store
  it('should create a new entity using create() method and add it to the object store', async () => {
    const baseDao = new BaseDao<Replay>(IndexedDBStores.REPLAY_STORE, 'date');
    const entity: Replay = {
      date: 1234567890,
      history: [],
      mode: GameMode.SINGLE,
      players: [],
      result: null,
      moves: 0,
    };
    await baseDao.create(entity);
    const entities = await baseDao.findAll();
    expect(entities).toContain(entity);
  });

  // retrieve all entities using findAll() method and ensure the correct list is returned
  it('should retrieve all entities using findAll() method and return the correct list', async () => {
    const baseDao = new BaseDao<Replay>(IndexedDBStores.REPLAY_STORE, 'date');
    const entity1: Replay = {
      date: 1234567890,
      history: [],
      mode: GameMode.SINGLE,
      players: [],
      result: null,
      moves: 0,
    };
    const entity2: Replay = {
      date: 9876543210,
      history: [],
      mode: GameMode.SINGLE,
      players: [],
      result: null,
      moves: 0,
    };
    await baseDao.create(entity1);
    await baseDao.create(entity2);
    const entities = await baseDao.findAll();
    expect(entities).toContain(entity1);
    expect(entities).toContain(entity2);
  });

  // create a new instance of BaseDao with invalid parameters and ensure it throws an error
  it('should throw an error when creating a new instance of BaseDao with invalid parameters', () => {
    expect(() => new BaseDao<Replay>('InvalidStore', 'date')).toThrowError();
  });

  // create a new entity using create() method with invalid parameters and ensure it throws an error
  it('should throw an error when creating a new entity using create() method with invalid parameters', async () => {
    const baseDao = new BaseDao<Replay>(IndexedDBStores.REPLAY_STORE, 'date');
    const invalidEntity = {
      invalidProperty: 'Invalid',
    };
    await expect(baseDao.create(invalidEntity as never)).rejects.toThrowError();
  });

  // retrieve a single entity using get() method when no entities exist and ensure it returns null
  it('should retrieve a single entity using get() method when no entities exist and return null', async () => {
    const baseDao = new BaseDao<Replay>(IndexedDBStores.REPLAY_STORE, 'date');
    const entity = await baseDao.get();
    expect(entity).toBeNull();
  });
});
