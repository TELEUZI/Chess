import type { User } from '@chess/game-common';
import { UserDao } from '../models/user-dao';

const OBJECT_STORE_KEY = 'name';
const OBJECT_STORE_NAME = 'Users';

export class UserDaoService {
  private static instance: UserDaoService | null = null;

  private readonly dao: UserDao;

  private currentUser: User | null = null;

  private constructor() {
    this.dao = new UserDao(OBJECT_STORE_NAME, OBJECT_STORE_KEY, undefined);
  }

  public static getInstance(): UserDaoService {
    if (!UserDaoService.instance) {
      UserDaoService.instance = new UserDaoService();
    }
    return UserDaoService.instance;
  }

  public setData(user: User): Promise<void> {
    this.currentUser = user;
    return this.dao.create(user);
  }

  public async getAvatar(): Promise<ArrayBuffer | string> {
    return (await this.findCurrentByEmail(this.currentUser))?.avatar ?? '';
  }

  private async findCurrentByEmail(userToFind: User | null): Promise<User | null> {
    return userToFind
      ? (await this.dao.findAll()).find((user) => user.name === userToFind.name) ?? null
      : null;
  }
}
